<script setup lang="ts">
  import { onMounted, computed } from 'vue'
  import { useBookStore } from '~/stores/book.store'
  import { storeToRefs } from 'pinia'
  import { useBooks } from '~/composables/useBooks'

  definePageMeta({ layout: 'default' })

  const store = useBookStore()
  const { books, loading, error } = storeToRefs(store)
  const { pagination, loadBooks, deleteBook } = useBooks()

  onMounted(() => loadBooks())

  const pageTitle = computed(
    () =>
      `Books${pagination.total.value > 0 ? ` (${pagination.total.value})` : ''}`
  )

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this book?')) return
    await deleteBook(id)
  }
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">{{ pageTitle }}</h1>
      <NuxtLink to="/books/create" class="btn btn-primary btn-sm">+ Add Book</NuxtLink>
    </div>

    <div v-if="error" class="alert alert-error mb-4">
      <span>{{ error }}</span>
    </div>

    <BookTable :books="books" :loading="loading" @delete="handleDelete" />

    <!-- Pagination -->
    <div
      v-if="pagination.totalPages.value > 1"
      class="flex items-center justify-center gap-2 mt-6"
    >
      <button
        class="btn btn-sm"
        :disabled="!pagination.hasPrev.value"
        @click="pagination.prevPage()"
      >
        ← Prev
      </button>
      <span class="text-sm">
        Page {{ pagination.page.value }} of {{ pagination.totalPages.value }}
      </span>
      <button
        class="btn btn-sm"
        :disabled="!pagination.hasNext.value"
        @click="pagination.nextPage()"
      >
        Next →
      </button>
    </div>
  </div>
</template>
