import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bookingsService } from '../services/bookings.service'

export const useBookings = (filters = {}) => {
  return useQuery({
    queryKey: ['bookings', filters],
    queryFn: () => bookingsService.getBookings(filters),
    staleTime: 1000 * 60 * 5,
  })
}

export const useBooking = (id) => {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingsService.getBooking(id),
    enabled: !!id,
  })
}

export const useCreateBooking = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => bookingsService.createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })
}

export const useUpdateBooking = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => bookingsService.updateBooking(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })
}

export const useConfirmBooking = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => bookingsService.confirmBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })
}

export const useCheckIn = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => bookingsService.checkIn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })
}

export const useCheckOut = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => bookingsService.checkOut(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })
}

export const useCancelBooking = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reason }) => bookingsService.cancelBooking(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })
}
