import { z } from "zod";

const propertyTypeEnum = z.enum(["apartment", "villa", "house", "plot"]);

export const createPropertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(255),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.coerce.number().positive("Price must be a positive number"),
  city: z.string().min(2).max(100),
  location: z.string().min(5, "Location must be at least 5 characters").max(255),
  propertyType: propertyTypeEnum,
  bedrooms: z.coerce.number().int().min(0).max(20),
  bathrooms: z.coerce.number().int().min(0).max(20),
  area: z.coerce.number().positive("Area must be a positive number"),
  images: z
    .array(z.string().url("Each image must be a valid URL"))
    .max(10, "Maximum 10 images allowed")
    .default([]),
});

export const updatePropertySchema = createPropertySchema.partial();

export const propertyQuerySchema = z.object({
  city: z.string().optional(),
  bathrooms: z.coerce.number().int().optional(),
  location: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  propertyType: propertyTypeEnum.optional(),
  bedrooms: z.coerce.number().int().optional(),
  sort: z
    .enum(["price_asc", "price_desc", "newest", "oldest"])
    .optional()
    .default("newest"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
export type PropertyQueryInput = z.infer<typeof propertyQuerySchema>;
