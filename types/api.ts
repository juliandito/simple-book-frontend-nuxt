/**
 * Generic API response wrapper used by all backend endpoints.
 */
export type ApiResponse<T> = {
  data: T
  message?: string
  success: boolean
}

/**
 * Paginated API response wrapper.
 */
export type PaginatedResponse<T> = {
  data: T[]
  pagination: PaginationMeta
  success: boolean
}

/**
 * Pagination metadata returned by paginated endpoints.
 */
export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

/**
 * Common query parameters for paginated list endpoints.
 */
export type PaginationQuery = {
  page?: number
  limit?: number
  search?: string
}

/**
 * Generic API error shape.
 */
export type ApiError = {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}
