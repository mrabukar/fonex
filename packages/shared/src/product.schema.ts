import { z } from "zod";

export const productStatusValues = ["in_stock", "limited", "pre_order"] as const;
export const deviceTypeValues = [
  "phone",
  "watch",
  "charger",
  "earbuds",
  "case",
  "screen",
  "battery",
] as const;
export const imageContentTypeValues = ["image/jpeg", "image/png", "image/webp"] as const;

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  categoryId: z.string().min(1, "Category is required"),
  status: z.enum(productStatusValues).default("in_stock"),
  type: z.enum(deviceTypeValues),
});

export const updateProductSchema = productSchema.partial();

export const imageUploadRequestSchema = z.object({
  contentType: z.enum(imageContentTypeValues),
});

export type ProductInput = z.infer<typeof productSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ImageUploadRequestInput = z.infer<typeof imageUploadRequestSchema>;
