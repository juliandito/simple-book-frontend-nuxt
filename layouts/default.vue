<script setup lang="ts">
  import { NAV_LINKS, APP_NAME } from '~/utils/constants'
</script>

<template>
  <div class="min-h-screen bg-base-100">
    <div class="drawer lg:drawer-open min-h-screen">
      <input id="app-sidebar" type="checkbox" class="drawer-toggle" />

      <div class="drawer-content flex flex-col">
        <header class="navbar bg-base-200 border-b border-base-300 px-4">
          <div class="navbar-start">
            <label for="app-sidebar" class="btn btn-ghost btn-sm lg:hidden" aria-label="Open sidebar">
              <svg
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
            <NuxtLink to="/" class="btn btn-ghost text-lg sm:text-xl font-bold">
              {{ APP_NAME }}
            </NuxtLink>
          </div>
        </header>

        <main class="flex-1 container mx-auto px-4 py-8 max-w-7xl">
          <slot />
        </main>

        <footer class="footer footer-center p-4 bg-base-200 text-base-content text-sm border-t border-base-300">
          <p>© {{ new Date().getFullYear() }} {{ APP_NAME }}</p>
        </footer>
      </div>

      <div class="drawer-side z-20">
        <label for="app-sidebar" class="drawer-overlay" aria-label="Close sidebar"></label>
        <aside class="min-h-full w-72 bg-base-200 border-r border-base-300 px-4 py-6">
          <NuxtLink to="/" class="text-xl font-bold block px-2 mb-6">
            {{ APP_NAME }}
          </NuxtLink>

          <nav>
            <ul class="menu w-full gap-1">
              <li v-for="link in NAV_LINKS" :key="link.to">
                <NuxtLink :to="link.to" active-class="active">
                  {{ link.label }}
                </NuxtLink>
              </li>
            </ul>
          </nav>
        </aside>
      </div>
    </div>
  </div>
</template>
