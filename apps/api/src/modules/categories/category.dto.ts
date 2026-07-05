import { categorySchema, categoriesListQuerySchema, updateCategorySchema } from '@fonex/shared';
import { createZodDto } from 'nestjs-zod';

export class CategoryDto extends createZodDto(categorySchema) {}
export class UpdateCategoryDto extends createZodDto(updateCategorySchema) {}
export class CategoriesListQueryDto extends createZodDto(categoriesListQuerySchema) {}
