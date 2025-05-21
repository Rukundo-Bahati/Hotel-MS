import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "../../app/context/AuthContext"
import ClientDashboard from "../Dashboard"
import UserDashboard from "../user/page"
import AdminDashboard from "../admin/page"
import ProtectedRoute from "./ProtectedRoute"




// Admin pages
import AdminHotels from "../admin/hotels/page"
import AdminRooms from "../admin/rooms/page"
import AdminBookings from "../admin/bookings/page"
import AdminAllUsers from "../admin/users/page"
import Login from "../login/page";
import Register from "../register/page";
import UserRooms from "../user/rooms/page";
import UserBookRoom from "../user/book-room/page";
import UserBookings from "../user/bookings/page";

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
        <Route path="user/rooms" element={<ProtectedRoute allowedRoles={["USER", "ADMIN"]}><UserRooms /></ProtectedRoute>} />
        <Route path="user/book" element={<ProtectedRoute allowedRoles={["USER", "ADMIN"]}><UserBookRoom /></ProtectedRoute>} />
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
