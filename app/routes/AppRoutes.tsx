import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "../../app/context/AuthContext"
import ClientDashboard from "../pages/Dashboard"
import UserDashboard from "../pages/user/Dashboard"
import AdminDashboard from "../pages/admin/Dashboard"
import ProtectedRoute from "./ProtectedRoute"
import Login from "../pages/auth/Login"
import Register from "../pages/auth/Register"

import Rooms from "../pages/user/Rooms"
import BookRoom from "../pages/user/BookRoom"
import UserBookings from "../pages/user/Bookings"

// Admin pages
import AdminHotels from "../pages/admin/Hotels"
import AdminRooms from "../pages/admin/Rooms"
import AdminBookings from "../pages/admin/Bookings"
import AdminAllUsers from "../pages/admin/User"

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth()

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />

      {/* Protected */}
      <Route path="/dashboard" element={<ClientDashboard />}>
        {/* User Dashboard + Nested Pages */}
        <Route path="user" element={<ProtectedRoute allowedRoles={["USER", "ADMIN"]}><UserDashboard /></ProtectedRoute>} />
        <Route path="user/rooms" element={<ProtectedRoute allowedRoles={["USER", "ADMIN"]}><Rooms /></ProtectedRoute>} />
        <Route path="user/book" element={<ProtectedRoute allowedRoles={["USER", "ADMIN"]}><BookRoom /></ProtectedRoute>} />
        <Route path="user/bookings" element={<ProtectedRoute allowedRoles={["USER", "ADMIN"]}><UserBookings /></ProtectedRoute>} />

        {/* Admin Dashboard + Nested Pages */}
        <Route path="admin" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="admin/hotels" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminHotels /></ProtectedRoute>} />
        <Route path="admin/rooms" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminRooms /></ProtectedRoute>} />
        <Route path="admin/bookings" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminBookings /></ProtectedRoute>} />
        <Route path="admin/users" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminAllUsers /></ProtectedRoute>} />
      </Route>

      {/* Default */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<div>404 | Page Not Found</div>} />
    </Routes>
  )
}

export default AppRoutes
