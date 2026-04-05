import { useState } from 'react'
import { MainLayout } from '../layouts/MainLayout'
import { Card, CardBody, Button, Input, Select, Table, TableHead, TableBody, TableRow, TableHeader, TableCell, Modal, Loading, Alert } from '../components'
import { useBookings, useCreateBooking, useConfirmBooking, useCheckIn, useCheckOut, useCancelBooking } from '../hooks/useBookings'
import { useRooms } from '../hooks/useRooms'
import { useGuests } from '../hooks/useGuests'
import { Plus, CheckCircle, LogIn, LogOut, X, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'

export const BookingsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ roomId: '', guestId: '', checkIn: '', checkOut: '', adults: 1, children: 0 })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')

  const { data: bookings, isLoading } = useBookings()
  const { data: rooms } = useRooms()
  const { data: guests } = useGuests()
  const createMutation = useCreateBooking()
  const confirmMutation = useConfirmBooking()
  const checkInMutation = useCheckIn()
  const checkOutMutation = useCheckOut()
  const cancelMutation = useCancelBooking()

  const handleOpenModal = () => {
    setFormData({ roomId: '', guestId: '', checkIn: '', checkOut: '', adults: 1, children: 0 })
    setErrors({})
    setSubmitError('')
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSubmitError('')
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.roomId) newErrors.roomId = 'Room is required'
    if (!formData.guestId) newErrors.guestId = 'Guest is required'
    if (!formData.checkIn) newErrors.checkIn = 'Check-in date is required'
    if (!formData.checkOut) newErrors.checkOut = 'Check-out date is required'
    
    // Validate date comparison
    if (formData.checkIn && formData.checkOut) {
      const checkInDate = new Date(formData.checkIn)
      const checkOutDate = new Date(formData.checkOut)
      
      if (checkOutDate <= checkInDate) {
        newErrors.checkOut = 'Check-out date must be after check-in date'
      }
    }
    
    if (formData.adults < 1) newErrors.adults = 'At least 1 adult is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
    
    // Real-time validation for date comparison
    if (name === 'checkOut' && formData.checkIn) {
      const checkInDate = new Date(formData.checkIn)
      const checkOutDate = new Date(value)
      if (checkOutDate <= checkInDate) {
        setErrors((prev) => ({ ...prev, checkOut: 'Check-out date must be after check-in date' }))
      } else {
        setErrors((prev) => ({ ...prev, checkOut: '' }))
      }
    }
    
    if (name === 'checkIn' && formData.checkOut) {
      const checkInDate = new Date(value)
      const checkOutDate = new Date(formData.checkOut)
      if (checkOutDate <= checkInDate) {
        setErrors((prev) => ({ ...prev, checkOut: 'Check-out date must be after check-in date' }))
      } else {
        setErrors((prev) => ({ ...prev, checkOut: '' }))
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    
    if (!validateForm()) return

    try {
      // Convert form data to correct types for backend
      const bookingData = {
        roomId: formData.roomId,
        guestId: formData.guestId,
        checkIn: new Date(formData.checkIn).toISOString(),
        checkOut: new Date(formData.checkOut).toISOString(),
        adults: parseInt(formData.adults, 10),
        children: parseInt(formData.children, 10),
      }
      await createMutation.mutateAsync(bookingData)
      handleCloseModal()
    } catch (error) {
      // Parse backend error response
      const errorData = error.response?.data?.error
      
      if (errorData?.details && Array.isArray(errorData.details)) {
        // Handle validation errors with details
        const fieldErrors = {}
        const messages = []
        
        errorData.details.forEach((detail) => {
          if (detail.field) {
            fieldErrors[detail.field] = detail.message
          }
          messages.push(detail.message)
        })
        
        setErrors(fieldErrors)
        setSubmitError(`${errorData.message}: ${messages.join(', ')}`)
      } else if (errorData?.message) {
        // Handle simple error message
        setSubmitError(errorData.message)
      } else {
        setSubmitError(error.response?.data?.message || 'Failed to create booking')
      }
    }
  }

  const handleConfirm = async (id) => {
    try {
      await confirmMutation.mutateAsync(id)
    } catch (error) {
      alert('Failed to confirm booking')
    }
  }

  const handleCheckIn = async (id) => {
    try {
      await checkInMutation.mutateAsync(id)
    } catch (error) {
      alert('Failed to check in')
    }
  }

  const handleCheckOut = async (id) => {
    try {
      await checkOutMutation.mutateAsync(id)
    } catch (error) {
      alert('Failed to check out')
    }
  }

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelMutation.mutateAsync({ id, reason: 'Cancelled by staff' })
      } catch (error) {
        alert('Failed to cancel booking')
      }
    }
  }

  if (isLoading) return <MainLayout><Loading /></MainLayout>

  const roomOptions = rooms?.map((room) => ({
    value: room.id,
    label: `Room ${room.roomNumber}`,
  })) || []

  const guestOptions = guests?.map((guest) => ({
    value: guest.id,
    label: `${guest.firstName} ${guest.lastName || ''}`,
  })) || []

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    CHECKED_IN: 'bg-green-100 text-green-800',
    CHECKED_OUT: 'bg-gray-100 text-gray-800',
    CANCELLED: 'bg-red-100 text-red-800',
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
            <p className="text-gray-600 mt-1">Manage your hotel bookings</p>
          </div>
          <Button variant="primary" onClick={handleOpenModal}>
            <Plus size={20} className="mr-2" />
            New Booking
          </Button>
        </div>

        <Card>
          <CardBody>
            {bookings && bookings.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Booking #</TableHeader>
                    <TableHeader>Guest</TableHeader>
                    <TableHeader>Room</TableHeader>
                    <TableHeader>Check-in</TableHeader>
                    <TableHeader>Check-out</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.bookingNumber}</TableCell>
                      <TableCell>{booking.guest?.firstName} {booking.guest?.lastName}</TableCell>
                      <TableCell>Room {booking.room?.roomNumber}</TableCell>
                      <TableCell>{format(new Date(booking.checkIn), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{format(new Date(booking.checkOut), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[booking.status]}`}>
                          {booking.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {booking.status === 'PENDING' && (
                            <button
                              onClick={() => handleConfirm(booking.id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Confirm"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                          {booking.status === 'CONFIRMED' && (
                            <button
                              onClick={() => handleCheckIn(booking.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Check In"
                            >
                              <LogIn size={18} />
                            </button>
                          )}
                          {booking.status === 'CHECKED_IN' && (
                            <button
                              onClick={() => handleCheckOut(booking.id)}
                              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                              title="Check Out"
                            >
                              <LogOut size={18} />
                            </button>
                          )}
                          {['PENDING', 'CONFIRMED'].includes(booking.status) && (
                            <button
                              onClick={() => handleCancel(booking.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Cancel"
                            >
                              <X size={18} />
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-600 text-center py-8">No bookings found</p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Create New Booking">
        {submitError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">{submitError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Room"
            name="roomId"
            value={formData.roomId}
            onChange={handleChange}
            error={errors.roomId}
            options={roomOptions}
          />

          <Select
            label="Guest"
            name="guestId"
            value={formData.guestId}
            onChange={handleChange}
            error={errors.guestId}
            options={guestOptions}
          />

          <Input
            label="Check-in Date"
            type="date"
            name="checkIn"
            value={formData.checkIn}
            onChange={handleChange}
            error={errors.checkIn}
          />

          <Input
            label="Check-out Date"
            type="date"
            name="checkOut"
            value={formData.checkOut}
            onChange={handleChange}
            error={errors.checkOut}
          />

          <Input
            label="Adults"
            type="number"
            name="adults"
            value={formData.adults}
            onChange={handleChange}
            error={errors.adults}
            min="1"
          />

          <Input
            label="Children"
            type="number"
            name="children"
            value={formData.children}
            onChange={handleChange}
            min="0"
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" className="flex-1" loading={createMutation.isPending}>
              Create Booking
            </Button>
            <Button type="button" variant="secondary" className="flex-1" onClick={handleCloseModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  )
}
