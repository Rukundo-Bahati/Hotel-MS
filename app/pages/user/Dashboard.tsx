"use client"
import { Outlet } from "react-router-dom"
import DashboardLayout from "../../components/layout/DashboardLayout"
import { useAuth } from "../../context/AuthContext"
import { motion } from "framer-motion"
import { Hotel, Bed, Calendar } from "lucide-react"
import { Link } from "react-router-dom"

const UserDashboard = () => {
  const { user } = useAuth()

  const stats = [
    {
      id: 1,
      name: "Available Hotels",
      value: "12",
      icon: <Hotel className="h-6 w-6" />,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    },
    {
      id: 2,
      name: "Available Rooms",
      value: "48",
      icon: <Bed className="h-6 w-6" />,
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
    {
      id: 3,
      name: "Your Bookings",
      value: "3",
      icon: <Calendar className="h-6 w-6" />,
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    },
  ]

  const quickActions = [
    {
      name: "Browse Rooms",
      description: "View all available rooms",
      href: "/dashboard/user/rooms",
    },
    {
      name: "Book a Room",
      description: "Make a new reservation",
      href: "/dashboard/user/book",
    },
    {
      name: "View Bookings",
      description: "Check your current bookings",
      href: "/dashboard/user/bookings",
    },
  ]
  

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, {user?.username}!</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Here's what's happening with your bookings today.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
              >
                <Link
                  to={action.href}
                  className="block bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{action.name}</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-400">You have no recent activity.</p>
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </DashboardLayout>
  )
}

export default UserDashboard
