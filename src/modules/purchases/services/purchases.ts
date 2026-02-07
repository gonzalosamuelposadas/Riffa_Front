import { api, type CheckoutFormData, type Purchase } from '@shared'

interface PurchaseResponse {
  success: boolean
  purchaseId: string
  message: string
}

interface ActionResponse {
  success: boolean
  message: string
}

export interface PendingPurchase extends Omit<Purchase, 'numbers'> {
  raffle: {
    name: string
    price: number
  }
  numbers: {
    number: number
  }[]
}

export const purchaseService = {
  // Get all purchases
  getAll: async () => {
    const { data } = await api.get<Purchase[]>('/purchases')
    return data
  },

  // Get pending purchases for admin
  getPending: async () => {
    const { data } = await api.get<PendingPurchase[]>('/purchases/pending')
    return data
  },

  // Get purchase by ID
  getById: async (id: string) => {
    const { data } = await api.get<Purchase>(`/purchases/${id}`)
    return data
  },

  // Get purchases by raffle
  getByRaffleId: async (raffleId: string) => {
    const { data } = await api.get<Purchase[]>(`/purchases/raffle/${raffleId}`)
    return data
  },

  // Create a reservation
  create: async (
    raffleId: string,
    numbers: number[],
    buyerInfo: CheckoutFormData,
    userId?: string
  ) => {
    const { data } = await api.post<PurchaseResponse>('/purchases', {
      raffleId,
      numbers,
      ...buyerInfo,
      userId
    })
    return data
  },

  // Confirm a pending purchase (admin action)
  confirm: async (id: string) => {
    const { data } = await api.patch<ActionResponse>(`/purchases/${id}/confirm`)
    return data
  },

  // Cancel a pending purchase (admin action)
  cancel: async (id: string) => {
    const { data } = await api.patch<ActionResponse>(`/purchases/${id}/cancel`)
    return data
  }
}
