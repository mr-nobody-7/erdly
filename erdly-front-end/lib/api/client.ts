import { API_CONFIG } from "./config"

export interface ApiError {
  message: string
  status: number
  code?: string
  details?: any
}

export class ApiClient {
  private baseURL: string
  private timeout: number
  private debug: boolean

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL
    this.timeout = API_CONFIG.TIMEOUT
    this.debug = API_CONFIG.DEBUG
  }

  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("erdly-auth-token")
  }

  private log(method: string, url: string, data?: any) {
    if (this.debug) {
      console.log(`[API] ${method} ${url}`, data || "")
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = {
        message: response.statusText,
        status: response.status,
      }

      try {
        const errorData = await response.json()
        error.message = errorData.message || error.message
        error.code = errorData.code
        error.details = errorData.details
      } catch {
        // Response is not JSON
      }

      throw error
    }

    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      return response.json()
    }

    return response.text() as any
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(endpoint, this.baseURL)

    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, String(params[key]))
        }
      })
    }

    this.log("GET", url.toString())

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(this.getAuthToken() && { Authorization: `Bearer ${this.getAuthToken()}` }),
        },
        signal: controller.signal,
      })

      return this.handleResponse<T>(response)
    } finally {
      clearTimeout(timeoutId)
    }
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    this.log("POST", url, data)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.getAuthToken() && { Authorization: `Bearer ${this.getAuthToken()}` }),
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      })

      return this.handleResponse<T>(response)
    } finally {
      clearTimeout(timeoutId)
    }
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    this.log("PUT", url, data)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(this.getAuthToken() && { Authorization: `Bearer ${this.getAuthToken()}` }),
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      })

      return this.handleResponse<T>(response)
    } finally {
      clearTimeout(timeoutId)
    }
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    this.log("PATCH", url, data)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(this.getAuthToken() && { Authorization: `Bearer ${this.getAuthToken()}` }),
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      })

      return this.handleResponse<T>(response)
    } finally {
      clearTimeout(timeoutId)
    }
  }

  async delete<T>(endpoint: string): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    this.log("DELETE", url)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(this.getAuthToken() && { Authorization: `Bearer ${this.getAuthToken()}` }),
        },
        signal: controller.signal,
      })

      return this.handleResponse<T>(response)
    } finally {
      clearTimeout(timeoutId)
    }
  }
}

export const apiClient = new ApiClient()
