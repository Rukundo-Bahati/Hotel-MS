"use client"

import Link from "next/link";
import DashboardLayout from "../components/layout/DashboardLayout"
import { useAuth } from "../context/AuthContext"
import { motion } from "framer-motion"
import { Hotel, Bed, Calendar, Users, TrendingUp, ArrowUpRight } from "lucide-react"
import ProtectedRoute from "../components/ProtectedRoute";

const AdminDashboard = () => {
  const { user } = useAuth()

  const stats = [
    {
      id: 1,
      name: "Total Hotels",
      value: "4",
      change: "+1",
      icon: <Hotel className="h-6 w-6" />,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    },
    {
      id: 2,
      name: "Total Rooms",
      value: "48",
      change: "+5",
      icon: <Bed className="h-6 w-6" />,
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
    {
      id: 3,
      name: "Active Bookings",
      value: "23",
      change: "+2",
      icon: <Calendar className="h-6 w-6" />,
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    },
    {
      id: 4,
      name: "Total Users",
      value: "156",
      change: "+12",
      icon: <Users className="h-6 w-6" />,
      color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    },
  ]

  const recentBookings = [
    {
      id: 1,
      guest: "John Doe",
      hotel: "Grand Hotel",
      roomType: "Deluxe King Room",
      checkIn: "2025-05-20",
      checkOut: "2025-05-23",
      status: "Confirmed",
    },
    {
      id: 2,
      guest: "Jane Smith",
      hotel: "Luxury Resort",
      roomType: "Executive Suite",
      checkIn: "2025-05-22",
      checkOut: "2025-05-25",
      status: "Pending",
    },
    {
      id: 3,
      guest: "Robert Johnson",
      hotel: "City Center Hotel",
      roomType: "Standard Queen Room",
      checkIn: "2025-05-25",
      checkOut: "2025-05-27",
      status: "Confirmed",
    },
  ]

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    }
  }

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, {user?.username}!</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Here's what's happening with your hotels today.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: stat.id * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.color}`}>{stat.icon}</div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600 dark:text-green-400">
                      {stat.change}
                      <ArrowUpRight className="self-center h-4 w-4" />
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Bookings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Bookings</h2>
            <Link
              href="/admin/bookings"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center"
            >
              View all
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Guest
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Hotel & Room
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Check-in
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Check-out
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {recentBookings.map((booking) => (
                    <motion.tr
                      key={booking.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {booking.guest}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{booking.hotel}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{booking.roomType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatDate(booking.checkIn)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatDate(booking.checkOut)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Revenue Overview</h2>
            <div className="flex items-center space-x-2">
              <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center">
            <TrendingUp className="h-16 w-16 text-gray-300 dark:text-gray-600" />
            <p className="ml-4 text-gray-500 dark:text-gray-400">Revenue chart will be displayed here</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/admin/hotels"
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <Hotel className="h-5 w-5 mr-2" />
              Manage Hotels
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Add, edit or remove hotels</p>
          </Link>
          <Link
            href="/admin/rooms"
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <Bed className="h-5 w-5 mr-2" />
              Manage Rooms
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Add, edit or remove rooms</p>
          </Link>
          <Link
            href="/admin/bookings"
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              All Bookings
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">View and manage all bookings</p>
          </Link>
          <Link
            href="/admin/users"
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Manage Users
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">View and manage user accounts</p>
          </Link>
        </div>
      </div>
    </DashboardLayout>
    </ProtectedRoute>
  )
}

export default AdminDashboard
