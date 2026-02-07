import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      // Check unified token first, then legacy keys
      const token = localStorage.getItem('auth_token') ||
                    localStorage.getItem('token') ||
                    localStorage.getItem('user_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

// Response interceptor for error handling and 401 redirect
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status

    // Handle 401 Unauthorized - redirect to login
    if (status === 401) {
      if (typeof window !== 'undefined') {
        // Clear all auth tokens
        localStorage.removeItem('auth_token')
        localStorage.removeItem('token')
        localStorage.removeItem('user_token')
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login'
        }
      }
    }

    // Handle 403 Forbidden
    if (status === 403) {
      if (typeof window !== 'undefined') {
        window.location.href = '/admin'
      }
    }

    // Extract error message
    const responseData = error.response?.data as { message?: string; error?: string } | undefined
    const message = responseData?.message || responseData?.error || error.message || 'Error inesperado'

    return Promise.reject(new Error(message))
  }
)
