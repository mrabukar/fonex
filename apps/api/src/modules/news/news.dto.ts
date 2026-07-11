import {
  imageUploadRequestSchema,
  newsAdminListQuerySchema,
  newsListQuerySchema,
  newsSchema,
  updateNewsSchema,
} from '@fonex/shared';
import { createZodDto } from 'nestjs-zod';

export class NewsDto extends createZodDto(newsSchema) {}
export class UpdateNewsDto extends createZodDto(updateNewsSchema) {}
export class ImageUploadRequestDto extends createZodDto(imageUploadRequestSchema) {}
export class NewsListQueryDto extends createZodDto(newsListQuerySchema) {}
export class NewsAdminListQueryDto extends createZodDto(newsAdminListQuerySchema) {}
