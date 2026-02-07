'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { authService, AuthUser, UserRole } from '../services/auth'

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  isSuperAdmin: boolean
  isAdmin: boolean
  isUser: boolean
  role: UserRole | null
  // Info de tienda para ADMIN
  storeId: string | null
  storeName: string | null
  storeSlug: string | null
  // Methods
  login: (email: string, password: string) => Promise<AuthUser>
  loginWithGoogle: () => Promise<void>
  register: (data: { email: string; password: string; name: string; phone?: string }) => Promise<AuthUser>
  logout: () => void
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Sync NextAuth session with local state and localStorage
  useEffect(() => {
    if (status === 'loading') {
      return
    }

    if (session?.user && session.accessToken) {
      // Store token from NextAuth session
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', session.accessToken)
      }

      setUser({
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.name || '',
        role: (session.user.role as UserRole) || 'USER',
        phone: session.user.phone,
        balance: session.user.balance,
        storeId: session.user.storeId,
        storeName: session.user.storeName,
        storeSlug: session.user.storeSlug,
      })
    } else if (status === 'unauthenticated') {
      // Check for existing JWT token (for backward compatibility)
      const checkExistingToken = async () => {
        try {
          const existingSession = await authService.getSession()
          if (existingSession.user) {
            setUser(existingSession.user)
          } else {
            setUser(null)
          }
        } catch {
          setUser(null)
        }
      }
      checkExistingToken()
    }

    setIsLoading(false)
  }, [session, status])

  const refreshSession = useCallback(async () => {
    try {
      const existingSession = await authService.getSession()
      setUser(existingSession.user)
    } catch {
      setUser(null)
    }
  }, [])

  const login = async (email: string, password: string): Promise<AuthUser> => {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      throw new Error(result.error)
    }

    // Fallback to direct API login if NextAuth fails
    const response = await authService.login(email, password)
    setUser(response.user)
    return response.user
  }

  const loginWithGoogle = async () => {
    await signIn('google', { callbackUrl: '/mi-cuenta' })
  }

  const register = async (data: { email: string; password: string; name: string; phone?: string }): Promise<AuthUser> => {
    const response = await authService.register(data)
    setUser(response.user)
    return response.user
  }

  const logout = () => {
    authService.logout()
    signOut({ callbackUrl: '/' })
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: isLoading || status === 'loading',
        isAuthenticated: !!user,
        isSuperAdmin: user?.role === 'SUPER_ADMIN',
        isAdmin: user?.role === 'ADMIN',
        isUser: user?.role === 'USER',
        role: user?.role || null,
        storeId: user?.storeId || null,
        storeName: user?.storeName || null,
        storeSlug: user?.storeSlug || null,
        login,
        loginWithGoogle,
        register,
        logout,
        refreshSession
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
