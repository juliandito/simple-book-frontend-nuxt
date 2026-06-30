<script setup lang="ts">
  import type { Book } from '~/schemas/book'
  import { truncate, formatDate } from '~/utils/helpers'

  const props = defineProps<{
    book: Book
  }>()

  const emit = defineEmits<{
    delete: [id: string]
  }>()
</script>

<template>
  <div class="card card-bordered bg-base-100 shadow-sm hover:shadow-md transition-shadow">
    <div class="card-body">
      <h2 class="card-title text-base">{{ props.book.title }}</h2>
      <p class="text-sm text-base-content/70">by {{ props.book.author }}</p>

      <p v-if="props.book.description" class="text-sm mt-2">
        {{ truncate(props.book.description, 120) }}
      </p>

      <div class="flex flex-wrap gap-2 mt-2">
        <div v-if="props.book.publishedYear" class="badge badge-outline badge-sm">
          {{ props.book.publishedYear }}
        </div>
        <div v-if="props.book.isbn" class="badge badge-outline badge-sm">
          ISBN: {{ props.book.isbn }}
        </div>
      </div>

      <p v-if="props.book.createdAt" class="text-xs text-base-content/50 mt-1">
        Added {{ formatDate(props.book.createdAt) }}
      </p>

      <div class="card-actions justify-end mt-3">
        <NuxtLink :to="`/books/${props.book.id}`" class="btn btn-ghost btn-xs">View</NuxtLink>
        <NuxtLink :to="`/books/${props.book.id}?edit=true`" class="btn btn-outline btn-xs">
          Edit
        </NuxtLink>
        <button class="btn btn-error btn-xs" @click="emit('delete', props.book.id)">Delete</button>
      </div>
    </div>
  </div>
</template>
