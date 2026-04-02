import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../services/dashboard.service'

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => dashboardService.getStats(),
    staleTime: 1000 * 60 * 5,
  })
}

export const useRevenueStats = (period = 'month') => {
  return useQuery({
    queryKey: ['revenueStats', period],
    queryFn: () => dashboardService.getRevenueStats(period),
    staleTime: 1000 * 60 * 5,
  })
}

export const useOccupancyStats = () => {
  return useQuery({
    queryKey: ['occupancyStats'],
    queryFn: () => dashboardService.getOccupancyStats(),
    staleTime: 1000 * 60 * 5,
  })
}
