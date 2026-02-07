import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { raffleService } from '../services/raffles'
import type { RaffleFormData } from '@shared'

export const raffleKeys = {
  all: ['raffles'] as const,
  lists: () => [...raffleKeys.all, 'list'] as const,
  list: (filters: string) => [...raffleKeys.lists(), filters] as const,
  details: () => [...raffleKeys.all, 'detail'] as const,
  detail: (id: string) => [...raffleKeys.details(), id] as const,
  admin: () => [...raffleKeys.all, 'admin'] as const,
}

// Get all public raffles
export function useRaffles() {
  return useQuery({
    queryKey: raffleKeys.lists(),
    queryFn: raffleService.getAll,
  })
}

// Get all raffles for admin
export function useAdminRaffles() {
  return useQuery({
    queryKey: raffleKeys.admin(),
    queryFn: raffleService.getAllAdmin,
  })
}

// Get single raffle by ID
export function useRaffle(id: string) {
  return useQuery({
    queryKey: raffleKeys.detail(id),
    queryFn: () => raffleService.getById(id),
    enabled: !!id,
  })
}

// Create raffle mutation
export function useCreateRaffle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RaffleFormData) => raffleService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: raffleKeys.all })
    },
  })
}

// Update raffle mutation
export function useUpdateRaffle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RaffleFormData }) =>
      raffleService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: raffleKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: raffleKeys.lists() })
      queryClient.invalidateQueries({ queryKey: raffleKeys.admin() })
    },
  })
}

// Delete raffle mutation
export function useDeleteRaffle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => raffleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: raffleKeys.all })
    },
  })
}

// Perform draw mutation
export function usePerformDraw() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => raffleService.performDraw(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: raffleKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: raffleKeys.lists() })
      queryClient.invalidateQueries({ queryKey: raffleKeys.admin() })
    },
  })
}

// Get winners list
export function useWinners() {
  return useQuery({
    queryKey: ['winners'],
    queryFn: raffleService.getWinners,
  })
}
