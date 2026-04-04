import { MainLayout } from '../layouts/MainLayout'
import { Card, CardHeader, CardBody, Loading, Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../components'
import { useDashboardStats, useRecentBookings, useOccupancy, useHotelInfo, useUsers, usePayments } from '../hooks/useDashboard'
import { BarChart3, Users, DoorOpen, TrendingUp, CreditCard, Building2, Calendar } from 'lucide-react'
import { format } from 'date-fns'

const StatCard = ({ icon: Icon, label, value, color = 'blue', subtext = '' }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </Card>
  )
}

export const DashboardPage = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: recentBookings, isLoading: bookingsLoading } = useRecentBookings()
  const { data: occupancy } = useOccupancy(30)
  const { data: hotelInfo } = useHotelInfo()
  const { data: users } = useUsers()
  const { data: payments } = usePayments()

  const isLoading = statsLoading || bookingsLoading

  if (isLoading) return <MainLayout><Loading /></MainLayout>

  // Calculate occupancy rate from occupancy data
  const currentOccupancy = occupancy?.[occupancy.length - 1]?.occupancyRate || 0

  // Calculate total payments
  const totalPayments = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0

  // Get active users count
  const activeUsers = users?.filter(u => u.status === 'ACTIVE').length || 0

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your hotel overview.</p>
          {hotelInfo && <p className="text-sm text-gray-500 mt-1">{hotelInfo.name}</p>}
        </div>

        {/* Main Stats Grid */}
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
            subtext={`${currentOccupancy}% occupancy`}
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
            label="Monthly Revenue"
            value={`${stats?.monthlyRevenue || 0} ETB`}
            color="orange"
          />
        </div>

        {/* Secondary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Calendar}
            label="Today Check-ins"
            value={stats?.todayCheckIns || 0}
            color="indigo"
          />
          <StatCard
            icon={Calendar}
            label="Today Check-outs"
            value={stats?.todayCheckOuts || 0}
            color="red"
          />
          <StatCard
            icon={CreditCard}
            label="Total Payments"
            value={`${totalPayments.toFixed(2)} ETB`}
            color="green"
          />
          <StatCard
            icon={Users}
            label="Active Staff"
            value={activeUsers}
            color="blue"
          />
        </div>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
          </CardHeader>
          <CardBody>
            {recentBookings && recentBookings.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Booking #</TableHeader>
                    <TableHeader>Guest</TableHeader>
                    <TableHeader>Room</TableHeader>
                    <TableHeader>Check-in</TableHeader>
                    <TableHeader>Check-out</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Total Price</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentBookings.slice(0, 5).map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.bookingNumber}</TableCell>
                      <TableCell>{booking.guest?.firstName} {booking.guest?.lastName}</TableCell>
                      <TableCell>Room {booking.room?.roomNumber}</TableCell>
                      <TableCell>{format(new Date(booking.checkIn), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{format(new Date(booking.checkOut), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          booking.status === 'CHECKED_IN' ? 'bg-green-100 text-green-800' :
                          booking.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'CHECKED_OUT' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                      </TableCell>
                      <TableCell>{booking.totalPrice} ETB</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-600 text-center py-8">No recent bookings</p>
            )}
          </CardBody>
        </Card>

        {/* Staff & Payments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Staff Members */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Staff Members</h2>
            </CardHeader>
            <CardBody>
              {users && users.length > 0 ? (
                <div className="space-y-3">
                  {users.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center justify-between pb-3 border-b last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">No staff members</p>
              )}
            </CardBody>
          </Card>

          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>
            </CardHeader>
            <CardBody>
              {payments && payments.length > 0 ? (
                <div className="space-y-3">
                  {payments.slice(0, 5).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between pb-3 border-b last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">{payment.bookingNumber || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{payment.method}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{payment.amount} ETB</p>
                        <span className={`text-xs font-medium ${
                          payment.status === 'COMPLETED' ? 'text-green-600' :
                          payment.status === 'PENDING' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">No recent payments</p>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Occupancy Chart Data */}
        {occupancy && occupancy.length > 0 && (
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">30-Day Occupancy Trend</h2>
            </CardHeader>
            <CardBody>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4 font-medium text-gray-700">Date</th>
                      <th className="text-right py-2 px-4 font-medium text-gray-700">Occupied</th>
                      <th className="text-right py-2 px-4 font-medium text-gray-700">Available</th>
                      <th className="text-right py-2 px-4 font-medium text-gray-700">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {occupancy.slice(-7).map((day) => (
                      <tr key={day.date} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{format(new Date(day.date), 'MMM dd')}</td>
                        <td className="text-right py-2 px-4">{day.occupiedRooms}</td>
                        <td className="text-right py-2 px-4">{day.availableRooms}</td>
                        <td className="text-right py-2 px-4 font-medium">{day.occupancyRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
