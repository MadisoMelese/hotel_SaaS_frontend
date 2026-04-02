# API Integration Guide

Complete guide for integrating with the Hotel Management SaaS backend API.

## API Base URL

```javascript
// Development
VITE_API_URL=http://localhost:3000/api/v1

// Production
VITE_API_URL=https://api.yourdomain.com/api/v1
```

## Authentication

### Login
```javascript
// Service
const response = await authService.login(email, password)

// Hook
const loginMutation = useLogin()
await loginMutation.mutateAsync({ email, password })

// Request
POST /auth/login
{
  "email": "owner@hotel.com",
  "password": "SecurePass123!"
}

// Response
{
  "success": true,
  "data": {
    "user": { id, email, firstName, role },
    "hotel": { id, name, slug },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### Register
```javascript
// Service
const response = await authService.register(data)

// Hook
const registerMutation = useRegister()
await registerMutation.mutateAsync(data)

// Request
POST /auth/register
{
  "hotelName": "Grand Hotel",
  "slug": "grand-hotel",
  "email": "owner@hotel.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+251911234567"
}

// Response
{
  "success": true,
  "data": {
    "user": { ... },
    "hotel": { ... },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  },
  "message": "Hotel registered successfully. Please verify your email."
}
```

### Verify Email
```javascript
// Service
const response = await authService.verifyEmail(token)

// Hook
const verifyMutation = useVerifyEmail()
await verifyMutation.mutateAsync(token)

// Request
POST /auth/verify-email
{
  "token": "verification_token_from_email"
}

// Response
{
  "success": true,
  "data": { "message": "Email verified successfully" }
}
```

### Get Current User
```javascript
// Service
const user = await authService.getCurrentUser()

// Hook
const { user, isAuthenticated } = useAuth()

// Request
GET /auth/me
Authorization: Bearer {accessToken}

// Response
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "owner@hotel.com",
      "firstName": "John",
      "role": "OWNER"
    },
    "hotel": {
      "id": "uuid",
      "name": "Grand Hotel",
      "slug": "grand-hotel"
    }
  }
}
```

## Rooms API

### Get All Rooms
```javascript
// Service
const rooms = await roomsService.getRooms(filters)

// Hook
const { data: rooms, isLoading } = useRooms(filters)

// Request
GET /rooms?status=AVAILABLE&page=1&limit=10
Authorization: Bearer {accessToken}

// Response
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "roomNumber": "101",
      "roomTypeId": "uuid",
      "roomType": { "id", "name", "basePrice" },
      "floor": 1,
      "status": "AVAILABLE",
      "createdAt": "2026-04-02T10:00:00Z"
    }
  ]
}
```

### Create Room
```javascript
// Service
const room = await roomsService.createRoom(data)

// Hook
const createMutation = useCreateRoom()
await createMutation.mutateAsync(data)

// Request
POST /rooms
Authorization: Bearer {accessToken}
{
  "roomNumber": "101",
  "roomTypeId": "uuid",
  "floor": 1,
  "status": "AVAILABLE"
}

// Response
{
  "success": true,
  "data": {
    "id": "uuid",
    "roomNumber": "101",
    "roomTypeId": "uuid",
    "floor": 1,
    "status": "AVAILABLE"
  }
}
```

### Update Room
```javascript
// Service
const room = await roomsService.updateRoom(id, data)

// Hook
const updateMutation = useUpdateRoom()
await updateMutation.mutateAsync({ id, data })

// Request
PUT /rooms/{id}
Authorization: Bearer {accessToken}
{
  "roomNumber": "101",
  "status": "MAINTENANCE"
}

// Response
{
  "success": true,
  "data": { ... }
}
```

### Delete Room
```javascript
// Service
await roomsService.deleteRoom(id)

// Hook
const deleteMutation = useDeleteRoom()
await deleteMutation.mutateAsync(id)

// Request
DELETE /rooms/{id}
Authorization: Bearer {accessToken}

// Response
{
  "success": true,
  "message": "Room deleted successfully"
}
```

## Bookings API

### Get All Bookings
```javascript
// Service
const bookings = await bookingsService.getBookings(filters)

