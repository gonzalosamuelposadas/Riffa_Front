import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { purchaseService } from '../services/purchases'
import type { CheckoutFormData } from '@shared'
import { raffleKeys } from '@raffles'

export const purchaseKeys = {
  all: ['purchases'] as const,
  lists: () => [...purchaseKeys.all, 'list'] as const,
  pending: () => [...purchaseKeys.all, 'pending'] as const,
  details: () => [...purchaseKeys.all, 'detail'] as const,
  detail: (id: string) => [...purchaseKeys.details(), id] as const,
  byRaffle: (raffleId: string) => [...purchaseKeys.all, 'raffle', raffleId] as const,
}

// Get all purchases
export function usePurchases() {
  return useQuery({
    queryKey: purchaseKeys.lists(),
    queryFn: purchaseService.getAll,
  })
}

// Get pending purchases for admin
export function usePendingPurchases() {
  return useQuery({
    queryKey: purchaseKeys.pending(),
    queryFn: purchaseService.getPending,
  })
}

// Get purchase by ID
export function usePurchase(id: string) {
  return useQuery({
    queryKey: purchaseKeys.detail(id),
    queryFn: () => purchaseService.getById(id),
    enabled: !!id,
  })
}

// Get purchases by raffle ID
export function usePurchasesByRaffle(raffleId: string) {
  return useQuery({
    queryKey: purchaseKeys.byRaffle(raffleId),
    queryFn: () => purchaseService.getByRaffleId(raffleId),
    enabled: !!raffleId,
  })
}

// Create purchase/reservation mutation
export function useCreatePurchase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      raffleId,
      numbers,
      buyerInfo,
      userId,
    }: {
      raffleId: string
      numbers: number[]
      buyerInfo: CheckoutFormData
      userId?: string
    }) => purchaseService.create(raffleId, numbers, buyerInfo, userId),
    onSuccess: (_, variables) => {
      // Invalidate raffle to update number statuses
      queryClient.invalidateQueries({ queryKey: raffleKeys.detail(variables.raffleId) })
      queryClient.invalidateQueries({ queryKey: purchaseKeys.all })
      // Also invalidate user dashboard if user is logged in
      if (variables.userId) {
        queryClient.invalidateQueries({ queryKey: ['user-dashboard'] })
        queryClient.invalidateQueries({ queryKey: ['user-purchases'] })
        queryClient.invalidateQueries({ queryKey: ['user-raffles'] })
      }
    },
  })
}

// Confirm purchase mutation (admin)
export function useConfirmPurchase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => purchaseService.confirm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchaseKeys.all })
      queryClient.invalidateQueries({ queryKey: raffleKeys.all })
    },
  })
}

// Cancel purchase mutation (admin)
export function useCancelPurchase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => purchaseService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchaseKeys.all })
      queryClient.invalidateQueries({ queryKey: raffleKeys.all })
    },
  })
}
