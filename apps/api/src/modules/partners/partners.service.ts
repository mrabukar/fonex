import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { PartnerInput, PartnersListQuery, UpdatePartnerInput } from '@fonex/shared';
import { partnerTypeValues, toPaginatedResult } from '@fonex/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { R2Service } from '../../r2/r2.service';

@Injectable()
export class PartnersService {
  private readonly logger = new Logger(PartnersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly r2: R2Service,
  ) {}

  async findAll(query: PartnersListQuery) {
    const { page, pageSize, search, type } = query;
    const skip = (page - 1) * pageSize;
    const where = this.buildWhere({ search, type });

    const [data, total] = await Promise.all([
      this.prisma.partner.findMany({
        where,
        orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
        skip,
        take: pageSize,
      }),
      this.prisma.partner.count({ where }),
    ]);

    return toPaginatedResult(data, total, page, pageSize);
  }

  async findOne(id: string) {
    return this.ensureExists(id);
  }

  create(input: PartnerInput) {
    return this.prisma.partner.create({ data: input });
  }

  async update(id: string, input: UpdatePartnerInput) {
    await this.ensureExists(id);
    return this.prisma.partner.update({ where: { id }, data: input });
  }

  async remove(id: string) {
    const partner = await this.ensureExists(id);
    if (partner.logoUrl) {
      try {
        await this.r2.deleteByPublicUrl(partner.logoUrl);
      } catch (error) {
        this.logger.warn(`Failed to delete R2 object for partner ${id}: ${error}`);
      }
    }
    await this.prisma.partner.delete({ where: { id } });
    return { deleted: true };
  }

  async createLogoUploadUrl(id: string, contentType: string) {
    const partner = await this.ensureExists(id);
    const previousLogoUrl = partner.logoUrl;
    const { uploadUrl, publicUrl } = await this.r2.createUploadUrl(contentType, 'partners');
    await this.prisma.partner.update({ where: { id }, data: { logoUrl: publicUrl } });
    if (previousLogoUrl && previousLogoUrl !== publicUrl) {
      try {
        await this.r2.deleteByPublicUrl(previousLogoUrl);
      } catch (error) {
        this.logger.warn(`Failed to delete previous R2 object for partner ${id}: ${error}`);
      }
    }
    return { uploadUrl, imageUrl: publicUrl };
  }

  private buildWhere({
    search,
    type,
  }: {
    search?: string;
    type?: string;
  }): Prisma.PartnerWhereInput {
    const filters: Prisma.PartnerWhereInput[] = [];

    if (type) {
      filters.push({ type: type as (typeof partnerTypeValues)[number] });
    }

    if (search) {
      const q = search.toLowerCase();
      const typeMatches = partnerTypeValues.filter((t) => t.includes(q));

      filters.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          ...(typeMatches.length > 0 ? [{ type: { in: typeMatches } }] : []),
        ],
      });
    }

    return filters.length > 0 ? { AND: filters } : {};
  }

  private async ensureExists(id: string) {
    const partner = await this.prisma.partner.findUnique({ where: { id } });
    if (!partner) throw new NotFoundException('Partner not found');
    return partner;
  }
}
