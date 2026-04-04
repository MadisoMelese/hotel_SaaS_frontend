import { MainLayout } from '../layouts/MainLayout'
import { Card, CardHeader, CardBody, Loading, Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../components'
import { useRecentBookings } from '../hooks/useDashboard'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import { Calendar, Users, DollarSign } from 'lucide-react'

export const DashboardBookingsPage = () => {
  const { data: bookings, isLoading } = useRecentBookings()

  if (isLoading) return <MainLayout><Loading /></MainLayout>

  // Calculate statistics
  const totalBookings = bookings?.length || 0
  const totalRevenue = bookings?.reduce((sum, b) => sum + parseFloat(b.totalPrice || 0), 0) || 0
  const avgBookingValue = totalBookings > 0 ? (totalRevenue / totalBookings).toFixed(2) : 0

  // Status breakdown
  const statusCounts = bookings?.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1
    return acc
  }, {}) || {}

  const statusData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
  }))

  const statusColors = {
    PENDING: '#fbbf24',
    CONFIRMED: '#3b82f6',
    CHECKED_IN: '#10b981',
    CHECKED_OUT: '#6b7280',
    CANCELLED: '#ef4444',
  }

  // Guest count distribution
  const guestCounts = bookings?.reduce((acc, b) => {
    const total = (b.adults || 0) + (b.children || 0)
    acc[total] = (acc[total] || 0) + 1
    return acc
  }, {}) || {}

  const guestData = Object.entries(guestCounts)
    .map(([count, bookingCount]) => ({
      name: `${count} Guest${count > 1 ? 's' : ''}`,
      value: bookingCount,
    }))
    .sort((a, b) => parseInt(a.name) - parseInt(b.name))

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings Analytics</h1>
          <p className="text-gray-600 mt-1">Detailed view of all bookings and trends</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Bookings</p>
                  <p className="text-4xl font-bold text-gray-900 mt-2">{totalBookings}</p>
                </div>
                <Calendar className="text-blue-500 opacity-20" size={40} />
              </div>
            </div>
          </Card>
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
                  <p className="text-4xl font-bold text-green-600 mt-2">{totalRevenue.toFixed(2)} ETB</p>
                </div>
                <DollarSign className="text-green-500 opacity-20" size={40} />
              </div>
            </div>
          </Card>
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Avg Booking Value</p>
                  <p className="text-4xl font-bold text-purple-600 mt-2">{avgBookingValue} ETB</p>
                </div>
                <Users className="text-purple-500 opacity-20" size={40} />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Booking Status Distribution */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Booking Status Distribution</h2>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={statusColors[entry.name] || '#8884d8'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          {/* Guest Count Distribution */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Guest Count Distribution</h2>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={guestData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Bookings" />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </div>

        {/* Status Breakdown */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Status Breakdown</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium">{status}</p>
                  <p className="text-3xl font-bold mt-2" style={{ color: statusColors[status] }}>
                    {count}
                  </p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Recent Bookings Table */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Booking #</TableHeader>
                    <TableHeader>Guest</TableHeader>
                    <TableHeader>Room</TableHeader>
                    <TableHeader>Check-in</TableHeader>
                    <TableHeader>Check-out</TableHeader>
                    <TableHeader>Guests</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Revenue</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings?.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.bookingNumber}</TableCell>
                      <TableCell>{booking.guest?.firstName} {booking.guest?.lastName}</TableCell>
                      <TableCell>Room {booking.room?.roomNumber}</TableCell>
                      <TableCell>{format(new Date(booking.checkIn), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{format(new Date(booking.checkOut), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{(booking.adults || 0) + (booking.children || 0)}</TableCell>
                      <TableCell>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: statusColors[booking.status] }}
                        >
                          {booking.status}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{booking.totalPrice} ETB</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  )
}
