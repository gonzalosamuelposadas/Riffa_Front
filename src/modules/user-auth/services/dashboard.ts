import { api } from '@shared'
import { authService } from '@auth'

export interface DashboardStats {
  activeRafflesCount: number
  totalNumbersBought: number
  wonRafflesCount: number
  pendingRafflesCount: number
  totalSpent: number
  balance: number
}

export interface ActiveRaffle {
  id: string
  name: string
  prize: string
  prizeImage: string | null
  drawDate: string | null
  numbersOwned: number[]
}

export interface NextDraw {
  id: string
  name: string
  prize: string
  drawDate: string
}

export interface DashboardData {
  user: {
    id: string
    email: string
    name: string
    phone: string | null
    balance: number
  }
  stats: DashboardStats
  activeRaffles: ActiveRaffle[]
  nextDraw: NextDraw | null
}

export interface UserPurchase {
  id: string
  buyerName: string
  buyerEmail: string
  totalAmount: number
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED'
  createdAt: string
  raffle: {
    id: string
    name: string
    prize: string
    prizeImage: string | null
    status: string
    drawDate: string | null
  }
  numbers: { number: number; status: string }[]
}

const getAuthHeaders = () => {
  const token = authService.getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const dashboardService = {
  getDashboard: async (): Promise<DashboardData> => {
    const { data } = await api.get<DashboardData>('/users/me/dashboard', {
      headers: getAuthHeaders()
    })
    return data
  },

  getPurchases: async (): Promise<UserPurchase[]> => {
    const { data } = await api.get<UserPurchase[]>('/users/me/purchases', {
      headers: getAuthHeaders()
    })
    return data
  },

  getRaffles: async () => {
    const { data } = await api.get('/users/me/raffles', {
      headers: getAuthHeaders()
    })
    return data
  }
}
