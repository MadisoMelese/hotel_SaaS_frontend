import { useState } from 'react'
import { MainLayout } from '../layouts/MainLayout'
import { Card, CardHeader, CardBody, Loading, Button } from '../components'
import { useOccupancy } from '../hooks/useDashboard'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Calendar } from 'lucide-react'

export const DashboardOccupancyPage = () => {
  const [days, setDays] = useState(30)
  const { data: occupancy, isLoading } = useOccupancy(days)

  if (isLoading) return <MainLayout><Loading /></MainLayout>

  const dayOptions = [
    { label: '7 Days', value: 7 },
    { label: '14 Days', value: 14 },
    { label: '30 Days', value: 30 },
    { label: '60 Days', value: 60 },
    { label: '90 Days', value: 90 },
  ]

  // Calculate statistics
  const avgOccupancy = occupancy?.length > 0
    ? (occupancy.reduce((sum, d) => sum + parseFloat(d.occupancyRate), 0) / occupancy.length).toFixed(2)
    : 0

  const maxOccupancy = occupancy?.length > 0
    ? Math.max(...occupancy.map(d => parseFloat(d.occupancyRate)))
    : 0

  const minOccupancy = occupancy?.length > 0
    ? Math.min(...occupancy.map(d => parseFloat(d.occupancyRate)))
    : 0

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Occupancy Analytics</h1>
            <p className="text-gray-600 mt-1">Track your hotel occupancy trends over time</p>
          </div>
          <div className="flex gap-2">
            {dayOptions.map((option) => (
              <Button
                key={option.value}
                variant={days === option.value ? 'primary' : 'secondary'}
                onClick={() => setDays(option.value)}
                className="text-sm"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="p-6">
              <p className="text-sm text-gray-600 font-medium">Average Occupancy</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">{avgOccupancy}%</p>
              <p className="text-xs text-gray-500 mt-2">Last {days} days</p>
            </div>
          </Card>
          <Card>
            <div className="p-6">
              <p className="text-sm text-gray-600 font-medium">Peak Occupancy</p>
              <p className="text-4xl font-bold text-green-600 mt-2">{maxOccupancy}%</p>
              <p className="text-xs text-gray-500 mt-2">Highest rate</p>
            </div>
          </Card>
          <Card>
            <div className="p-6">
              <p className="text-sm text-gray-600 font-medium">Lowest Occupancy</p>
              <p className="text-4xl font-bold text-orange-600 mt-2">{minOccupancy}%</p>
              <p className="text-xs text-gray-500 mt-2">Lowest rate</p>
            </div>
          </Card>
        </div>

        {/* Line Chart */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Occupancy Rate Trend</h2>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={occupancy}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="occupancyRate"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Occupancy Rate"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Area Chart */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Occupied vs Available Rooms</h2>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={occupancy}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="occupiedRooms"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  name="Occupied Rooms"
                />
                <Area
                  type="monotone"
                  dataKey="availableRooms"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  name="Available Rooms"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Daily Occupancy Breakdown</h2>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={occupancy}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="occupiedRooms" fill="#10b981" name="Occupied" radius={[8, 8, 0, 0]} />
                <Bar dataKey="availableRooms" fill="#3b82f6" name="Available" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Detailed Data</h2>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Occupied</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Available</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {occupancy?.map((day, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{day.date}</td>
                      <td className="text-right py-3 px-4 font-medium">{day.occupiedRooms}</td>
                      <td className="text-right py-3 px-4 font-medium">{day.availableRooms}</td>
                      <td className="text-right py-3 px-4">
                        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                          {day.occupancyRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  )
}
