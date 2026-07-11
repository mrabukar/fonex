import { imageUploadRequestSchema, partnerSchema, partnersListQuerySchema, updatePartnerSchema } from '@fonex/shared';
import { createZodDto } from 'nestjs-zod';

export class PartnerDto extends createZodDto(partnerSchema) {}
export class UpdatePartnerDto extends createZodDto(updatePartnerSchema) {}
export class ImageUploadRequestDto extends createZodDto(imageUploadRequestSchema) {}
export class PartnersListQueryDto extends createZodDto(partnersListQuerySchema) {}
