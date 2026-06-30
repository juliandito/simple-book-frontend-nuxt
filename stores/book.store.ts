import { defineStore } from 'pinia'
import { bookService } from '~/services/book.service'
import type { Book } from '~/schemas/book'
import type { PaginationMeta, PaginationQuery } from '~/types/api'

type BookStoreState = {
  books: Book[]
  currentBook: Book | null
  pagination: PaginationMeta | null
  loading: boolean
  error: string | null
}

/**
 * Pinia store for books — holds shared, cached book state.
 * Use this store when multiple pages or components need the same book data.
 * Page-local state (e.g. form open/closed) should stay inside composables/pages.
 */
export const useBookStore = defineStore('books', {
  state: (): BookStoreState => ({
    books: [],
    currentBook: null,
    pagination: null,
    loading: false,
    error: null,
  }),

  getters: {
    bookById: (state) => (id: string) => state.books.find((b) => b.id === id),
    hasBooks: (state) => state.books.length > 0,
    totalBooks: (state) => state.pagination?.total ?? 0,
  },

  actions: {
    async fetchBooks(query?: PaginationQuery) {
      this.loading = true
      this.error = null
      try {
        const response = await bookService.getBooks(query)
        this.books = response.data
        this.pagination = response.pagination
      } catch (err) {
        this.error = (err as { message?: string })?.message ?? 'Failed to load books'
      } finally {
        this.loading = false
      }
    },

    async fetchBook(id: string) {
      this.loading = true
      this.error = null
      try {
        const response = await bookService.getBook(id)
        this.currentBook = response.data
      } catch (err) {
        this.error = (err as { message?: string })?.message ?? 'Failed to load book'
      } finally {
        this.loading = false
      }
    },

    async removeBook(id: string) {
      this.loading = true
      this.error = null
      try {
        await bookService.deleteBook(id)
        this.books = this.books.filter((b) => b.id !== id)
        if (this.pagination) {
          this.pagination = { ...this.pagination, total: this.pagination.total - 1 }
        }
      } catch (err) {
        this.error = (err as { message?: string })?.message ?? 'Failed to delete book'
      } finally {
        this.loading = false
      }
    },

    clearCurrentBook() {
      this.currentBook = null
    },

    clearError() {
      this.error = null
    },
  },
})
