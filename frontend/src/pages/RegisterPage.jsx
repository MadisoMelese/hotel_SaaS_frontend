import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useRegister } from '../hooks/useAuth'
import { Button, Input, Alert } from '../components'

export const RegisterPage = () => {
  const navigate = useNavigate()
  const registerMutation = useRegister()
  const [formData, setFormData] = useState({
    hotelName: '',
    slug: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!formData.hotelName) newErrors.hotelName = 'Hotel name is required'
    if (!formData.slug) newErrors.slug = 'Slug is required'
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
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
      await registerMutation.mutateAsync(formData)
      navigate('/login', { state: { message: 'Registration successful. Please verify your email.' } })
    } catch (error) {
      setErrors({
        submit: error.response?.data?.error?.message || 'Registration failed',
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p className="text-gray-600 mb-8">Register your hotel</p>

        {errors.submit && (
          <Alert
            type="error"
            message={errors.submit}
            onClose={() => setErrors((prev) => ({ ...prev, submit: '' }))}
            className="mb-6"
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Hotel Name"
            name="hotelName"
            value={formData.hotelName}
            onChange={handleChange}
            error={errors.hotelName}
            placeholder="Grand Hotel"
          />

          <Input
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            error={errors.slug}
            placeholder="grand-hotel"
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="owner@hotel.com"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="••••••••"
          />

          <Input
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            placeholder="John"
          />

          <Input
            label="Last Name (Optional)"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Doe"
          />

          <Input
            label="Phone (Optional)"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+251911234567"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={registerMutation.isPending}
          >
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
