import { ref, computed } from 'vue'
import type { PaginationMeta } from '~/types/api'
import { DEFAULT_PAGE_SIZE } from '~/utils/constants'

/**
 * Reusable pagination composable.
 * Manages current page, page size, and derives navigation helpers.
 * Can be used alongside any paginated data source.
 *
 * @example
 * const { page, limit, setPage, setLimit, updateFromMeta } = usePagination()
 */
export function usePagination(initialLimit = DEFAULT_PAGE_SIZE) {
  const page = ref(1)
  const limit = ref(initialLimit)
  const meta = ref<PaginationMeta | null>(null)

  const totalPages = computed(() => meta.value?.totalPages ?? 0)
  const total = computed(() => meta.value?.total ?? 0)
  const hasPrev = computed(() => page.value > 1)
  const hasNext = computed(() => page.value < totalPages.value)

  function setPage(newPage: number) {
    if (newPage < 1 || (totalPages.value > 0 && newPage > totalPages.value)) return
    page.value = newPage
  }

  function setLimit(newLimit: number) {
    limit.value = newLimit
    page.value = 1
  }

  function prevPage() {
    if (hasPrev.value) page.value--
  }

  function nextPage() {
    if (hasNext.value) page.value++
  }

  function reset() {
    page.value = 1
    limit.value = initialLimit
    meta.value = null
  }

  function updateFromMeta(newMeta: PaginationMeta) {
    meta.value = newMeta
  }

  return {
    page,
    limit,
    meta,
    totalPages,
    total,
    hasPrev,
    hasNext,
    setPage,
    setLimit,
    prevPage,
    nextPage,
    reset,
    updateFromMeta,
  }
}
