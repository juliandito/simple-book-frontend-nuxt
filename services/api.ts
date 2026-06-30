import type { ApiError } from '~/types/api'

type QueryParams = Record<string, any>

type RequestBody = BodyInit | Record<string, any> | null | undefined

type ApiClient = {
  request<T>(url: string, options?: Parameters<ReturnType<typeof $fetch.create>>[1]): Promise<T>
  get<T>(url: string, params?: QueryParams): Promise<T>
  post<T>(url: string, body?: RequestBody, params?: QueryParams): Promise<T>
  put<T>(url: string, body?: RequestBody, params?: QueryParams): Promise<T>
  patch<T>(url: string, body?: RequestBody, params?: QueryParams): Promise<T>
  delete<T>(url: string, params?: QueryParams): Promise<T>
}

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

  const client = $fetch.create({
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

  return {
    request<T>(url: string, options?: Parameters<typeof client>[1]) {
      return client<T>(url, options)
    },
    get<T>(url: string, params?: QueryParams) {
      return client<T>(url, { params })
    },
    post<T>(url: string, body?: RequestBody, params?: QueryParams) {
      return client<T>(url, { method: 'POST', body: body as RequestBody, params })
    },
    put<T>(url: string, body?: RequestBody, params?: QueryParams) {
      return client<T>(url, { method: 'PUT', body: body as RequestBody, params })
    },
    patch<T>(url: string, body?: RequestBody, params?: QueryParams) {
      return client<T>(url, { method: 'PATCH', body: body as RequestBody, params })
    },
    delete<T>(url: string, params?: QueryParams) {
      return client<T>(url, { method: 'DELETE', params })
    },
  } satisfies ApiClient
}

/**
 * Composable that provides a singleton API client instance for the current
 * Nuxt context. Use this inside services and composables.
 */
export function useApiClient() {
  return createApiClient()
}
