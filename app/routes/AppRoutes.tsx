"use client"

import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "../../app/context/AuthContext"
import { AnimatePresence } from "framer-motion"

// Auth Pages
import Login from "../login/page"
import Register from "../../app/pages/auth/Register"

// User Pages
import UserDashboard from "../../app/pages/user/Dashboard"
import UserRooms from "../../app/pages/user/Rooms"
import UserBookRoom from "../../app/pages/user/BookRoom"
import UserBookings from "../../app/pages/user/Bookings"

// Admin Pages
import AdminDashboard from "../../app/pages/admin/Dashboard"
import AdminHotels from "../../app/pages/admin/Hotels"
import AdminRooms from "../../app/pages/admin/Rooms"
import AdminBookings from "../../app/pages/admin/Bookings"
import AdminUsers from "../../app/pages/admin/User"

// Protected Route Components
const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element; allowedRoles: string[] }) => {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === "ADMIN" ? "/admin" : "/user"} replace />
  }

  return children
}

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth()

  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to={user?.role === "ADMIN" ? "/admin" : "/user"} replace /> : <Login />}
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to={user?.role === "ADMIN" ? "/admin" : "/user"} replace /> : <Register />
          }
        />

        {/* User Routes */}
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/rooms"
          element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
              <UserRooms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/book"
          element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
              <UserBookRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/bookings"
          element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
              <UserBookings />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/hotels"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminHotels />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rooms"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminRooms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        {/* Default Routes */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              // <Navigate to={user?.role === "ADMIN" ? "/admin" : "/user"} replace />
              <Navigate to={user?.email === "admin@example.com" ? "/admin" : "/user"} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch all - 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default AppRoutes
