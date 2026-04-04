import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  DoorOpen,
  Calendar,
  Users,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'
import { useLogout } from '../hooks/useAuth'

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const logoutMutation = useLogout()

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: DoorOpen, label: 'Rooms', path: '/rooms' },
    { icon: Calendar, label: 'Bookings', path: '/bookings' },
    { icon: Users, label: 'Guests', path: '/guests' },
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = async () => {
    await logoutMutation.mutateAsync()
    window.location.href = '/login'
  }

  return (
    <>
      {/* Menu button - visible on all devices */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar - only visible on mobile/tablet */}
      <aside
        className={clsx(
          'fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white transition-transform duration-300 z-30 lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-6 pt-16">
          <h1 className="text-2xl font-bold">Hotel SaaS</h1>
        </div>

        <nav className="mt-8">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={clsx(
                  'flex items-center gap-3 px-6 py-3 transition-colors',
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                )}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800">
          <button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="flex items-center gap-3 w-full px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>{logoutMutation.isPending ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
