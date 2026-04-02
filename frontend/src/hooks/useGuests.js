import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { guestsService } from '../services/guests.service'

export const useGuests = (filters = {}) => {
  return useQuery({
    queryKey: ['guests', filters],
    queryFn: () => guestsService.getGuests(filters),
    staleTime: 1000 * 60 * 5,
  })
}

export const useGuest = (id) => {
  return useQuery({
    queryKey: ['guest', id],
    queryFn: () => guestsService.getGuest(id),
    enabled: !!id,
  })
}

export const useCreateGuest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => guestsService.createGuest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] })
    },
  })
}

export const useUpdateGuest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => guestsService.updateGuest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] })
    },
  })
}

export const useDeleteGuest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => guestsService.deleteGuest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] })
    },
  })
}
