import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  phone: z.string().optional(),
  email: z.string().email("Please enter a valid email"),
  interest: z.string().min(1, "Please select an option"),
  message: z.string().min(10, "Please tell us a bit more"),
});

export type ContactInput = z.infer<typeof contactSchema>;
