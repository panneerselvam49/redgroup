import { z } from "zod";

export const createInquirySchema = z.object({
  propertyId: z.coerce.number().int().positive("Property ID is required"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message cannot exceed 1000 characters"),
});

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;
