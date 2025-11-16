import { apiClient } from "../client"
import { API_ENDPOINTS } from "../config"
import type { User } from "@/lib/store"

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data)

    // Store token in localStorage
    if (response.token) {
      localStorage.setItem("erdly-auth-token", response.token)
    }

    return response
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data)

    // Store token in localStorage
    if (response.token) {
      localStorage.setItem("erdly-auth-token", response.token)
    }

    return response
  },

  async logout(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
    localStorage.removeItem("erdly-auth-token")
  },

  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>(API_ENDPOINTS.AUTH.ME)
  },

  getToken(): string | null {
    return localStorage.getItem("erdly-auth-token")
  },

  isAuthenticated(): boolean {
    return !!this.getToken()
  },
}
