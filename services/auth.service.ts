import { useApiClient } from '~/services/api'
import type {
  AuthLoginResponse,
  AuthRefreshResponse,
  AuthUser,
  AuthUserResponse,
  ChangePasswordPayload,
} from '~/types/auth'
import type { ApiResponse } from '~/types/api'

const AUTH_ENDPOINTS = {
  login: '/auth/login',
  refresh: '/auth/refresh',
  me: '/auth/me',
  changePassword: '/auth/change-password',
} as const

export const authService = {
  async login(email: string, password: string): Promise<AuthLoginResponse> {
    const api = useApiClient()
    return api.post<AuthLoginResponse>(AUTH_ENDPOINTS.login, { email, password })
  },

  async refresh(refreshToken: string): Promise<AuthRefreshResponse> {
    const api = useApiClient()
    return api.post<AuthRefreshResponse>(AUTH_ENDPOINTS.refresh, {
      refresh_token: refreshToken,
    })
  },

  async fetchMe(): Promise<AuthUser> {
    const api = useApiClient()
    const response = await api.get<AuthUserResponse>(AUTH_ENDPOINTS.me)
    return 'data' in response ? response.data : response
  },

  async changeMyPassword(payload: ChangePasswordPayload): Promise<void> {
    const api = useApiClient()
    await api.post<ApiResponse<null>>(AUTH_ENDPOINTS.changePassword, payload)
  },
}