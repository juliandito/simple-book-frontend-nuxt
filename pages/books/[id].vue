<script setup lang="ts">
  import { onMounted, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import { useBookStore } from '~/stores/book.store'
  import { useBooks } from '~/composables/useBooks'
  import type { CreateBookRequest } from '~/schemas/book'

  definePageMeta({ layout: 'default' })

  const route = useRoute()
  const router = useRouter()
  const store = useBookStore()
  const { currentBook, loading, error } = storeToRefs(store)
  const { submitting, submitError, updateBook, deleteBook } = useBooks()

  const id = route.params.id as string
  const isEditing = computed(() => route.query.edit === 'true')

  onMounted(() => store.fetchBook(id))

  async function handleUpdate(values: CreateBookRequest) {
    await updateBook(id, values)
    router.push(`/books/${id}`)
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this book?')) return
    await deleteBook(id)
    router.push('/books')
  }
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <NuxtLink to="/books" class="btn btn-ghost btn-sm mb-4">← Back to Books</NuxtLink>

    <div v-if="loading" class="flex justify-center py-12">
      <span class="loading loading-spinner loading-lg" />
    </div>

    <div v-else-if="error" class="alert alert-error">
      <span>{{ error }}</span>
    </div>

    <template v-else-if="currentBook">
      <!-- View mode -->
      <div v-if="!isEditing">
        <div class="flex items-start justify-between mb-6">
          <div>
            <h1 class="text-3xl font-bold">{{ currentBook.title }}</h1>
            <p class="text-base-content/70 mt-1">by {{ currentBook.author }}</p>
          </div>
          <div class="flex gap-2">
            <NuxtLink :to="`/books/${id}?edit=true`" class="btn btn-outline btn-sm">Edit</NuxtLink>
            <button class="btn btn-error btn-sm" @click="handleDelete">Delete</button>
          </div>
        </div>

        <div class="card bg-base-100 shadow">
          <div class="card-body space-y-3">
            <div v-if="currentBook.description">
              <h2 class="font-semibold text-sm text-base-content/70 uppercase tracking-wide">
                Description
              </h2>
              <p>{{ currentBook.description }}</p>
            </div>
            <div class="flex flex-wrap gap-4 text-sm">
              <div v-if="currentBook.publishedYear">
                <span class="font-semibold">Published:</span> {{ currentBook.publishedYear }}
              </div>
              <div v-if="currentBook.isbn">
                <span class="font-semibold">ISBN:</span> {{ currentBook.isbn }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit mode -->
      <div v-else>
        <h1 class="text-3xl font-bold mb-6">Edit Book</h1>

        <div v-if="submitError" class="alert alert-error mb-4">
          <span>{{ submitError }}</span>
        </div>

        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <BookForm
              :initial-values="currentBook"
              :loading="submitting"
              submit-label="Save Changes"
              @submit="handleUpdate"
              @cancel="router.push(`/books/${id}`)"
            />
          </div>
        </div>
      </div>
    </template>

    <div v-else class="text-center py-12 text-base-content/50">Book not found.</div>
  </div>
</template>
