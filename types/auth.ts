import type { ApiResponse } from '~/types/api'

export type AuthUser = {
  id: string
  name: string
  email: string
}

export type AuthLoginResponse = {
  access_token: string
  refresh_token: string
  user: AuthUser
}

export type AuthRefreshResponse = {
  access_token: string
  refresh_token: string
}

export type ChangePasswordPayload = {
  current_password: string
  new_password: string
  confirm_password: string
}

export type AuthUserResponse = AuthUser | ApiResponse<AuthUser>