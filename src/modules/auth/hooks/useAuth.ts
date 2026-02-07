import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authService, AuthUser } from '../services/auth'

export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
}

// Get current session
export function useSession() {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: authService.getSession,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  })
}

// Get user profile
export function useProfile() {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: authService.getProfile,
    retry: false,
  })
}

// Login mutation
export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: (data) => {
      // Update session cache with logged in user
      queryClient.setQueryData(authKeys.session(), {
        user: data.user,
      })
    },
  })
}

// Register mutation
export function useRegister() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { email: string; password: string; name: string; phone?: string }) =>
      authService.register(data),
    onSuccess: (data) => {
      // Update session cache with registered user
      queryClient.setQueryData(authKeys.session(), {
        user: data.user,
      })
    },
  })
}

// Logout mutation
export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      authService.logout()
      return true
    },
    onSuccess: () => {
      // Clear session cache
      queryClient.setQueryData(authKeys.session(), {
        user: null,
      })
      // Clear all cached queries
      queryClient.clear()
    },
  })
}

// Re-export AuthUser type as User for backwards compatibility
export type { AuthUser as User }