// Hook
const { data: bookings, isLoading } = useBookings(filters)

// Request
GET /bookings?status=PENDING&page=1&limit=10
Authorization: Bearer {accessToken}

// Response
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "bookingNumber": "BK-20260402-001",
      "roomId": "uuid",
      "room": { "id", "roomNumber" },
      "guestId": "uuid",
      "guest": { "id", "firstName", "lastName" },
      "checkIn": "2026-04-10T14:00:00Z",
      "checkOut": "2026-04-12T11:00:00Z",
      "status": "PENDING",
      "totalPrice": "5000.00",
      "createdAt": "2026-04-02T10:00:00Z"
    }
  ]
}
```

### Create Booking
```javascript
// Service
const booking = await bookingsService.createBooking(data)

// Hook
const createMutation = useCreateBooking()
await createMutation.mutateAsync(data)

// Request
POST /bookings
Authorization: Bearer {accessToken}
{
  "roomId": "uuid",
  "guestId": "uuid",
  "checkIn": "2026-04-10T14:00:00Z",
  "checkOut": "2026-04-12T11:00:00Z",
  "adults": 2,
  "children": 0,
  "specialRequests": "Late checkout if possible"
}

// Response
{
  "success": true,
  "data": {
    "id": "uuid",
    "bookingNumber": "BK-20260402-001",
    "status": "PENDING",
    "totalPrice": "5000.00"
  }
}
```

### Confirm Booking
```javascript
// Service
const booking = await bookingsService.confirmBooking(id)

// Hook
const confirmMutation = useConfirmBooking()
await confirmMutation.mutateAsync(id)

// Request
POST /bookings/{id}/confirm
Authorization: Bearer {accessToken}

// Response
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "CONFIRMED",
    "confirmedAt": "2026-04-02T10:15:00Z"
  }
}
```

### Check In
```javascript
// Service
const booking = await bookingsService.checkIn(id)

// Hook
const checkInMutation = useCheckIn()
await checkInMutation.mutateAsync(id)

// Request
POST /bookings/{id}/check-in
Authorization: Bearer {accessToken}

// Response
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "CHECKED_IN",
    "checkedInAt": "2026-04-10T14:30:00Z"
  }
}
```

### Check Out
```javascript
// Service
const booking = await bookingsService.checkOut(id)

// Hook
const checkOutMutation = useCheckOut()
await checkOutMutation.mutateAsync(id)

// Request
POST /bookings/{id}/check-out
Authorization: Bearer {accessToken}

// Response
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "CHECKED_OUT",
    "checkedOutAt": "2026-04-12T11:00:00Z"
  }
}
```

### Cancel Booking
```javascript
// Service
const booking = await bookingsService.cancelBooking(id, reason)

// Hook
const cancelMutation = useCancelBooking()
await cancelMutation.mutateAsync({ id, reason })

// Request
POST /bookings/{id}/cancel
Authorization: Bearer {accessToken}
{
  "reason": "Customer requested cancellation"
}

// Response
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "CANCELLED",
    "cancelledAt": "2026-04-02T10:30:00Z"
  }
}
```

## Guests API

### Get All Guests
```javascript
// Service
const guests = await guestsService.getGuests(filters)

// Hook
const { data: guests, isLoading } = useGuests(filters)

// Request
GET /guests?page=1&limit=10
Authorization: Bearer {accessToken}

// Response
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+251911234567",
      "idType": "Passport",
      "idNumber": "123456789",
      "address": "123 Main St",
      "city": "Addis Ababa",
      "country": "Ethiopia"
    }
  ]
}
```

### Create Guest
```javascript
// Service
const guest = await guestsService.createGuest(data)

// Hook
const createMutation = useCreateGuest()
await createMutation.mutateAsync(data)

// Request
POST /guests
Authorization: Bearer {accessToken}
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+251911234567",
  "idType": "Passport",
  "idNumber": "123456789",
  "address": "123 Main St",
  "city": "Addis Ababa"
}

