# Hotel Management SaaS - Frontend

A modern, production-ready frontend for hotel management and booking system built with React, Vite, and Tailwind CSS.

## 🚀 Features

- **Authentication**: Login/Register with JWT tokens
- **Dashboard**: Overview with key metrics (rooms, bookings, revenue)
- **Room Management**: Create, edit, delete rooms with status tracking
- **Booking Management**: Full booking lifecycle (pending → confirmed → checked-in → checked-out)
- **Guest Management**: Add and manage guest information
- **Responsive Design**: Mobile-friendly interface optimized for low bandwidth
- **Real-time Updates**: React Query for efficient data fetching and caching

## 📋 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **React Router** - Navigation
- **React Query (TanStack Query)** - Server state management
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Lucide React** - Icons
- **date-fns** - Date utilities

## 🛠️ Installation

### Prerequisites
- Node.js 16+ and npm/yarn

### Setup

1. **Clone and navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env
```

4. **Update .env with your API URL**
```
VITE_API_URL=http://localhost:3000/api/v1
```

5. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Select.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   ├── Table.jsx
│   │   ├── Alert.jsx
│   │   ├── Loading.jsx
│   │   └── index.js
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useRooms.js
│   │   ├── useBookings.js
│   │   ├── useGuests.js
│   │   └── useDashboard.js
│   ├── layouts/             # Layout components
│   │   ├── MainLayout.jsx
│   │   ├── Sidebar.jsx
│   │   └── Navbar.jsx
│   ├── pages/               # Page components
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── RoomsPage.jsx
│   │   ├── BookingsPage.jsx
│   │   ├── GuestsPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── routes/              # Routing configuration
│   │   ├── index.jsx
│   │   └── ProtectedRoute.jsx
│   ├── services/            # API services
│   │   ├── api.js
│   │   ├── auth.service.js
│   │   ├── rooms.service.js
│   │   ├── bookings.service.js
│   │   ├── guests.service.js
│   │   └── dashboard.service.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

## 🔐 Authentication Flow

1. User registers with hotel details
2. User logs in with email/password
3. JWT tokens (access + refresh) are stored in localStorage
4. Tokens are automatically attached to API requests
5. Protected routes redirect unauthenticated users to login
6. On 401 error, user is redirected to login

## 🎨 Component Usage

### Button
```jsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>
```

### Input
```jsx
<Input
  label="Email"
  type="email"
  value={email}
  onChange={handleChange}
  error={errors.email}
  placeholder="user@example.com"
/>
```

### Modal
```jsx
<Modal isOpen={isOpen} onClose={handleClose} title="Modal Title">
  <p>Modal content</p>
</Modal>
```

### Table
```jsx
<Table>
  <TableHead>
    <TableRow>
      <TableHeader>Name</TableHeader>
      <TableHeader>Email</TableHeader>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## 🪝 Custom Hooks

### useAuth
```jsx
const { user, isLoading, error, isAuthenticated } = useAuth()
const loginMutation = useLogin()
const logoutMutation = useLogout()
```

### useRooms
```jsx
const { data: rooms, isLoading } = useRooms(filters)
const createMutation = useCreateRoom()
const updateMutation = useUpdateRoom()
const deleteMutation = useDeleteRoom()
```

### useBookings
```jsx
const { data: bookings, isLoading } = useBookings(filters)
const createMutation = useCreateBooking()
const confirmMutation = useConfirmBooking()
const checkInMutation = useCheckIn()
const checkOutMutation = useCheckOut()
const cancelMutation = useCancelBooking()
```

## 🔄 API Integration

All API calls are centralized in the `services/` directory. The `api.js` file handles:
- Base URL configuration
- Request interceptors (token attachment)
- Response interceptors (error handling)
- Automatic logout on 401

## 📊 State Management

- **Server State**: React Query (data fetching, caching, mutations)
- **UI State**: React hooks (useState)
- **Auth State**: localStorage + React Query

## 🎯 Performance Optimizations

- Lazy loading with React Router
- Query caching with React Query
- Optimistic updates for mutations
- Debounced search/filters
- Image optimization
- Code splitting

## 🌐 Responsive Design

- Mobile-first approach
- Tailwind CSS breakpoints
- Responsive sidebar (collapsible on mobile)
- Touch-friendly buttons and inputs
- Optimized for low bandwidth

## 🚀 Build & Deployment

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

## 🐛 Troubleshooting

### API Connection Issues
- Ensure backend is running on `http://localhost:3000`
- Check `VITE_API_URL` in `.env`
- Check browser console for CORS errors

### Authentication Issues
- Clear localStorage and try again
- Check if tokens are being stored correctly
- Verify backend JWT_SECRET matches

### Build Issues
- Delete `node_modules` and `dist` folders
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

## 📝 Environment Variables

```
VITE_API_URL=http://localhost:3000/api/v1
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

MIT

## 📞 Support

For issues or questions, please contact the development team.

---

**Built with ❤️ for hotel management**
