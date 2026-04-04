import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../services/dashboard.service'

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => dashboardService.getStats(),
    staleTime: 1000 * 60 * 5,
  })
}

export const useOccupancy = (days = 30) => {
  return useQuery({
    queryKey: ['occupancy', days],
    queryFn: () => dashboardService.getOccupancy(days),
    staleTime: 1000 * 60 * 5,
  })
}

export const useRecentBookings = () => {
  return useQuery({
    queryKey: ['recentBookings'],
    queryFn: () => dashboardService.getRecentBookings(),
    staleTime: 1000 * 60 * 5,
  })
}

export const useHotelInfo = () => {
  return useQuery({
    queryKey: ['hotelInfo'],
    queryFn: () => dashboardService.getHotelInfo(),
    staleTime: 1000 * 60 * 10,
  })
}

export const useHotelStats = () => {
  return useQuery({
    queryKey: ['hotelStats'],
    queryFn: () => dashboardService.getHotelStats(),
    staleTime: 1000 * 60 * 5,
  })
}

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => dashboardService.getUsers(),
    staleTime: 1000 * 60 * 5,
  })
}

export const usePayments = () => {
  return useQuery({
    queryKey: ['payments'],
    queryFn: () => dashboardService.getPayments(),
    staleTime: 1000 * 60 * 5,
  })
}
