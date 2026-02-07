export type RaffleStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
export type NumberStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD'
export type PurchaseStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED'

export type Currency = 'MXN' | 'USD' | 'EUR' | 'ARS' | 'COP' | 'CLP' | 'PEN'

export interface RaffleWinner {
  id: string
  name: string
  email: string
}

export interface Raffle {
  id: string
  name: string
  description: string | null
  prize: string
  prizeImage: string | null
  price: number
  currency: Currency
  totalNumbers: number
  maxPerUser: number
  status: RaffleStatus
  drawDate: Date | string | null
  winningNumber?: number | null
  winnerId?: string | null
  winner?: RaffleWinner | null
  completedAt?: Date | string | null
  createdAt: Date | string
  updatedAt: Date | string
  numbers?: RaffleNumber[]
}

export interface RaffleNumber {
  id: string
  number: number
  status: NumberStatus
  raffleId: string
  purchaseId: string | null
}

export interface Purchase {
  id: string
  buyerName: string
  buyerEmail: string
  buyerPhone: string | null
  totalAmount: number
  status: PurchaseStatus
  raffleId: string
  numbers?: RaffleNumber[]
  createdAt: Date | string
  updatedAt: Date | string
}

export interface CartItem {
  number: number
  raffleId: string
}
