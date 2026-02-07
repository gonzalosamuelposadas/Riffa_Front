import { api } from '@shared'

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'USER'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  phone?: string
  balance?: number
  // Multi-tenant: info de tienda para ADMIN
  storeId?: string | null
  storeName?: string | null
  storeSlug?: string | null
}

interface LoginResponse {
  user: AuthUser
  access_token: string
}

interface SessionResponse {
  user: AuthUser | null
}

interface RegisterData {
  email: string
  password: string
  name: string
  phone?: string
}

const TOKEN_KEY = 'auth_token'

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/login', {
      email,
      password
    })
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, data.access_token)
    }
    return data
  },

  register: async (registerData: RegisterData): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/user-auth/register', registerData)
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, data.access_token)
    }
    return data
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY)
      // Also remove old keys for backwards compatibility
      localStorage.removeItem('token')
      localStorage.removeItem('user_token')
    }
  },

  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      // Check new key first, then old keys for backwards compatibility
      return localStorage.getItem(TOKEN_KEY) ||
             localStorage.getItem('token') ||
             localStorage.getItem('user_token')
    }
    return null
  },

  getSession: async (): Promise<SessionResponse> => {
    try {
      const token = authService.getToken()
      if (!token) {
        return { user: null }
      }
      const { data } = await api.get<SessionResponse>('/auth/session', {
        headers: { Authorization: `Bearer ${token}` }
      })
      return data
    } catch {
      authService.logout()
      return { user: null }
    }
  },

  getProfile: async (): Promise<AuthUser> => {
    const token = authService.getToken()
    const { data } = await api.get<AuthUser>('/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return data
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const { data } = await api.post<{ message: string }>('/user-auth/forgot-password', { email })
    return data
  },

  resetPassword: async (token: string, password: string): Promise<{ message: string }> => {
    const { data } = await api.post<{ message: string }>('/user-auth/reset-password', { token, password })
    return data
  },

  validateResetToken: async (token: string): Promise<{ valid: boolean; email: string }> => {
    const { data } = await api.get<{ valid: boolean; email: string }>(`/user-auth/validate-reset-token/${token}`)
    return data
  }
}
