import api from './api'

export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats')
    return response.data.data
  },

  getOccupancy: async (days = 30) => {
    const response = await api.get('/dashboard/occupancy', { params: { days } })
    return response.data.data
  },

  getRecentBookings: async () => {
    const response = await api.get('/dashboard/recent-bookings')
    return response.data.data
  },

  getHotelInfo: async () => {
    const response = await api.get('/hotels/me')
    return response.data.data
  },

  getHotelStats: async () => {
    const response = await api.get('/hotels/me/stats')
    return response.data.data
  },

  getUsers: async () => {
    const response = await api.get('/users')
    return response.data.data.data || []
  },

  getPayments: async () => {
    const response = await api.get('/payments')
    return response.data.data.data || []
  },
}
