import { MainLayout } from '../layouts/MainLayout'
import { Card, CardHeader, CardBody, Loading } from '../components'
import { useDashboardStats } from '../hooks/useDashboard'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { DoorOpen, Users, BarChart3, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react'

const StatBox = ({ icon: Icon, label, value, change, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
  }

  return (
    <div className={`border rounded-lg p-6 ${colors[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-4xl font-bold mt-2">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-2 text-sm">
              {change >= 0 ? (
                <>
                  <ArrowUp size={16} className="mr-1" />
                  <span className="text-green-600">+{change}%</span>
                </>
              ) : (
                <>
                  <ArrowDown size={16} className="mr-1" />
                  <span className="text-red-600">{change}%</span>
                </>
              )}
            </div>
          )}
        </div>
        <Icon size={32} className="opacity-20" />
      </div>
    </div>
  )
}

export const DashboardStatsPage = () => {
  const { data: stats, isLoading } = useDashboardStats()

  if (isLoading) return <MainLayout><Loading /></MainLayout>

  // Prepare data for pie chart
  const roomStatusData = [
    { name: 'Occupied', value: stats?.occupiedRooms || 0, fill: '#10b981' },
    { name: 'Available', value: stats?.availableRooms || 0, fill: '#3b82f6' },
  ]

  // Prepare data for bar chart
  const bookingData = [
    { name: 'Today Check-ins', value: stats?.todayCheckIns || 0, fill: '#6366f1' },
    { name: 'Today Check-outs', value: stats?.todayCheckOuts || 0, fill: '#f59e0b' },
    { name: 'Total Bookings', value: stats?.totalBookings || 0, fill: '#8b5cf6' },
  ]

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Statistics</h1>
          <p className="text-gray-600 mt-1">Comprehensive overview of your hotel metrics</p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatBox
            icon={DoorOpen}
            label="Total Rooms"
            value={stats?.totalRooms || 0}
            color="blue"
          />
          <StatBox
            icon={Users}
            label="Occupied Rooms"
            value={stats?.occupiedRooms || 0}
            color="green"
          />
          <StatBox
            icon={BarChart3}
            label="Available Rooms"
            value={stats?.availableRooms || 0}
            color="purple"
          />
          <StatBox
            icon={TrendingUp}
            label="Occupancy Rate"
            value={`${stats?.occupancyRate || 0}%`}
            color="orange"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Room Status Pie Chart */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Room Status Distribution</h2>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={roomStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {roomStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          {/* Booking Activity Bar Chart */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Booking Activity</h2>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bookingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </div>

        {/* Detailed Stats */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Detailed Metrics</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border-l-4 border-indigo-500 pl-4">
                <p className="text-sm text-gray-600">Today Check-ins</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.todayCheckIns || 0}</p>
              </div>
              <div className="border-l-4 border-amber-500 pl-4">
                <p className="text-sm text-gray-600">Today Check-outs</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.todayCheckOuts || 0}</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <p className="text-sm text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.monthlyRevenue || 0} ETB</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  )
}
