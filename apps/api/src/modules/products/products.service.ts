import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { ProductInput, ProductsListQuery, UpdateProductInput } from '@fonex/shared';
import { deviceTypeValues, productStatusValues, toPaginatedResult } from '@fonex/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { R2Service } from '../../r2/r2.service';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly r2: R2Service,
  ) {}

  async findAll(query: ProductsListQuery) {
    const { page, pageSize, search, category } = query;
    const skip = (page - 1) * pageSize;
    const where = this.buildWhere({ search, category });

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: pageSize,
      }),
      this.prisma.product.count({ where }),
    ]);

    return toPaginatedResult(data, total, page, pageSize);
  }

  async findOne(id: string) {
    return this.ensureExists(id);
  }

  create(input: ProductInput) {
    return this.withValidCategory(() =>
      this.prisma.product.create({ data: input, include: { category: true } }),
    );
  }

  async update(id: string, input: UpdateProductInput) {
    await this.ensureExists(id);
    return this.withValidCategory(() =>
      this.prisma.product.update({ where: { id }, data: input, include: { category: true } }),
    );
  }

  async remove(id: string) {
    const product = await this.ensureExists(id);
    if (product.imageUrl) {
      try {
        await this.r2.deleteByPublicUrl(product.imageUrl);
      } catch (error) {
        this.logger.warn(`Failed to delete R2 object for product ${id}: ${error}`);
      }
    }
    await this.prisma.product.delete({ where: { id } });
    return { deleted: true };
  }

  async createImageUploadUrl(id: string, contentType: string) {
    const product = await this.ensureExists(id);
    const previousImageUrl = product.imageUrl;
    const { uploadUrl, publicUrl } = await this.r2.createUploadUrl(contentType);
    await this.prisma.product.update({ where: { id }, data: { imageUrl: publicUrl } });
    if (previousImageUrl && previousImageUrl !== publicUrl) {
      try {
        await this.r2.deleteByPublicUrl(previousImageUrl);
      } catch (error) {
        this.logger.warn(`Failed to delete previous R2 object for product ${id}: ${error}`);
      }
    }
    return { uploadUrl, imageUrl: publicUrl };
  }

  private buildWhere({
    search,
    category,
  }: {
    search?: string;
    category?: string;
  }): Prisma.ProductWhereInput {
    const filters: Prisma.ProductWhereInput[] = [];

    if (category) {
      filters.push({ category: { slug: category } });
    }

    if (search) {
      const q = search.toLowerCase();
      const statusMatches = productStatusValues.filter((s) => s.includes(q));
      const typeMatches = deviceTypeValues.filter((t) => t.includes(q));

      filters.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { category: { name: { contains: search, mode: 'insensitive' } } },
          ...(statusMatches.length > 0 ? [{ status: { in: statusMatches } }] : []),
          ...(typeMatches.length > 0 ? [{ type: { in: typeMatches } }] : []),
        ],
      });
    }

    return filters.length > 0 ? { AND: filters } : {};
  }

  private async ensureExists(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  private async withValidCategory<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new BadRequestException('Category does not exist');
      }
      throw error;
    }
  }
}
