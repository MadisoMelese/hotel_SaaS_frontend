import api from './api'

export const authService = {
  register: async (data) => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    const { accessToken, refreshToken } = response.data.data

    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)

    return response.data
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    try {
      await api.post('/auth/logout', { refreshToken })
    } catch (error) {
      console.error('Logout error:', error)
    }

    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  },

  verifyEmail: async (token) => {
    const response = await api.post('/auth/verify-email', { token })
    return response.data
  },

  resendVerification: async (email) => {
    const response = await api.post('/auth/resend-verification', { email })
    return response.data
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me')
    return response.data.data
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    const response = await api.post('/auth/refresh', { refreshToken })
    const { accessToken, refreshToken: newRefreshToken } = response.data.data

    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', newRefreshToken)

    return response.data
  },
}
