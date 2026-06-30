<script setup lang="ts">
  import type { Book } from '~/schemas/book'

  defineProps<{
    books: Book[]
    loading?: boolean
  }>()

  const emit = defineEmits<{
    delete: [id: string]
  }>()
</script>

<template>
  <div class="overflow-x-auto">
    <table class="table table-zebra w-full">
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Year</th>
          <th>ISBN</th>
          <th class="text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="5" class="text-center py-8">
            <span class="loading loading-spinner loading-md" />
          </td>
        </tr>
        <tr v-else-if="books.length === 0">
          <td colspan="5" class="text-center py-8 text-base-content/50">No books found.</td>
        </tr>
        <tr v-for="book in books" v-else :key="book.id" class="hover">
          <td class="font-medium">{{ book.title }}</td>
          <td>{{ book.author }}</td>
          <td>{{ book.publishedYear ?? '—' }}</td>
          <td>{{ book.isbn ?? '—' }}</td>
          <td class="text-right">
            <div class="flex gap-1 justify-end">
              <NuxtLink :to="`/books/${book.id}`" class="btn btn-ghost btn-xs">View</NuxtLink>
              <NuxtLink :to="`/books/${book.id}?edit=true`" class="btn btn-outline btn-xs">
                Edit
              </NuxtLink>
              <button class="btn btn-error btn-xs" @click="emit('delete', book.id)">Delete</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
