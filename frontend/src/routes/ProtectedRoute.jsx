import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Loading } from '../components'

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <Loading message="Loading..." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
