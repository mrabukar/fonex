import { z } from "zod";

export const homepageSlideStatusValues = ["visible", "hidden", "scheduled", "ended"] as const;

export const homepageDateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a date in YYYY-MM-DD format");

export const homepageSlideSchema = z
  .object({
    title: z.string().trim().min(1, "Name is required").max(120),
    imageDescription: z.string().trim().max(240).optional(),
    caption: z.string().trim().max(160).optional(),
    isActive: z.boolean().default(true),
    startsAt: homepageDateString.optional().nullable(),
    endsAt: homepageDateString.optional().nullable(),
    productId: z.string().min(1).optional().nullable(),
  })
  .refine(
    (value) => !value.startsAt || !value.endsAt || value.startsAt <= value.endsAt,
    { message: "Start date must be on or before the end date", path: ["endsAt"] },
  );

export const updateHomepageSlideSchema = z
  .object({
    title: z.string().trim().min(1, "Name is required").max(120).optional(),
    imageDescription: z.string().trim().max(240).optional().nullable(),
    caption: z.string().trim().max(160).optional().nullable(),
    isActive: z.boolean().optional(),
    startsAt: homepageDateString.optional().nullable(),
    endsAt: homepageDateString.optional().nullable(),
    productId: z.string().min(1).optional().nullable(),
  })
  .refine(
    (value) => !value.startsAt || !value.endsAt || value.startsAt <= value.endsAt,
    { message: "Start date must be on or before the end date", path: ["endsAt"] },
  );

export const reorderHomepageSlidesSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
});

export const homepageSettingsSchema = z.object({
  autoplayMs: z.number().int().min(1000).max(15000),
});

export type HomepageSlideInput = z.infer<typeof homepageSlideSchema>;
export type UpdateHomepageSlideInput = z.infer<typeof updateHomepageSlideSchema>;
export type ReorderHomepageSlidesInput = z.infer<typeof reorderHomepageSlidesSchema>;
export type HomepageSettingsInput = z.infer<typeof homepageSettingsSchema>;
export type HomepageSlideStatus = (typeof homepageSlideStatusValues)[number];
