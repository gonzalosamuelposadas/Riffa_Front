import { useQuery } from '@tanstack/react-query'
import { dashboardService, DashboardData, UserPurchase } from '../services/dashboard'

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ['user-dashboard'],
    queryFn: dashboardService.getDashboard,
    staleTime: 30 * 1000 // 30 seconds
  })
}

export function useUserPurchases() {
  return useQuery<UserPurchase[]>({
    queryKey: ['user-purchases'],
    queryFn: dashboardService.getPurchases,
    staleTime: 30 * 1000
  })
}

export function useUserRaffles() {
  return useQuery({
    queryKey: ['user-raffles'],
    queryFn: dashboardService.getRaffles,
    staleTime: 30 * 1000
  })
}
