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

        {/* Admin Dashboard */}
        <Route path="admin" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
      </Route>

      {/* Default */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<div>404 | Page Not Found</div>} />
    </Routes>
  )
}

export default AppRoutes
