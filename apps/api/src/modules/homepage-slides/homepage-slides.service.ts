import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { HomepageSlide, Prisma } from '@prisma/client';
import type {
  HomepageSettingsInput,
  HomepageSlideInput,
  HomepageSlideStatus,
  ReorderHomepageSlidesInput,
  UpdateHomepageSlideInput,
} from '@fonex/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { R2Service } from '../../r2/r2.service';
import { endOfDayInMogadishu, startOfDayInMogadishu, toMogadishuDateInput } from './homepage-dates';

const SETTINGS_ID = 'default';
const DEFAULT_AUTOPLAY_MS = 3000;

const adminProductSelect = { id: true, name: true, imageUrl: true } as const;

type SlideWithProduct = Prisma.HomepageSlideGetPayload<{
  include: { product: { select: typeof adminProductSelect } };
}>;

@Injectable()
export class HomepageSlidesService {
  private readonly logger = new Logger(HomepageSlidesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly r2: R2Service,
  ) {}

  async findVisible() {
    const now = new Date();
    return this.prisma.homepageSlide.findMany({
      where: {
        isActive: true,
        imageUrl: { not: null },
        AND: [
          { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
          { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
        ],
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      select: {
        id: true,
        imageUrl: true,
        imageDescription: true,
        caption: true,
        bg: true,
        productId: true,
      },
    });
  }

  async findAllForAdmin() {
    const now = new Date();
    const slides = await this.prisma.homepageSlide.findMany({
      include: { product: { select: adminProductSelect } },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
    return slides.map((slide) => this.toAdminSlide(slide, now));
  }

  async create(input: HomepageSlideInput) {
    await this.assertProduct(input.productId);
    const nextOrder = await this.nextOrder();
    const slide = await this.prisma.homepageSlide.create({
      data: {
        title: input.title,
        imageDescription: emptyToNull(input.imageDescription),
        caption: emptyToNull(input.caption),
        isActive: input.isActive ?? true,
        startsAt: input.startsAt ? startOfDayInMogadishu(input.startsAt) : null,
        endsAt: input.endsAt ? endOfDayInMogadishu(input.endsAt) : null,
        productId: input.productId ?? null,
        order: nextOrder,
      },
      include: { product: { select: adminProductSelect } },
    });
    return this.toAdminSlide(slide);
  }

  async update(id: string, input: UpdateHomepageSlideInput) {
    const existing = await this.ensureExists(id);
    await this.assertProduct(input.productId);

    const nextStartsAt =
      input.startsAt === undefined
        ? existing.startsAt
        : input.startsAt
          ? startOfDayInMogadishu(input.startsAt)
          : null;
    const nextEndsAt =
      input.endsAt === undefined
        ? existing.endsAt
        : input.endsAt
          ? endOfDayInMogadishu(input.endsAt)
          : null;

    if (nextStartsAt && nextEndsAt && nextStartsAt > nextEndsAt) {
      throw new BadRequestException('Start date must be on or before the end date');
    }

    const slide = await this.prisma.homepageSlide.update({
      where: { id },
      data: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.imageDescription !== undefined
          ? { imageDescription: emptyToNull(input.imageDescription) }
          : {}),
        ...(input.caption !== undefined ? { caption: emptyToNull(input.caption) } : {}),
        ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
        ...(input.startsAt !== undefined ? { startsAt: nextStartsAt } : {}),
        ...(input.endsAt !== undefined ? { endsAt: nextEndsAt } : {}),
        ...(input.productId !== undefined ? { productId: input.productId } : {}),
      },
      include: { product: { select: adminProductSelect } },
    });
    return this.toAdminSlide(slide);
  }

  async reorder(input: ReorderHomepageSlidesInput) {
    const existing = await this.prisma.homepageSlide.findMany({
      select: { id: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
    const existingIds = existing.map((slide) => slide.id);
    const incoming = input.ids;

    if (incoming.length !== existingIds.length) {
      throw new BadRequestException('Reorder must include every homepage image');
    }

    const existingSet = new Set(existingIds);
    const incomingSet = new Set(incoming);
    if (incomingSet.size !== incoming.length || incoming.some((id) => !existingSet.has(id))) {
      throw new BadRequestException('Reorder list does not match the current images');
    }

    await this.prisma.$transaction(
      incoming.map((id, order) =>
        this.prisma.homepageSlide.update({ where: { id }, data: { order } }),
      ),
      { timeout: 20_000 },
    );

    return this.findAllForAdmin();
  }

  async remove(id: string) {
    const slide = await this.ensureExists(id);
    await this.deleteStoredImage(slide.imageUrl, id);
    await this.prisma.homepageSlide.delete({ where: { id } });
    await this.compactOrder();
    return { deleted: true };
  }

  async createImageUploadUrl(id: string, contentType: string) {
    const slide = await this.ensureExists(id);
    const previousImageUrl = slide.imageUrl;
    const { uploadUrl, publicUrl } = await this.r2.createUploadUrl(contentType, 'homepage');
    const updated = await this.prisma.homepageSlide.update({
      where: { id },
      data: { imageUrl: publicUrl },
      include: { product: { select: adminProductSelect } },
    });
    if (previousImageUrl && previousImageUrl !== publicUrl) {
      await this.deleteStoredImage(previousImageUrl, id);
    }
    return {
      uploadUrl,
      imageUrl: publicUrl,
      slide: this.toAdminSlide(updated),
    };
  }

  async getSettings() {
    return this.ensureSettings();
  }

  async updateSettings(input: HomepageSettingsInput) {
    await this.ensureSettings();
    return this.prisma.homepageSettings.update({
      where: { id: SETTINGS_ID },
      data: { autoplayMs: input.autoplayMs },
    });
  }

  private async nextOrder() {
    const last = await this.prisma.homepageSlide.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    return (last?.order ?? -1) + 1;
  }

  private async compactOrder() {
    const slides = await this.prisma.homepageSlide.findMany({
      select: { id: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
    if (slides.length === 0) return;
    await this.prisma.$transaction(
      slides.map((slide, order) =>
        this.prisma.homepageSlide.update({ where: { id: slide.id }, data: { order } }),
      ),
      { timeout: 20_000 },
    );
  }

  private async assertProduct(productId: string | null | undefined) {
    if (!productId) return;
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });
    if (!product) throw new BadRequestException('That product no longer exists');
  }

  private async ensureExists(id: string) {
    const slide = await this.prisma.homepageSlide.findUnique({ where: { id } });
    if (!slide) throw new NotFoundException('Homepage image not found');
    return slide;
  }

  private async ensureSettings() {
    const existing = await this.prisma.homepageSettings.findUnique({
      where: { id: SETTINGS_ID },
    });
    if (existing) return existing;
    return this.prisma.homepageSettings.create({
      data: { id: SETTINGS_ID, autoplayMs: DEFAULT_AUTOPLAY_MS },
    });
  }

  private async deleteStoredImage(url: string | null, id: string) {
    if (!url) return;
    try {
      await this.r2.deleteByPublicUrl(url);
    } catch (error) {
      this.logger.warn(`Failed to delete R2 object for homepage slide ${id}: ${error}`);
    }
  }

  private toAdminSlide(slide: SlideWithProduct | HomepageSlide, now = new Date()) {
    const product = 'product' in slide ? slide.product : null;
    return {
      id: slide.id,
      title: slide.title,
      imageUrl: slide.imageUrl,
      imageDescription: slide.imageDescription,
      caption: slide.caption,
      bg: slide.bg,
      order: slide.order,
      isActive: slide.isActive,
      startsAt: slide.startsAt ? toMogadishuDateInput(slide.startsAt) : null,
      endsAt: slide.endsAt ? toMogadishuDateInput(slide.endsAt) : null,
      productId: slide.productId,
      product,
      status: computeStatus(slide, now),
      createdAt: slide.createdAt,
      updatedAt: slide.updatedAt,
    };
  }
}

function emptyToNull(value: string | null | undefined) {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function computeStatus(
  slide: Pick<HomepageSlide, 'isActive' | 'startsAt' | 'endsAt'>,
  now: Date,
): HomepageSlideStatus {
  if (!slide.isActive) return 'hidden';
  if (slide.startsAt && slide.startsAt > now) return 'scheduled';
  if (slide.endsAt && slide.endsAt < now) return 'ended';
  return 'visible';
}
