import { imageUploadRequestSchema, productSchema, productsListQuerySchema, updateProductSchema } from '@fonex/shared';
import { createZodDto } from 'nestjs-zod';

export class ProductDto extends createZodDto(productSchema) {}
export class UpdateProductDto extends createZodDto(updateProductSchema) {}
export class ImageUploadRequestDto extends createZodDto(imageUploadRequestSchema) {}
export class ProductsListQueryDto extends createZodDto(productsListQuerySchema) {}
