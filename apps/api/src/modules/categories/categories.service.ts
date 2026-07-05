import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { CategoriesListQuery, CategoryInput, UpdateCategoryInput } from '@fonex/shared';
import { toPaginatedResult } from '@fonex/shared';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: CategoriesListQuery) {
    const { page, pageSize, search } = query;
    const skip = (page - 1) * pageSize;
    const where = this.buildWhere(search);

    const [data, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip,
        take: pageSize,
      }),
      this.prisma.category.count({ where }),
    ]);

    return toPaginatedResult(data, total, page, pageSize);
  }

  create(input: CategoryInput) {
    return this.withUniqueSlugCheck(() => this.prisma.category.create({ data: input }));
  }

  async update(id: string, input: UpdateCategoryInput) {
    await this.ensureExists(id);
    return this.withUniqueSlugCheck(() => this.prisma.category.update({ where: { id }, data: input }));
  }

  async remove(id: string) {
    await this.ensureExists(id);

    const productCount = await this.prisma.product.count({
      where: { categoryId: id },
    });
    if (productCount > 0) {
      throw new ConflictException('Category is still in use by existing products');
    }

    await this.prisma.category.delete({ where: { id } });
    return { deleted: true };
  }

  private buildWhere(search?: string): Prisma.CategoryWhereInput {
    if (!search) return {};

    return {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ],
    };
  }

  private async ensureExists(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
  }

  private async withUniqueSlugCheck<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('A category with this slug already exists');
      }
      throw error;
    }
  }
}
