import { z } from 'zod'
import { ApiResponseSchema, PaginatedResponseSchema } from './common'

// ---------------------------------------------------------------------------
// Domain schema — single source of truth for the Book entity
// ---------------------------------------------------------------------------

export const BookSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  isbn: z
    .string()
    .regex(/^(97[89])?\d{9}(\d|X)$/, 'Invalid ISBN')
    .optional()
    .or(z.literal('')),
  description: z.string().optional(),
  publishedYear: z.number().int().min(1000).max(new Date().getFullYear()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
})

export type Book = z.infer<typeof BookSchema>

// ---------------------------------------------------------------------------
// Request schemas — used for form validation and outgoing API payloads
// ---------------------------------------------------------------------------

export const CreateBookSchema = BookSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export type CreateBookRequest = z.infer<typeof CreateBookSchema>

export const UpdateBookSchema = CreateBookSchema.partial()

export type UpdateBookRequest = z.infer<typeof UpdateBookSchema>

// ---------------------------------------------------------------------------
// Response schemas — used to validate API responses at runtime
// ---------------------------------------------------------------------------

export const BookResponseSchema = ApiResponseSchema(BookSchema)
export type BookResponse = z.infer<typeof BookResponseSchema>

export const BooksResponseSchema = PaginatedResponseSchema(BookSchema)
export type BooksResponse = z.infer<typeof BooksResponseSchema>
