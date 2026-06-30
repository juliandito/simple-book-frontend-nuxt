<script setup lang="ts">
  import { NAV_LINKS, APP_NAME } from '~/utils/constants'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-base-100">
    <!-- Navbar -->
    <header class="navbar bg-base-200 shadow-sm px-4">
      <div class="navbar-start">
        <NuxtLink to="/" class="btn btn-ghost text-xl font-bold">
          {{ APP_NAME }}
        </NuxtLink>
      </div>

      <div class="navbar-center hidden lg:flex">
        <nav class="flex gap-2">
          <NuxtLink
            v-for="link in NAV_LINKS"
            :key="link.to"
            :to="link.to"
            class="btn btn-ghost btn-sm"
            active-class="btn-active"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>
      </div>

      <!-- Mobile menu -->
      <div class="navbar-end lg:hidden">
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-sm">
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
          <ul
            tabindex="0"
            class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li v-for="link in NAV_LINKS" :key="link.to">
              <NuxtLink :to="link.to">{{ link.label }}</NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-1 container mx-auto px-4 py-8 max-w-7xl">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="footer footer-center p-4 bg-base-200 text-base-content text-sm">
      <p>© {{ new Date().getFullYear() }} {{ APP_NAME }}</p>
    </footer>
  </div>
</template>
