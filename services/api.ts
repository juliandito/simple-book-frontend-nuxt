import type { ApiError } from '~/types/api'

/**
 * Creates a typed, reusable $fetch instance pre-configured with:
 * - Base URL from runtime config
 * - JSON content-type headers
 * - Centralized error handling
 * - Hooks for future auth token injection
 */
export function createApiClient() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl as string

  return $fetch.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    onRequest({ options }) {
      // Future: inject auth token
      // const authStore = useAuthStore()
      // if (authStore.token) {
      //   options.headers = { ...options.headers, Authorization: 'Bearer ' + authStore.token }
      // }
      options.headers = options.headers ?? {}
    },
    onRequestError({ error }) {
      console.error('[API] Request error:', error)
    },
    onResponse({ response }) {
      if (!response.ok) {
        console.warn('[API] Non-OK response:', response.status, response.url)
      }
    },
    onResponseError({ response }) {
      const error: ApiError = {
        statusCode: response.status,
        message: (response._data as { message?: string })?.message ?? 'An unexpected error occurred',
        errors: (response._data as { errors?: Record<string, string[]> })?.errors,
      }
      console.error('[API] Response error:', error)
      throw error
    },
  })
}

/**
 * Composable that provides a singleton API client instance for the current
 * Nuxt context. Use this inside services and composables.
 */
export function useApiClient() {
  return createApiClient()
}
