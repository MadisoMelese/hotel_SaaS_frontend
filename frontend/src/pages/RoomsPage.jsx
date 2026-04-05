import { useState } from 'react'
import { MainLayout } from '../layouts/MainLayout'
import { Card, CardHeader, CardBody, Button, Input, Select, Table, TableHead, TableBody, TableRow, TableHeader, TableCell, Modal, Loading, Alert } from '../components'
import { useRooms, useCreateRoom, useUpdateRoom, useDeleteRoom, useRoomTypes } from '../hooks/useRooms'
import { Plus, Edit2, Trash2 } from 'lucide-react'

export const RoomsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState(null)
  const [formData, setFormData] = useState({ roomNumber: '', roomTypeId: '', floor: '', status: 'AVAILABLE' })
  const [errors, setErrors] = useState({})

  const { data: rooms, isLoading } = useRooms()
  const { data: roomTypes } = useRoomTypes()
  const createMutation = useCreateRoom()
  const updateMutation = useUpdateRoom()
  const deleteMutation = useDeleteRoom()

  const handleOpenModal = (room = null) => {
    if (room) {
      setEditingRoom(room)
      setFormData({
        roomNumber: room.roomNumber,
        roomTypeId: room.roomTypeId,
        floor: room.floor || '',
        status: room.status,
      })
    } else {
      setEditingRoom(null)
      setFormData({ roomNumber: '', roomTypeId: '', floor: '', status: 'AVAILABLE' })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingRoom(null)
    setErrors({})
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.roomNumber) newErrors.roomNumber = 'Room number is required'
    if (!formData.roomTypeId) newErrors.roomTypeId = 'Room type is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const roomData = {
        roomNumber: formData.roomNumber,
        roomTypeId: formData.roomTypeId,
        floor: formData.floor ? parseInt(formData.floor, 10) : null,
        status: formData.status,
      }

      if (editingRoom) {
        await updateMutation.mutateAsync({ id: editingRoom.id, data: roomData })
      } else {
        await createMutation.mutateAsync(roomData)
      }
      handleCloseModal()
    } catch (error) {
      setErrors({ submit: error.response?.data?.error?.message || 'Failed to save room' })
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await deleteMutation.mutateAsync(id)
      } catch (error) {
        alert('Failed to delete room')
      }
    }
  }

  if (isLoading) return <MainLayout><Loading /></MainLayout>

  const roomTypeOptions = roomTypes?.map((type) => ({
    value: type.id,
    label: type.name,
  })) || []

  const statusOptions = [
    { value: 'AVAILABLE', label: 'Available' },
    { value: 'OCCUPIED', label: 'Occupied' },
    { value: 'MAINTENANCE', label: 'Maintenance' },
    { value: 'RESERVED', label: 'Reserved' },
  ]

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Rooms</h1>
            <p className="text-gray-600 mt-1">Manage your hotel rooms</p>
          </div>
          <Button variant="primary" onClick={() => handleOpenModal()}>
            <Plus size={20} className="mr-2" />
            Add Room
          </Button>
        </div>

        <Card>
          <CardBody>
            {rooms && rooms.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Room Number</TableHeader>
                    <TableHeader>Type</TableHeader>
                    <TableHeader>Floor</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell>{room.roomNumber}</TableCell>
                      <TableCell>{room.roomType?.name}</TableCell>
                      <TableCell>{room.floor || '-'}</TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          room.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                          room.status === 'OCCUPIED' ? 'bg-blue-100 text-blue-800' :
                          room.status === 'MAINTENANCE' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {room.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenModal(room)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(room.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-600 text-center py-8">No rooms found</p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingRoom ? 'Edit Room' : 'Add New Room'}
      >
        {errors.submit && (
          <Alert type="error" message={errors.submit} className="mb-4" />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Room Number"
            name="roomNumber"
            value={formData.roomNumber}
            onChange={handleChange}
            error={errors.roomNumber}
            placeholder="101"
          />

          <Select
            label="Room Type"
            name="roomTypeId"
            value={formData.roomTypeId}
            onChange={handleChange}
            error={errors.roomTypeId}
            options={roomTypeOptions}
          />

          <Input
            label="Floor"
            type="number"
            name="floor"
            value={formData.floor}
            onChange={handleChange}
            placeholder="1"
          />

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={statusOptions}
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" className="flex-1" loading={createMutation.isPending || updateMutation.isPending}>
              {editingRoom ? 'Update Room' : 'Add Room'}
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
