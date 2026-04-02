# Quick Start Guide

Get the Hotel Management SaaS frontend up and running in 5 minutes.

## Prerequisites

- Node.js 16+ installed
- Backend API running on `http://localhost:3000`

## Installation (2 minutes)

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## First Steps

### 1. Register a Hotel
- Go to `http://localhost:5173/register`
- Fill in hotel details
- Create account

### 2. Verify Email
- Check your email for verification link
- Click the link to verify

### 3. Login
- Go to `http://localhost:5173/login`
- Enter credentials
- You'll be redirected to dashboard

### 4. Explore Features

**Dashboard**
- View key metrics
- See room occupancy
- Check revenue

**Rooms**
- Add new rooms
- Edit room details
- Change room status

**Bookings**
- Create bookings
- Confirm bookings
- Check in/out guests
- Cancel bookings

**Guests**
- Add guest information
- Edit guest details
- View guest history

## Project Structure

```
frontend/
├── src/
│   ├── components/      # UI components
│   ├── hooks/          # Custom hooks
│   ├── layouts/        # Page layouts
│   ├── pages/          # Page components
│   ├── routes/         # Routing
│   ├── services/       # API services
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── README.md
```

## Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Key Files to Know

### `src/services/api.js`
- Axios configuration
- Request/response interceptors
- Token management

### `src/hooks/useAuth.js`
- Authentication hooks
- Login, logout, register

### `src/routes/index.jsx`
- Route definitions
- Protected routes

### `src/pages/`
- Page components
- Main features

## API Integration

All API calls go through the centralized API service:

```javascript
// Example: Get rooms
const { data: rooms } = useRooms()

// Example: Create booking
const createMutation = useCreateBooking()
await createMutation.mutateAsync(bookingData)
```

## Form Handling

Forms use controlled inputs with validation:

```jsx
const [formData, setFormData] = useState({})
const [errors, setErrors] = useState({})

const handleChange = (e) => {
  const { name, value } = e.target
  setFormData(prev => ({ ...prev, [name]: value }))
}

const handleSubmit = async (e) => {
  e.preventDefault()
  if (!validateForm()) return
  // Submit form
}
```

## State Management

- **Server State**: React Query (data fetching)
- **UI State**: useState (forms, modals)
- **Auth State**: localStorage (tokens)

## Styling

All styling uses Tailwind CSS v4:

```jsx
<div className="bg-blue-600 text-white p-4 rounded-lg">
  Styled with Tailwind
</div>
```

## Responsive Design

Mobile-first approach with Tailwind breakpoints:

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  {/* Responsive grid */}
</div>
```

## Debugging

### Browser DevTools
- React DevTools extension
- Network tab for API calls
- Console for errors

### React Query DevTools
```bash
npm install @tanstack/react-query-devtools
```

```jsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

## Environment Variables

Create `.env` file:

```
VITE_API_URL=http://localhost:3000/api/v1
```

## Troubleshooting

### Port 5173 already in use
```bash
npm run dev -- --port 5174
```

### API connection failed
- Check backend is running
- Verify `VITE_API_URL` in `.env`
- Check CORS configuration

### Build fails
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

## Next Steps

1. **Customize Styling**: Edit `tailwind.config.js`
2. **Add Features**: Create new pages and components
3. **Deploy**: Build and deploy to production
4. **Testing**: Add unit and integration tests

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Query](https://tanstack.com/query)
- [React Router](https://reactrouter.com)

## Support

For issues or questions:
1. Check the README.md
2. Review ARCHITECTURE.md
3. Check browser console for errors
4. Verify backend API is running

---

**Happy coding! 🚀**
