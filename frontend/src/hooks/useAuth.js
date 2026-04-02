import { useQuery, useMutation } from '@tanstack/react-query'
import { authService } from '../services/auth.service'

export const useAuth = () => {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: () => authService.getCurrentUser(),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  return { user, isLoading, error, isAuthenticated: !!user }
}

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }) => authService.login(email, password),
  })
}

export const useLogout = () => {
  return useMutation({
    mutationFn: () => authService.logout(),
  })
}

export const useRegister = () => {
  return useMutation({
    mutationFn: (data) => authService.register(data),
  })
}

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (token) => authService.verifyEmail(token),
  })
}
