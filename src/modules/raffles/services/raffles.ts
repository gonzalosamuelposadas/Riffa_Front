import { api, type Raffle, type RaffleFormData } from '@shared'

export const raffleService = {
  // Get all public raffles
  getAll: async () => {
    const { data } = await api.get<Raffle[]>('/raffles')
    return data
  },

  // Get all raffles for admin (requires auth)
  getAllAdmin: async () => {
    const { data } = await api.get<Raffle[]>('/raffles/admin')
    return data
  },

  // Get single raffle
  getById: async (id: string) => {
    const { data } = await api.get<Raffle>(`/raffles/${id}`)
    return data
  },

  // Create raffle
  create: async (raffleData: RaffleFormData) => {
    const { data } = await api.post<Raffle>('/raffles', {
      ...raffleData,
      drawDate: raffleData.drawDate ? new Date(raffleData.drawDate).toISOString() : null
    })
    return data
  },

  // Update raffle
  update: async (id: string, raffleData: RaffleFormData) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { totalNumbers, ...updateData } = raffleData
    const { data } = await api.patch<Raffle>(`/raffles/${id}`, {
      ...updateData,
      drawDate: raffleData.drawDate ? new Date(raffleData.drawDate).toISOString() : null
    })
    return data
  },

  // Delete raffle
  delete: async (id: string) => {
    const { data } = await api.delete(`/raffles/${id}`)
    return data
  },

  // Perform draw (sorteo)
  performDraw: async (id: string) => {
    const { data } = await api.post<{
      message: string
      winningNumber: number
      winner: { id: string; name: string; email: string } | null
      raffle: Raffle
    }>(`/raffles/${id}/draw`)
    return data
  },

  // Get public winners list
  getWinners: async () => {
    const { data } = await api.get<{
      id: string
      raffleName: string
      prize: string
      prizeImage: string | null
      winningNumber: number
      winnerName: string
      completedAt: string
    }[]>('/raffles/winners')
    return data
  },

  // Get raffle sales (admin)
  getSales: async (id: string) => {
    const { data } = await api.get(`/raffles/${id}/sales`)
    return data
  },

  // Get raffle participants (admin)
  getParticipants: async (id: string) => {
    const { data } = await api.get(`/raffles/${id}/participants`)
    return data
  }
}
