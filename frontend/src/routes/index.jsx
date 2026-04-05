import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'

// Pages
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { DashboardPage } from '../pages/DashboardPage'
import { DashboardStatsPage } from '../pages/DashboardStatsPage'
import { DashboardOccupancyPage } from '../pages/DashboardOccupancyPage'
import { DashboardBookingsPage } from '../pages/DashboardBookingsPage'
import { RoomsPage } from '../pages/RoomsPage'
import { RoomTypesPage } from '../pages/RoomTypesPage'
import { BookingsPage } from '../pages/BookingsPage'
import { GuestsPage } from '../pages/GuestsPage'
import { NotFoundPage } from '../pages/NotFoundPage'

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/stats"
          element={
            <ProtectedRoute>
              <DashboardStatsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/occupancy"
          element={
            <ProtectedRoute>
              <DashboardOccupancyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/bookings"
          element={
            <ProtectedRoute>
              <DashboardBookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              <RoomsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/room-types"
          element={
            <ProtectedRoute>
              <RoomTypesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <BookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guests"
          element={
            <ProtectedRoute>
              <GuestsPage />
            </ProtectedRoute>
          }
        />

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
