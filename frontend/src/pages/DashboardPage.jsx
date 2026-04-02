import { MainLayout } from '../layouts/MainLayout'
import { Card, CardHeader, CardBody, Loading } from '../components'
import { useDashboardStats } from '../hooks/useDashboard'
import { BarChart3, Users, DoorOpen, TrendingUp } from 'lucide-react'

const StatCard = ({ icon: Icon, label, value, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </Card>
  )
}

export const DashboardPage = () => {
  const { data: stats, isLoading, error } = useDashboardStats()

  if (isLoading) return <MainLayout><Loading /></MainLayout>

  if (error) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-red-600">Failed to load dashboard stats</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your hotel overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={DoorOpen}
            label="Total Rooms"
            value={stats?.totalRooms || 0}
            color="blue"
          />
          <StatCard
            icon={Users}
            label="Occupied Rooms"
            value={stats?.occupiedRooms || 0}
            color="green"
          />
          <StatCard
            icon={BarChart3}
            label="Total Bookings"
            value={stats?.totalBookings || 0}
            color="purple"
          />
          <StatCard
            icon={TrendingUp}
            label="Revenue (ETB)"
            value={`${stats?.totalRevenue || 0}`}
            color="orange"
          />
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600">No recent bookings</p>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  )
}
