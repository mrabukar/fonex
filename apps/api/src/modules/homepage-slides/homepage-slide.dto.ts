import {
  homepageSettingsSchema,
  homepageSlideSchema,
  imageUploadRequestSchema,
  reorderHomepageSlidesSchema,
  updateHomepageSlideSchema,
} from '@fonex/shared';
import { createZodDto } from 'nestjs-zod';

export class HomepageSlideDto extends createZodDto(homepageSlideSchema) {}
export class UpdateHomepageSlideDto extends createZodDto(updateHomepageSlideSchema) {}
export class ReorderHomepageSlidesDto extends createZodDto(reorderHomepageSlidesSchema) {}
export class HomepageSettingsDto extends createZodDto(homepageSettingsSchema) {}
export class ImageUploadRequestDto extends createZodDto(imageUploadRequestSchema) {}
