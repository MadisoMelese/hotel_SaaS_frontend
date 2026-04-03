import api from './api'

export const roomsService = {
  getRooms: async (filters = {}) => {
    const response = await api.get('/rooms', { params: filters })
    // Backend returns { data: { data: [...], pagination: {...} } }
    return response.data.data.data || []
  },

  getRoom: async (id) => {
    const response = await api.get(`/rooms/${id}`)
    return response.data.data
  },

  createRoom: async (data) => {
    const response = await api.post('/rooms', data)
    return response.data.data
  },

  updateRoom: async (id, data) => {
    const response = await api.put(`/rooms/${id}`, data)
    return response.data.data
  },

  deleteRoom: async (id) => {
    const response = await api.delete(`/rooms/${id}`)
    return response.data
  },

  getRoomTypes: async () => {
    const response = await api.get('/rooms/types')
    return response.data.data
  },

  createRoomType: async (data) => {
    const response = await api.post('/rooms/types', data)
    return response.data.data
  },
}
