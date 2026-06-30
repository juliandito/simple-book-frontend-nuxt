import { z } from 'zod'

/**
 * Shared pagination meta schema — mirrors PaginationMeta in types/api.ts
 * and validates actual API responses at runtime.
 */
export const PaginationMetaSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
})

export type PaginationMeta = z.infer<typeof PaginationMetaSchema>

/**
 * Generic API response schema factory.
 * Usage: ApiResponseSchema(BookSchema)
 */
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    message: z.string().optional(),
    success: z.boolean(),
  })

/**
 * Generic paginated response schema factory.
 * Usage: PaginatedResponseSchema(BookSchema)
 */
export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    pagination: PaginationMetaSchema,
    success: z.boolean(),
  })
