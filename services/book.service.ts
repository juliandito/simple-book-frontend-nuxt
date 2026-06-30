import { useApiClient } from './api'
import type { ApiResponse, PaginatedResponse, PaginationQuery } from '~/types/api'
import type { Book, CreateBookRequest, UpdateBookRequest } from '~/schemas/book'

const ENDPOINT = '/books'

/**
 * Book service — all HTTP interactions for the books domain.
 * Only this service may call the API client for book-related operations.
 * No UI logic lives here.
 */
export const bookService = {
  /**
   * Fetch a paginated list of books.
   */
  async getBooks(query?: PaginationQuery): Promise<PaginatedResponse<Book>> {
    const api = useApiClient()
    const params: Record<string, unknown> = {
      page: query?.page ?? 1,
      limit: query?.limit ?? 10,
      ...(query?.search ? { search: query.search } : {}),
    }
    return api.get<PaginatedResponse<Book>>(ENDPOINT, params)
  },

  /**
   * Fetch a single book by ID.
   */
  async getBook(id: string): Promise<ApiResponse<Book>> {
    const api = useApiClient()
    return api.get<ApiResponse<Book>>(`${ENDPOINT}/${id}`)
  },

  /**
   * Create a new book.
   */
  async createBook(payload: CreateBookRequest): Promise<ApiResponse<Book>> {
    const api = useApiClient()
    return api.post<ApiResponse<Book>>(ENDPOINT, payload)
  },

  /**
   * Update an existing book.
   */
  async updateBook(id: string, payload: UpdateBookRequest): Promise<ApiResponse<Book>> {
    const api = useApiClient()
    return api.put<ApiResponse<Book>>(`${ENDPOINT}/${id}`, payload)
  },

  /**
   * Delete a book by ID.
   */
  async deleteBook(id: string): Promise<ApiResponse<null>> {
    const api = useApiClient()
    return api.delete<ApiResponse<null>>(`${ENDPOINT}/${id}`)
  },
}
