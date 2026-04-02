# Frontend Architecture Guide

## Overview

This document describes the architecture and design patterns used in the Hotel Management SaaS frontend.

## Architecture Principles

1. **Component-Based**: Reusable, composable UI components
2. **Separation of Concerns**: Business logic separated from UI
3. **DRY (Don't Repeat Yourself)**: Shared utilities and hooks
4. **Performance**: Optimized rendering and data fetching
5. **Maintainability**: Clear structure and naming conventions
6. **Scalability**: Easy to add new features

## Directory Structure

### `/components`
Reusable UI components with no business logic.

**Examples:**
- `Button.jsx` - Styled button with variants
- `Input.jsx` - Form input with validation display
- `Modal.jsx` - Reusable modal dialog
- `Table.jsx` - Reusable table components

**Guidelines:**
- One component per file
- Props-based configuration
- No API calls
- No routing
- Fully reusable

### `/hooks`
Custom React hooks for data fetching and state management.

**Examples:**
- `useAuth.js` - Authentication queries and mutations
- `useRooms.js` - Room CRUD operations
- `useBookings.js` - Booking management
- `useGuests.js` - Guest management

**Guidelines:**
- Use React Query for server state
- Use useState for UI state
- Encapsulate complex logic
- Reusable across components

### `/layouts`
Layout wrapper components for page structure.

**Examples:**
- `MainLayout.jsx` - Dashboard layout with sidebar
- `Sidebar.jsx` - Navigation sidebar
- `Navbar.jsx` - Top navigation bar

**Guidelines:**
- Provide consistent structure
- Handle responsive behavior
- Include navigation

### `/pages`
Full page components that combine layouts, components, and hooks.

**Examples:**
- `DashboardPage.jsx` - Dashboard overview
- `RoomsPage.jsx` - Room management
- `BookingsPage.jsx` - Booking management
- `LoginPage.jsx` - Authentication

**Guidelines:**
- One page per route
- Combine multiple components
- Handle page-level state
- Manage forms and modals

### `/routes`
Routing configuration and protected route logic.

**Files:**
- `index.jsx` - Route definitions
- `ProtectedRoute.jsx` - Authentication guard

**Guidelines:**
- Centralized route configuration
- Protected routes for authenticated pages
- Redirect logic

### `/services`
API service layer for backend communication.

**Files:**
- `api.js` - Axios instance with interceptors
- `auth.service.js` - Authentication endpoints
- `rooms.service.js` - Room endpoints
- `bookings.service.js` - Booking endpoints
- `guests.service.js` - Guest endpoints
- `dashboard.service.js` - Dashboard endpoints

**Guidelines:**
- Centralized API configuration
- Consistent error handling
- Token management
- Request/response transformation

## Data Flow

### Authentication Flow
```
LoginPage
  ↓
useLogin hook
  ↓
authService.login()
  ↓
api.post('/auth/login')
  ↓
Store tokens in localStorage
  ↓
Redirect to dashboard
```

### Data Fetching Flow
```
Page Component
  ↓
useQuery hook (e.g., useRooms)
  ↓
Service function (e.g., roomsService.getRooms)
  ↓
api.get('/rooms')
  ↓
Response interceptor
  ↓
React Query caching
  ↓
Component re-render
```

### Mutation Flow
```
Form Submit
  ↓
useMutation hook (e.g., useCreateRoom)
  ↓
Service function (e.g., roomsService.createRoom)
  ↓
api.post('/rooms', data)
  ↓
Invalidate related queries
  ↓
Refetch data
  ↓
Component re-render
```

## State Management Strategy

### Server State (React Query)
- Data from backend API
- Automatic caching
- Automatic refetching
- Optimistic updates

**Example:**
```jsx
const { data: rooms, isLoading } = useRooms()
const createMutation = useCreateRoom()
```

### UI State (useState)
- Form inputs
- Modal visibility
- Loading states
- Error messages

**Example:**
```jsx
const [isModalOpen, setIsModalOpen] = useState(false)
const [formData, setFormData] = useState({})
const [errors, setErrors] = useState({})
```

### Auth State (localStorage + React Query)
- JWT tokens
- User information
- Authentication status

**Example:**
```jsx
const { user, isAuthenticated } = useAuth()
```

## Component Patterns

### Controlled Input Pattern
```jsx
const [value, setValue] = useState('')

<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

### Form Validation Pattern
```jsx
const [errors, setErrors] = useState({})

const validateForm = () => {
  const newErrors = {}
  if (!formData.name) newErrors.name = 'Required'
  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}
```

### Modal Pattern
```jsx
const [isOpen, setIsOpen] = useState(false)

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  {/* Modal content */}
</Modal>
```

### List with CRUD Pattern
```jsx
const { data: items } = useItems()
const createMutation = useCreateItem()
const updateMutation = useUpdateItem()
const deleteMutation = useDeleteItem()

// Handle create, update, delete
```

## API Integration

### Request Interceptor
Automatically attaches JWT token to all requests:
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### Response Interceptor
Handles errors and redirects on 401:
```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

## Performance Optimizations

### React Query Configuration
```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,      // 5 minutes
      gcTime: 1000 * 60 * 10,        // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
```

### Memoization
```jsx
const MemoizedComponent = React.memo(Component)
```

### Code Splitting
```jsx
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
```

## Error Handling

### API Errors
```jsx
try {
  await mutation.mutateAsync(data)
} catch (error) {
  const message = error.response?.data?.error?.message
  setErrors({ submit: message })
}
```

### Form Validation
```jsx
const validateForm = () => {
  const newErrors = {}
  // Validation logic
  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}
```

### User Feedback
```jsx
<Alert type="error" message={error} />
<Loading message="Loading..." />
```

## Responsive Design

### Tailwind Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

### Mobile-First Approach
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Responsive grid */}
</div>
```

## Best Practices

### Component Design
1. Keep components small and focused
2. Use props for configuration
3. Avoid prop drilling (use context if needed)
4. Memoize expensive components

### Hook Usage
1. Use custom hooks for reusable logic
2. Keep hooks focused on single responsibility
3. Use React Query for server state
4. Use useState for UI state

### API Integration
1. Centralize API calls in services
2. Use consistent error handling
3. Implement request/response interceptors
4. Handle loading and error states

### Performance
1. Use React Query for caching
2. Implement pagination for large lists
3. Lazy load routes
4. Optimize images
5. Minimize bundle size

### Code Organization
1. One component per file
2. Clear naming conventions
3. Consistent file structure
4. Meaningful comments

## Testing Strategy

### Unit Tests
- Test individual components
- Test custom hooks
- Test utility functions

### Integration Tests
- Test page flows
- Test API integration
- Test form submissions

### E2E Tests
- Test complete user journeys
- Test authentication flow
- Test CRUD operations

## Deployment

### Build Process
```bash
npm run build
```

### Environment Configuration
- Development: `http://localhost:3000`
- Production: `https://api.yourdomain.com`

### Deployment Platforms
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## Future Enhancements

1. **Offline Support**: Service workers for offline functionality
2. **Real-time Updates**: WebSocket integration
3. **Advanced Filtering**: Complex search and filter UI
4. **Analytics**: User behavior tracking
5. **Internationalization**: Multi-language support
6. **Dark Mode**: Theme switching
7. **PWA**: Progressive web app features
8. **Testing**: Comprehensive test coverage

## Troubleshooting

### Common Issues

**Issue**: Components not re-rendering
- Check if state is being updated correctly
- Verify React Query cache invalidation
- Check for missing dependencies in useEffect

**Issue**: API calls failing
- Check network tab in DevTools
- Verify API URL in .env
- Check token in localStorage
- Verify CORS configuration

**Issue**: Performance issues
- Check React DevTools Profiler
- Verify React Query cache settings
- Look for unnecessary re-renders
- Check bundle size

---

For more information, see the main README.md
