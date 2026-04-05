import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { roomsService } from '../services/rooms.service'

export const useRooms = (filters = {}) => {
  return useQuery({
    queryKey: ['rooms', filters],
    queryFn: () => roomsService.getRooms(filters),
    staleTime: 1000 * 60 * 5,
  })
}

export const useRoom = (id) => {
  return useQuery({
    queryKey: ['room', id],
    queryFn: () => roomsService.getRoom(id),
    enabled: !!id,
  })
}

export const useCreateRoom = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => roomsService.createRoom(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
    },
  })
}

export const useUpdateRoom = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => roomsService.updateRoom(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
    },
  })
}

export const useDeleteRoom = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => roomsService.deleteRoom(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
    },
  })
}

export const useRoomTypes = () => {
  return useQuery({
    queryKey: ['roomTypes'],
    queryFn: () => roomsService.getRoomTypes(),
    staleTime: 1000 * 60 * 30,
  })
}

export const useCreateRoomType = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => roomsService.createRoomType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roomTypes'] })
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
    },
  })
}

export const useUpdateRoomType = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => roomsService.updateRoomType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roomTypes'] })
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
    },
  })
}

export const useDeleteRoomType = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => roomsService.deleteRoomType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roomTypes'] })
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
    },
  })
}
