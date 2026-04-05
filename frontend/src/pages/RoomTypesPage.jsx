import { useState } from 'react'
import { MainLayout } from '../layouts/MainLayout'
import { Card, CardHeader, CardBody, Button, Input, Table, TableHead, TableBody, TableRow, TableHeader, TableCell, Modal, Loading, Alert } from '../components'
import { useRoomTypes, useCreateRoomType, useUpdateRoomType, useDeleteRoomType } from '../hooks/useRooms'
import { Plus, Edit2, Trash2, DollarSign, Users } from 'lucide-react'

export const RoomTypesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingType, setEditingType] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '', basePrice: '', capacity: 1 })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')

  const { data: roomTypes, isLoading } = useRoomTypes()
  const createMutation = useCreateRoomType()
  const updateMutation = useUpdateRoomType()
  const deleteMutation = useDeleteRoomType()

  const handleOpenModal = (type = null) => {
    if (type) {
      setEditingType(type)
      setFormData({
        name: type.name,
        description: type.description || '',
        basePrice: type.basePrice,
        capacity: type.capacity,
      })
    } else {
      setEditingType(null)
      setFormData({ name: '', description: '', basePrice: '', capacity: 1 })
    }
    setErrors({})
    setSubmitError('')
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingType(null)
    setSubmitError('')
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name) newErrors.name = 'Room type name is required'
    if (!formData.basePrice) newErrors.basePrice = 'Base price is required'
    if (parseFloat(formData.basePrice) <= 0) newErrors.basePrice = 'Price must be greater than 0'
    if (formData.capacity < 1) newErrors.capacity = 'Capacity must be at least 1'
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
    setSubmitError('')
    
    if (!validateForm()) return

    try {
      const data = {
        name: formData.name,
        description: formData.description,
        basePrice: parseFloat(formData.basePrice),
        capacity: parseInt(formData.capacity, 10),
      }

      if (editingType) {
        await updateMutation.mutateAsync({ id: editingType.id, data })
      } else {
        await createMutation.mutateAsync(data)
      }
      handleCloseModal()
    } catch (error) {
      const errorData = error.response?.data?.error
      if (errorData?.message) {
        setSubmitError(errorData.message)
      } else {
        setSubmitError(error.response?.data?.message || 'Failed to save room type')
      }
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room type? This will affect all rooms of this type.')) {
      try {
        await deleteMutation.mutateAsync(id)
      } catch (error) {
        alert('Failed to delete room type')
      }
    }
  }

  if (isLoading) return <MainLayout><Loading /></MainLayout>

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Room Types</h1>
            <p className="text-gray-600 mt-1">Manage your hotel room types and pricing</p>
          </div>
          <Button variant="primary" onClick={() => handleOpenModal()}>
            <Plus size={20} className="mr-2" />
            Add Room Type
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Room Types</p>
                  <p className="text-4xl font-bold text-gray-900 mt-2">{roomTypes?.length || 0}</p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                  <Users size={32} />
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Avg Base Price</p>
                  <p className="text-4xl font-bold text-gray-900 mt-2">
                    {roomTypes && roomTypes.length > 0
                      ? (roomTypes.reduce((sum, t) => sum + parseFloat(t.basePrice), 0) / roomTypes.length).toFixed(2)
                      : 0} ETB
                  </p>
                </div>
                <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                  <DollarSign size={32} />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Room Types Table */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Room Types List</h2>
          </CardHeader>
          <CardBody>
            {roomTypes && roomTypes.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeader>Name</TableHeader>
                      <TableHeader>Description</TableHeader>
                      <TableHeader>Base Price</TableHeader>
                      <TableHeader>Capacity</TableHeader>
                      <TableHeader>Status</TableHeader>
                      <TableHeader>Actions</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {roomTypes.map((type) => (
                      <TableRow key={type.id}>
                        <TableCell className="font-medium">{type.name}</TableCell>
                        <TableCell className="text-sm text-gray-600">{type.description || '-'}</TableCell>
                        <TableCell className="font-medium">{parseFloat(type.basePrice).toFixed(2)} ETB</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                            <Users size={16} />
                            {type.capacity}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            type.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {type.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleOpenModal(type)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(type.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No room types found. Create one to get started.</p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingType ? 'Edit Room Type' : 'Add New Room Type'}
      >
        {submitError && (
          <Alert type="error" message={submitError} className="mb-4" />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Room Type Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="e.g., Deluxe Suite, Standard Room"
          />

          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g., Spacious room with city view"
          />

          <Input
            label="Base Price (ETB)"
            type="number"
            name="basePrice"
            value={formData.basePrice}
            onChange={handleChange}
            error={errors.basePrice}
            placeholder="5000"
            step="0.01"
            min="0"
          />

          <Input
            label="Capacity (Guests)"
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            error={errors.capacity}
            min="1"
            max="10"
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" className="flex-1" loading={createMutation.isPending || updateMutation.isPending}>
              {editingType ? 'Update Room Type' : 'Add Room Type'}
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
