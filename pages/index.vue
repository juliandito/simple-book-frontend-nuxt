<script setup lang="ts">
  definePageMeta({ layout: 'default' })

  const stats = [
    { label: 'Total Books', value: '—', icon: '📚' },
    { label: 'Authors', value: '—', icon: '✍️' },
    { label: 'Recent Additions', value: '—', icon: '🆕' },
  ]
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-2">Dashboard</h1>
    <p class="text-base-content/70 mb-8">Welcome to your book management system.</p>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div v-for="stat in stats" :key="stat.label" class="stat bg-base-200 rounded-box">
        <div class="stat-figure text-2xl">{{ stat.icon }}</div>
        <div class="stat-title">{{ stat.label }}</div>
        <div class="stat-value text-2xl">{{ stat.value }}</div>
      </div>
    </div>

    <div class="flex gap-3">
      <NuxtLink to="/books" class="btn btn-primary">Browse Books</NuxtLink>
      <NuxtLink to="/books/create" class="btn btn-outline">Add New Book</NuxtLink>
    </div>
  </div>
</template>
