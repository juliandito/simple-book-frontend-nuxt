<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { useBooks } from '~/composables/useBooks'
  import type { CreateBookRequest } from '~/schemas/book'

  definePageMeta({ layout: 'default' })

  const router = useRouter()
  const { submitting, submitError, createBook } = useBooks()

  async function handleSubmit(values: CreateBookRequest) {
    await createBook(values)
    router.push('/books')
  }
</script>

<template>
  <div class="max-w-xl mx-auto">
    <div class="mb-6">
      <NuxtLink to="/books" class="btn btn-ghost btn-sm mb-2">← Back to Books</NuxtLink>
      <h1 class="text-3xl font-bold">Add New Book</h1>
    </div>

    <div v-if="submitError" class="alert alert-error mb-4">
      <span>{{ submitError }}</span>
    </div>

    <div class="card bg-base-100 shadow">
      <div class="card-body">
        <BookForm
          :loading="submitting"
          submit-label="Create Book"
          @submit="handleSubmit"
          @cancel="router.push('/books')"
        />
      </div>
    </div>
  </div>
</template>
