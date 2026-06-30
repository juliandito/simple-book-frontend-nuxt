import { defineStore } from 'pinia'
import { authService } from '~/services/auth.service'
import type { AuthUser, ChangePasswordPayload } from '~/types/auth'
import type { ApiError } from '~/types/api'

type AuthStoreState = {
  user: AuthUser | null
  isLoading: boolean
  isInitializing: boolean
  isAuthenticated: boolean
  error: ApiError | null
}

function getStoredJson<T>(key: string): T | null {
  if (!import.meta.client) {
    return null
  }

  const value = localStorage.getItem(key)
  return value ? (JSON.parse(value) as T) : null
}

function getStoredToken(key: 'accessToken' | 'refreshToken') {
  if (!import.meta.client) {
    return null
  }

  return localStorage.getItem(key)
}

function setStoredAuth(user: AuthUser, accessToken: string, refreshToken: string) {
  if (!import.meta.client) {
    return
  }

  localStorage.setItem('accessToken', accessToken)
  localStorage.setItem('refreshToken', refreshToken)
  localStorage.setItem('userData', JSON.stringify(user))
}

function clearStoredAuth() {
  if (!import.meta.client) {
    return
  }

  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('userData')
}

function createValidationError(message: string, field?: string): ApiError {
  return {
    statusCode: 400,
    message,
    errors: field ? { [field]: [message] } : undefined,
  }
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthStoreState => ({
    user: getStoredJson<AuthUser>('userData'),
    isLoading: false,
    isInitializing: true,
    isAuthenticated: Boolean(getStoredToken('accessToken')),
    error: null,
  }),

  getters: {
    getFieldError: (state) => (fieldName: string) => state.error?.errors?.[fieldName]?.[0] ?? null,
    getHumanMessage: (state) => state.error?.message ?? null,
  },

  actions: {
    async login(email: string, password: string) {
      this.isLoading = true
      this.error = null

      try {
        const response = await authService.login(email, password)
        setStoredAuth(response.user, response.access_token, response.refresh_token)

        this.user = response.user
        this.isAuthenticated = true

        return true
      } catch (error) {
        this.isAuthenticated = false
        this.error = error as ApiError
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async changeMyPassword(payload: ChangePasswordPayload) {
      this.isLoading = true
      this.error = null

      try {
        if (payload.new_password.length < 8) {
          throw createValidationError(
            'New password must be at least 8 characters long.',
            'new_password',
          )
        }

        if (payload.confirm_password !== payload.new_password) {
          throw createValidationError(
            'Password confirmation does not match new password.',
            'confirm_password',
          )
        }

        await authService.changeMyPassword(payload)
      } catch (error) {
        this.error = error as ApiError
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchMe() {
      const token = getStoredToken('accessToken')

      if (!token) {
        this.user = null
        this.isAuthenticated = false
        this.isInitializing = false
        return
      }

      try {
        const user = await authService.fetchMe()
        this.user = user
        this.isAuthenticated = true
        this.error = null

        if (import.meta.client) {
          localStorage.setItem('userData', JSON.stringify(user))
        }
      } catch (error) {
        clearStoredAuth()
        this.user = null
        this.isAuthenticated = false
        this.error = error as ApiError
      } finally {
        this.isInitializing = false
      }
    },

    logout() {
      clearStoredAuth()
      this.user = null
      this.isAuthenticated = false
      this.error = null
      this.isInitializing = false
    },

    clearError() {
      this.error = null
    },
  },
})