// Response
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    ...
  }
}
```

### Update Guest
```javascript
// Service
const guest = await guestsService.updateGuest(id, data)

// Hook
const updateMutation = useUpdateGuest()
await updateMutation.mutateAsync({ id, data })

// Request
PUT /guests/{id}
Authorization: Bearer {accessToken}
{
  "firstName": "John",
  "email": "john.new@example.com"
}

// Response
{
  "success": true,
  "data": { ... }
}
```

### Delete Guest
```javascript
// Service
await guestsService.deleteGuest(id)

// Hook
const deleteMutation = useDeleteGuest()
await deleteMutation.mutateAsync(id)

// Request
DELETE /guests/{id}
Authorization: Bearer {accessToken}

// Response
{
  "success": true,
  "message": "Guest deleted successfully"
}
```

## Dashboard API

### Get Dashboard Stats
```javascript
// Service
const stats = await dashboardService.getStats()

// Hook
const { data: stats, isLoading } = useDashboardStats()

// Request
GET /dashboard
Authorization: Bearer {accessToken}

// Response
{
  "success": true,
  "data": {
    "totalRooms": 50,
    "occupiedRooms": 35,
    "totalBookings": 120,
    "totalRevenue": 250000,
    "recentBookings": [ ... ]
  }
}
```

## Error Handling

### Error Response Format
```javascript
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR` - Input validation failed
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Access denied
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource already exists
- `INTERNAL_ERROR` - Server error

### Error Handling in Components
```javascript
try {
  await mutation.mutateAsync(data)
} catch (error) {
  const message = error.response?.data?.error?.message
  const details = error.response?.data?.error?.details
  setErrors({ submit: message })
}
```

## Request/Response Examples

### Successful Request
```javascript
// Request
POST /bookings
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "roomId": "550e8400-e29b-41d4-a716-446655440000",
  "guestId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  "checkIn": "2026-04-10T14:00:00Z",
  "checkOut": "2026-04-12T11:00:00Z",
  "adults": 2,
  "children": 0
}

// Response (201 Created)
{
  "success": true,
  "statusCode": 201,
  "data": {
    "id": "7ce9d810-9dad-11d1-80b4-00c04fd430c8",
    "bookingNumber": "BK-20260402-001",
    "roomId": "550e8400-e29b-41d4-a716-446655440000",
    "guestId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "checkIn": "2026-04-10T14:00:00Z",
    "checkOut": "2026-04-12T11:00:00Z",
    "status": "PENDING",
    "totalPrice": "5000.00",
    "createdAt": "2026-04-02T10:00:00Z"
  },
  "message": "Booking created successfully"
}
```

### Failed Request
```javascript
// Request
POST /bookings
Authorization: Bearer invalid_token
Content-Type: application/json

{
  "roomId": "",
  "guestId": ""
}

// Response (400 Bad Request)
{
  "success": false,
  "statusCode": 400,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "roomId",
        "message": "Room ID is required"
      },
      {
        "field": "guestId",
        "message": "Guest ID is required"
      }
    ]
  }
}
```

## Rate Limiting

- **General API**: 100 requests per 15 minutes
- **Auth Endpoints**: 10 requests per 15 minutes
- **Resend Verification**: 3 requests per hour

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (development)
- `http://localhost:3000` (development)
- Production domain (configured in backend)

## Token Management

### Token Storage
```javascript
// Tokens are stored in localStorage
localStorage.setItem('accessToken', token)
localStorage.setItem('refreshToken', token)

// Tokens are automatically attached to requests
Authorization: Bearer {accessToken}
```

### Token Expiration
- Access Token: 7 days
- Refresh Token: 30 days

### Automatic Refresh
```javascript
// On 401 error, user is redirected to login
// Implement refresh logic if needed
```

## Best Practices

1. **Always use hooks** - Don't call services directly
2. **Handle errors** - Show user-friendly error messages
3. **Show loading states** - Provide feedback during requests
4. **Validate input** - Validate before sending to API
5. **Cache data** - React Query handles caching
6. **Invalidate cache** - Invalidate after mutations

---

For more information, see README.md and ARCHITECTURE.md
