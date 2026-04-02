import { useState } from 'react'
import { MainLayout } from '../layouts/MainLayout'
import { Card, CardHeader, CardBody, Button, Input, Table, TableHead, TableBody, TableRow, TableHeader, TableCell, Modal, Loading, Alert } from '../components'
import { useGuests, useCreateGuest, useUpdateGuest, useDeleteGuest } from '../hooks/useGuests'
import { Plus, Edit2, Trash2 } from 'lucide-react'

export const GuestsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGuest, setEditingGuest] = useState(null)
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', idType: '', idNumber: '', address: '', city: '' })
  const [errors, setErrors] = useState({})

  const { data: guests, isLoading } = useGuests()
  const createMutation = useCreateGuest()
  const updateMutation = useUpdateGuest()
  const deleteMutation = useDeleteGuest()

  const handleOpenModal = (guest = null) => {
    if (guest) {
      setEditingGuest(guest)
      setFormData({
        firstName: guest.firstName,
        lastName: guest.lastName || '',
        email: guest.email || '',
        phone: guest.phone || '',
        idType: guest.idType || '',
        idNumber: guest.idNumber || '',
        address: guest.address || '',
        city: guest.city || '',
      })
    } else {
      setEditingGuest(null)
      setFormData({ firstName: '', lastName: '', email: '', phone: '', idType: '', idNumber: '', address: '', city: '' })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingGuest(null)
    setErrors({})
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.firstName) newErrors.firstName = 'First name is required'
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
      if (editingGuest) {
        await updateMutation.mutateAsync({ id: editingGuest.id, data: formData })
      } else {
        await createMutation.mutateAsync(formData)
      }
      handleCloseModal()
    } catch (error) {
      setErrors({ submit: error.response?.data?.error?.message || 'Failed to save guest' })
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this guest?')) {
      try {
        await deleteMutation.mutateAsync(id)
      } catch (error) {
        alert('Failed to delete guest')
      }
    }
  }

  if (isLoading) return <MainLayout><Loading /></MainLayout>

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Guests</h1>
            <p className="text-gray-600 mt-1">Manage your guests</p>
          </div>
          <Button variant="primary" onClick={() => handleOpenModal()}>
            <Plus size={20} className="mr-2" />
            Add Guest
          </Button>
        </div>

        <Card>
          <CardBody>
            {guests && guests.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Name</TableHeader>
                    <TableHeader>Email</TableHeader>
                    <TableHeader>Phone</TableHeader>
                    <TableHeader>City</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {guests.map((guest) => (
                    <TableRow key={guest.id}>
                      <TableCell className="font-medium">{guest.firstName} {guest.lastName}</TableCell>
                      <TableCell>{guest.email || '-'}</TableCell>
                      <TableCell>{guest.phone || '-'}</TableCell>
                      <TableCell>{guest.city || '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenModal(guest)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(guest.id)}
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
              <p className="text-gray-600 text-center py-8">No guests found</p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingGuest ? 'Edit Guest' : 'Add New Guest'}
        size="lg"
      >
        {errors.submit && (
          <Alert type="error" message={errors.submit} className="mb-4" />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              placeholder="John"
            />

            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
            />
          </div>

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
          />

          <Input
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+251911234567"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="ID Type"
              name="idType"
              value={formData.idType}
              onChange={handleChange}
              placeholder="Passport"
            />

            <Input
              label="ID Number"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              placeholder="123456789"
            />
          </div>

          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Main St"
          />

          <Input
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Addis Ababa"
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" className="flex-1" loading={createMutation.isPending || updateMutation.isPending}>
              {editingGuest ? 'Update Guest' : 'Add Guest'}
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
