import api from './api'

export const bookingsService = {
  getBookings: async (filters = {}) => {
    const response = await api.get('/bookings', { params: filters })
    // Backend returns { data: { data: [...], pagination: {...} } }
    return response.data.data.data || []
  },

  getBooking: async (id) => {
    const response = await api.get(`/bookings/${id}`)
    return response.data.data
  },

  createBooking: async (data) => {
    const response = await api.post('/bookings', data)
    return response.data.data
  },

  updateBooking: async (id, data) => {
    const response = await api.put(`/bookings/${id}`, data)
    return response.data.data
  },

  confirmBooking: async (id) => {
    const response = await api.post(`/bookings/${id}/confirm`)
    return response.data.data
  },

  checkIn: async (id) => {
    const response = await api.post(`/bookings/${id}/check-in`)
    return response.data.data
  },

  checkOut: async (id) => {
    const response = await api.post(`/bookings/${id}/check-out`)
    return response.data.data
  },

  cancelBooking: async (id, reason) => {
    const response = await api.post(`/bookings/${id}/cancel`, { reason })
    return response.data.data
  },
}
