import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useBookStore } from '~/stores/book.store'
import { bookService } from '~/services/book.service'
import { usePagination } from '~/composables/usePagination'
import type { CreateBookRequest, UpdateBookRequest } from '~/schemas/book'

/**
 * High-level composable that orchestrates book list management.
 * Connects pagination state, search, and the book store.
 *
 * Use this composable in book list pages. Single-book detail pages
 * can read directly from the store after calling fetchBook().
 */
export function useBooks() {
  const store = useBookStore()
  const { books, currentBook, loading, error } = storeToRefs(store)
  const pagination = usePagination()
  const search = ref('')
  const submitting = ref(false)
  const submitError = ref<string | null>(null)

  async function loadBooks() {
    await store.fetchBooks({
      page: pagination.page.value,
      limit: pagination.limit.value,
      search: search.value || undefined,
    })
    if (store.pagination) {
      pagination.updateFromMeta(store.pagination)
    }
  }

  async function createBook(payload: CreateBookRequest) {
    submitting.value = true
    submitError.value = null
    try {
      await bookService.createBook(payload)
      await loadBooks()
    } catch (err) {
      submitError.value = (err as { message?: string })?.message ?? 'Failed to create book'
      throw err
    } finally {
      submitting.value = false
    }
  }

  async function updateBook(id: string, payload: UpdateBookRequest) {
    submitting.value = true
    submitError.value = null
    try {
      await bookService.updateBook(id, payload)
      await store.fetchBook(id)
    } catch (err) {
      submitError.value = (err as { message?: string })?.message ?? 'Failed to update book'
      throw err
    } finally {
      submitting.value = false
    }
  }

  async function deleteBook(id: string) {
    await store.removeBook(id)
  }

  // Reload when page or limit changes
  watch([pagination.page, pagination.limit], () => {
    loadBooks()
  })

  return {
    books,
    currentBook,
    loading,
    error,
    pagination,
    search,
    submitting,
    submitError,
    loadBooks,
    createBook,
    updateBook,
    deleteBook,
  }
}
