<script setup lang="ts">
  import { APP_NAME } from '~/utils/constants'
</script>

<template>
  <div class="min-h-screen bg-base-200">
    <div class="hero min-h-screen px-4">
      <div class="hero-content w-full max-w-md flex-col">
        <NuxtLink to="/" class="text-center">
          <div class="text-sm uppercase tracking-[0.3em] text-base-content/60">Welcome</div>
          <h1 class="text-3xl font-bold mt-2">{{ APP_NAME }}</h1>
        </NuxtLink>

        <div class="card w-full bg-base-100 shadow-xl border border-base-300">
          <div class="card-body">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>