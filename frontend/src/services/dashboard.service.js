import api from './api'

export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats')
    return response.data.data
  },

  getRevenueStats: async (period = 'month') => {
    const response = await api.get('/dashboard/revenue', { params: { period } })
    return response.data.data
  },

  getOccupancyStats: async () => {
    const response = await api.get('/dashboard/occupancy')
    return response.data.data
  },
}
