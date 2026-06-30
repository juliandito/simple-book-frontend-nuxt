import type { ApiError } from '~/types/api'

type QueryValue = string | number | boolean | null | undefined

type QueryParams = Record<string, QueryValue>

type RequestBody = BodyInit | Record<string, unknown> | null | undefined

type RefreshResponse = {
  access_token: string
  refresh_token: string
}

type RequestOptions = Parameters<ReturnType<typeof $fetch.create>>[1]
type FetchClient = ReturnType<typeof $fetch.create>

type ApiClient = {
  request<T>(url: string, options?: RequestOptions): Promise<T>
  get<T>(url: string, params?: QueryParams): Promise<T>
  post<T>(url: string, body?: RequestBody, params?: QueryParams): Promise<T>
  put<T>(url: string, body?: RequestBody, params?: QueryParams): Promise<T>
  patch<T>(url: string, body?: RequestBody, params?: QueryParams): Promise<T>
  delete<T>(url: string, params?: QueryParams): Promise<T>
}

const AUTH_REFRESH_ENDPOINT = '/auth/refresh'

let refreshPromise: Promise<string> | null = null

function getStoredToken(key: 'accessToken' | 'refreshToken') {
  if (!import.meta.client) {
    return null
  }

  return localStorage.getItem(key)
}

function setStoredTokens(tokens: RefreshResponse) {
  if (!import.meta.client) {
    return
  }

  localStorage.setItem('accessToken', tokens.access_token)
  localStorage.setItem('refreshToken', tokens.refresh_token)
}

function clearStoredAuth() {
  if (!import.meta.client) {
    return
  }

  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('userData')
}

function withAuthorizationHeader(headers: HeadersInit | undefined, token: string) {
  const nextHeaders = new Headers(headers)
  nextHeaders.set('Authorization', `Bearer ${token}`)
  return nextHeaders
}

function forceLogout() {
  clearStoredAuth()

  if (!import.meta.client) {
    return
  }

  const authStore = useAuthStore()
  authStore.logout()

  if (window.location.pathname !== '/login') {
    window.location.href = '/login'
  }
}

async function refreshAccessToken(baseURL: string) {
  const refreshToken = getStoredToken('refreshToken')

  if (!refreshToken) {
    forceLogout()
    throw createApiError(401, 'Authentication expired')
  }

  if (!refreshPromise) {
    refreshPromise = $fetch<RefreshResponse>(AUTH_REFRESH_ENDPOINT, {
      baseURL,
      method: 'POST',
      body: { refresh_token: refreshToken },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((tokens) => {
        setStoredTokens(tokens)
        return tokens.access_token
      })
      .catch((error) => {
        forceLogout()
        throw normalizeFetchError(error)
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

function createApiError(statusCode: number, message: string, errors?: Record<string, string[]>) {
  return {
    statusCode,
    message,
    errors,
  } satisfies ApiError
}

function normalizeFetchError(error: unknown) {
  const fetchError = error as {
    response?: {
      status?: number
      _data?: {
        message?: string
        errors?: Record<string, string[]>
      }
    }
    data?: {
      message?: string
      errors?: Record<string, string[]>
    }
    message?: string
  }

  const statusCode = fetchError.response?.status ?? 500
  const payload = fetchError.response?._data ?? fetchError.data

  return createApiError(
    statusCode,
    payload?.message ?? fetchError.message ?? 'An unexpected error occurred',
    payload?.errors,
  )
}

function getErrorStatusCode(error: unknown) {
  const fetchError = error as ApiError & {
    response?: {
      status?: number
    }
  }

  return fetchError.statusCode ?? fetchError.response?.status
}

function isApiError(error: unknown): error is ApiError {
  return Boolean(
    error && typeof error === 'object' && 'statusCode' in error && 'message' in error,
  )
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

  let client!: FetchClient

  client = $fetch.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    onRequest({ options }) {
      options.headers = options.headers ?? {}

      const token = getStoredToken('accessToken')

      if (token) {
        options.headers = withAuthorizationHeader(options.headers, token)
      }
    },
    onRequestError({ error }) {
      console.error('[API] Request error:', error)
    },
    onResponse({ response }) {
      if (!response.ok) {
        console.warn('[API] Non-OK response:', response.status, response.url)
      }
    },
    onResponseError(ctx) {
      const error = createApiError(
        ctx.response.status,
        (ctx.response._data as { message?: string })?.message ?? 'An unexpected error occurred',
        (ctx.response._data as { errors?: Record<string, string[]> })?.errors,
      )

      console.error('[API] Response error:', error)
      throw error
    },
  })

  async function requestWithRetry<T>(url: string, options?: RequestOptions, hasRetried = false): Promise<T> {
    try {
      return await client<T>(url, options)
    } catch (error) {
      const statusCode = getErrorStatusCode(error)

      if (statusCode === 401 && !hasRetried && !url.includes(AUTH_REFRESH_ENDPOINT)) {
        const nextToken = await refreshAccessToken(baseURL)

        return requestWithRetry<T>(url, {
          ...options,
          headers: withAuthorizationHeader(options?.headers, nextToken),
        }, true)
      }

      throw isApiError(error) ? error : normalizeFetchError(error)
    }
  }

  return {
    request<T>(url: string, options?: Parameters<typeof client>[1]) {
      return requestWithRetry<T>(url, options)
    },
    get<T>(url: string, params?: QueryParams) {
      return requestWithRetry<T>(url, { params })
    },
    post<T>(url: string, body?: RequestBody, params?: QueryParams) {
      return requestWithRetry<T>(url, { method: 'POST', body: body as RequestBody, params })
    },
    put<T>(url: string, body?: RequestBody, params?: QueryParams) {
      return requestWithRetry<T>(url, { method: 'PUT', body: body as RequestBody, params })
    },
    patch<T>(url: string, body?: RequestBody, params?: QueryParams) {
      return requestWithRetry<T>(url, { method: 'PATCH', body: body as RequestBody, params })
    },
    delete<T>(url: string, params?: QueryParams) {
      return requestWithRetry<T>(url, { method: 'DELETE', params })
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
