import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import sanitizeHtml from 'sanitize-html';
import type { NewsAdminListQuery, NewsInput, NewsListQuery, UpdateNewsInput } from '@fonex/shared';
import { toPaginatedResult } from '@fonex/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { R2Service } from '../../r2/r2.service';

const ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'em',
  'u',
  's',
  'h1',
  'h2',
  'h3',
  'h4',
  'ul',
  'ol',
  'li',
  'a',
  'blockquote',
  'code',
  'pre',
];

function sanitizeBody(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: { a: ['href', 'target', 'rel'] },
    allowedSchemes: ['http', 'https', 'mailto'],
  });
}

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly r2: R2Service,
  ) {}

  async findPublished(query: NewsListQuery) {
    const { page, pageSize, search } = query;
    const skip = (page - 1) * pageSize;
    const where: Prisma.NewsArticleWhereInput = {
      status: 'published',
      ...(search ? { title: { contains: search, mode: 'insensitive' as const } } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.newsArticle.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: pageSize,
      }),
      this.prisma.newsArticle.count({ where }),
    ]);

    return toPaginatedResult(data, total, page, pageSize);
  }

  async findAllForAdmin(query: NewsAdminListQuery) {
    const { page, pageSize, search, status } = query;
    const skip = (page - 1) * pageSize;
    const where: Prisma.NewsArticleWhereInput = {
      ...(status ? { status } : {}),
      ...(search ? { title: { contains: search, mode: 'insensitive' as const } } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.newsArticle.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip,
        take: pageSize,
      }),
      this.prisma.newsArticle.count({ where }),
    ]);

    return toPaginatedResult(data, total, page, pageSize);
  }

  async findPublishedBySlug(slug: string) {
    const article = await this.prisma.newsArticle.findFirst({
      where: { slug, status: 'published' },
    });
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  create(input: NewsInput) {
    return this.withUniqueSlugCheck(() =>
      this.prisma.newsArticle.create({
        data: {
          ...input,
          body: sanitizeBody(input.body),
          publishedAt: input.status === 'published' ? new Date() : null,
        },
      }),
    );
  }

  async update(id: string, input: UpdateNewsInput) {
    const existing = await this.ensureExists(id);
    const data: Prisma.NewsArticleUpdateInput = { ...input };
    if (input.body !== undefined) data.body = sanitizeBody(input.body);
    if (input.status === 'published' && !existing.publishedAt) data.publishedAt = new Date();

    return this.withUniqueSlugCheck(() =>
      this.prisma.newsArticle.update({ where: { id }, data }),
    );
  }

  async remove(id: string) {
    const article = await this.ensureExists(id);
    if (article.imageUrl) {
      try {
        await this.r2.deleteByPublicUrl(article.imageUrl);
      } catch (error) {
        this.logger.warn(`Failed to delete R2 object for news article ${id}: ${error}`);
      }
    }
    await this.prisma.newsArticle.delete({ where: { id } });
    return { deleted: true };
  }

  async createImageUploadUrl(id: string, contentType: string) {
    const article = await this.ensureExists(id);
    const previousImageUrl = article.imageUrl;
    const { uploadUrl, publicUrl } = await this.r2.createUploadUrl(contentType, 'news');
    await this.prisma.newsArticle.update({ where: { id }, data: { imageUrl: publicUrl } });
    if (previousImageUrl && previousImageUrl !== publicUrl) {
      try {
        await this.r2.deleteByPublicUrl(previousImageUrl);
      } catch (error) {
        this.logger.warn(`Failed to delete previous R2 object for news article ${id}: ${error}`);
      }
    }
    return { uploadUrl, imageUrl: publicUrl };
  }

  private async ensureExists(id: string) {
    const article = await this.prisma.newsArticle.findUnique({ where: { id } });
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  private async withUniqueSlugCheck<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('An article with this slug already exists');
      }
      throw error;
    }
  }
}
