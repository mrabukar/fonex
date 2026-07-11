import { z } from "zod";
import { partnerTypeValues } from "./partner.schema";
import { newsStatusValues } from "./news.schema";

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
});

export const productsListQuerySchema = paginationQuerySchema.extend({
  category: z.string().trim().optional(),
});

export const categoriesListQuerySchema = paginationQuerySchema;

export const partnersListQuerySchema = paginationQuerySchema.extend({
  type: z.enum(partnerTypeValues).optional(),
});

export const newsListQuerySchema = paginationQuerySchema;

export const newsAdminListQuerySchema = paginationQuerySchema.extend({
  status: z.enum(newsStatusValues).optional(),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
export type ProductsListQuery = z.infer<typeof productsListQuerySchema>;
export type CategoriesListQuery = z.infer<typeof categoriesListQuerySchema>;
export type PartnersListQuery = z.infer<typeof partnersListQuerySchema>;
export type NewsListQuery = z.infer<typeof newsListQuerySchema>;
export type NewsAdminListQuery = z.infer<typeof newsAdminListQuerySchema>;

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export function toPaginatedResult<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number,
): PaginatedResult<T> {
  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize) || 1,
  };
}
