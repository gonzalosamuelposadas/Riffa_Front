import { api } from '@shared'

export interface AdminUser {
  id: string
  name: string
  email: string
  phone: string | null
  createdAt: string
  totalPurchases: number
  totalSpent: number
  totalNumbers: number
  lastPurchaseAt: string | null
  isActive: boolean
  wonRafflesCount: number
}

export interface UsersStats {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  newUsersThisMonth: number
}

export const adminUsersService = {
  getAll: async () => {
    const { data } = await api.get<AdminUser[]>('/users/admin/all')
    return data
  },

  getStats: async () => {
    const { data } = await api.get<UsersStats>('/users/admin/stats')
    return data
  }
}
