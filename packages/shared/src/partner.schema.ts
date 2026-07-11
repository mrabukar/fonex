import { z } from "zod";

export const partnerTypeValues = ["manufacturer", "retailer", "tech_provider", "community"] as const;

export const partnerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(partnerTypeValues),
  websiteUrl: z.string().trim().optional(),
  description: z.string().trim().optional(),
  order: z.coerce.number().int().default(0),
});

export const updatePartnerSchema = partnerSchema.partial();

export type PartnerInput = z.infer<typeof partnerSchema>;
export type UpdatePartnerInput = z.infer<typeof updatePartnerSchema>;