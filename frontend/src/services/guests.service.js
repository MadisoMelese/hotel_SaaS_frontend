import api from './api'

export const guestsService = {
  getGuests: async (filters = {}) => {
    const response = await api.get('/guests', { params: filters })
    return response.data.data
  },

  getGuest: async (id) => {
    const response = await api.get(`/guests/${id}`)
    return response.data.data
  },

  createGuest: async (data) => {
    const response = await api.post('/guests', data)
    return response.data.data
  },

  updateGuest: async (id, data) => {
    const response = await api.put(`/guests/${id}`, data)
    return response.data.data
  },

  deleteGuest: async (id) => {
    const response = await api.delete(`/guests/${id}`)
    return response.data
  },
}
