import { z } from "zod";

export const newsStatusValues = ["draft", "published"] as const;

export const newsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, and hyphen-separated"),
  excerpt: z.string().trim().optional(),
  body: z.string().min(1, "Body is required"),
  status: z.enum(newsStatusValues).default("draft"),
});

export const updateNewsSchema = newsSchema.partial();

export type NewsInput = z.infer<typeof newsSchema>;
export type UpdateNewsInput = z.infer<typeof updateNewsSchema>;
