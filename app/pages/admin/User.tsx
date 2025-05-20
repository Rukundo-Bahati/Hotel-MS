"use client"

import { useState } from "react"
import DashboardLayout from "../../components/layout/DashboardLayout"
import { motion } from "framer-motion"
import { Plus, Edit, Trash, X, Search, Filter, ChevronDown, Eye } from "lucide-react"
import { useToast } from "../../../src/hooks/use-toast"
import type React from "react"

// Mock users data
const usersData = [
  {
    id: 1,
    username: "johndoe",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "USER",
    status: "Active",
    registrationDate: "2025-01-15",
    lastLogin: "2025-05-10",
    bookingsCount: 3,
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    username: "janesmith",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "USER",
    status: "Active",
    registrationDate: "2025-02-20",
    lastLogin: "2025-05-12",
    bookingsCount: 2,
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    username: "robertj",
    name: "Robert Johnson",
    email: "robert.j@example.com",
    role: "USER",
    status: "Inactive",
    registrationDate: "2025-03-05",
    lastLogin: "2025-04-01",
    bookingsCount: 1,
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 4,
    username: "emilyd",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "USER",
    status: "Active",
    registrationDate: "2025-03-15",
    lastLogin: "2025-05-11",
    bookingsCount: 1,
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 5,
    username: "michaelw",
    name: "Michael Wilson",
    email: "michael.w@example.com",
    role: "USER",
    status: "Active",
    registrationDate: "2025-04-10",
    lastLogin: "2025-05-09",
    bookingsCount: 1,
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 6,
    username: "sarahb",
    name: "Sarah Brown",
    email: "sarah.b@example.com",
    role: "USER",
    status: "Active",
    registrationDate: "2025-04-25",
    lastLogin: "2025-05-08",
    bookingsCount: 1,
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 7,
    username: "adminuser",
    name: "Admin User",
    email: "admin@example.com",
    role: "ADMIN",
    status: "Active",
    registrationDate: "2025-01-01",
    lastLogin: "2025-05-15",
    bookingsCount: 0,
    avatar: "/placeholder.svg?height=100&width=100",
  },
]

interface User {
  id: number
  username: string
  name: string
  email: string
  role: "USER" | "ADMIN"
  status: "Active" | "Inactive"
  registrationDate: string
  lastLogin: string
  bookingsCount: number
  avatar: string
}

// Get unique values for filters
const getUniqueValues = (data, key) => {
  return [...new Set(data.map((item) => item[key]))]
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>(usersData)
  const [selectedUser, setSelectedUser] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    role: [],
    status: [],
    registrationDateRange: {
      start: "",
      end: "",
    },
    bookingsCountRange: [0, 10],
  })
  const [sortOption, setSortOption] = useState("registrationDate")
  const [sortDirection, setSortDirection] = useState("desc")
  const [formData, setFormData] = useState<Partial<User>>({
    username: "",
    name: "",
    email: "",
    role: "USER",
    status: "Active",
    avatar: "/placeholder.svg?height=100&width=100",
  })
  const { toast } = useToast()

  // Get unique values for filters
  const roleOptions = getUniqueValues(users, "role")
  const statusOptions = getUniqueValues(users, "status")

  // Filter users based on all criteria
  const filteredUsers = users.filter((user) => {
    // Search term filter
    const matchesSearch =
      searchTerm === "" ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    // Role filter
    const matchesRole = filters.role.length === 0 || filters.role.includes(user.role)

    // Status filter
    const matchesStatus = filters.status.length === 0 || filters.status.includes(user.status)

    // Registration date range filter
    const matchesRegistrationDate =
      (filters.registrationDateRange.start === "" ||
        new Date(user.registrationDate) >= new Date(filters.registrationDateRange.start)) &&
      (filters.registrationDateRange.end === "" ||
        new Date(user.registrationDate) <= new Date(filters.registrationDateRange.end))

    // Bookings count range filter
    const matchesBookingsCount =
      user.bookingsCount >= filters.bookingsCountRange[0] && user.bookingsCount <= filters.bookingsCountRange[1]

    return matchesSearch && matchesRole && matchesStatus && matchesRegistrationDate && matchesBookingsCount
  })

  // Sort the filtered users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let comparison = 0

    switch (sortOption) {
      case "username":
        comparison = a.username.localeCompare(b.username)
        break
      case "name":
        comparison = a.name.localeCompare(b.name)
        break
      case "email":
        comparison = a.email.localeCompare(b.email)
        break
      case "role":
        comparison = a.role.localeCompare(b.role)
        break
      case "status":
        comparison = a.status.localeCompare(b.status)
        break
      case "bookingsCount":
        comparison = a.bookingsCount - b.bookingsCount
        break
      case "lastLogin":
        comparison = new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime()
        break
      case "registrationDate":
      default:
        comparison = new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime()
        break
    }

    return sortDirection === "asc" ? comparison : -comparison
  })

  const handleAddUser = () => {
    setSelectedUser(null)
    setFormData({
      username: "",
      name: "",
      email: "",
      role: "USER",
      status: "Active",
      avatar: "/placeholder.svg?height=100&width=100",
    })
    setIsModalOpen(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user.id)
    setFormData({
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
    })
    setIsModalOpen(true)
  }

  const handleViewUser = (user: User) => {
    setSelectedUser(user.id)
    setIsViewModalOpen(true)
  }

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user.id)
    setIsDeleteModalOpen(true)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedUser) {
      // Update existing user
      setUsers(users.map((user) => (user.id === selectedUser ? { ...user, ...formData } : user)))
      toast({
        title: "User updated successfully!",
      })
    } else {
      // Add new user
      const newUser: User = {
        id: users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1,
        ...formData,
        registrationDate: new Date().toISOString().split("T")[0],
        lastLogin: new Date().toISOString().split("T")[0],
        bookingsCount: 0,
      } as User
      setUsers([...users, newUser])
      toast({
        title: "User added successfully!",
      })
    }

    setIsModalOpen(false)
    setSelectedUser(null)
    setFormData({
      username: "",
      name: "",
      email: "",
      role: "USER",
      status: "Active",
      avatar: "/placeholder.svg?height=100&width=100",
    })
  }

  const confirmDeleteUser = () => {
    if (selectedUser) {
      setUsers(users.filter((user) => user.id !== selectedUser))
      toast({
        title: "User deleted successfully!",
      })
      setIsDeleteModalOpen(false)
      setSelectedUser(null)
    }
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ duration: 0.2 }}
        className="container"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Users</h1>
          <button
            onClick={handleAddUser}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </button>
        </div>

        <div className="grid gap-4 mt-4">
          <div className="flex items-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="search"
                placeholder="Search users..."
                className="w-full rounded-md border border-gray-200 bg-white pl-10 pr-3 py-2 text-sm shadow-sm focus:outline-none focus:border-primary focus:ring-primary focus:ring-opacity-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="ml-2 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="bg-gray-50 rounded-md p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role:</label>
                  <select
                    multiple
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:border-primary focus:ring-primary focus:ring-opacity-50"
                    value={filters.role}
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value)
                      setFilters({ ...filters, role: selectedOptions })
                    }}
                  >
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status:</label>
                  <select
                    multiple
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:border-primary focus:ring-primary focus:ring-opacity-50"
                    value={filters.status}
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value)
                      setFilters({ ...filters, status: selectedOptions })
                    }}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Registration Date Range:</label>
                  <div className="flex items-center">
                    <input
                      type="date"
                      className="w-1/2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:border-primary focus:ring-primary focus:ring-opacity-50"
                      value={filters.registrationDateRange.start}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          registrationDateRange: { ...filters.registrationDateRange, start: e.target.value },
                        })
                      }
                    />
                    <span className="mx-2">to</span>
                    <input
                      type="date"
                      className="w-1/2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:border-primary focus:ring-primary focus:ring-opacity-50"
                      value={filters.registrationDateRange.end}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          registrationDateRange: { ...filters.registrationDateRange, end: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Bookings Count Range:</label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      className="w-1/2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:border-primary focus:ring-primary focus:ring-opacity-50"
                      value={filters.bookingsCountRange[0]}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          bookingsCountRange: [Number.parseInt(e.target.value), filters.bookingsCountRange[1]],
                        })
                      }
                    />
                    <span className="mx-2">to</span>
                    <input
                      type="number"
                      className="w-1/2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:border-primary focus:ring-primary focus:ring-opacity-50"
                      value={filters.bookingsCountRange[1]}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          bookingsCountRange: [filters.bookingsCountRange[0], Number.parseInt(e.target.value)],
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => {
                        setSortOption("username")
                        setSortDirection(sortOption === "username" && sortDirection === "asc" ? "desc" : "asc")
                      }}
                      className="flex items-center"
                    >
                      Username
                      {sortOption === "username" && (
                        <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "" : "rotate-180"}`} />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => {
                        setSortOption("name")
                        setSortDirection(sortOption === "name" && sortDirection === "asc" ? "desc" : "asc")
                      }}
                      className="flex items-center"
                    >
                      Name
                      {sortOption === "name" && (
                        <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "" : "rotate-180"}`} />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => {
                        setSortOption("email")
                        setSortDirection(sortOption === "email" && sortDirection === "asc" ? "desc" : "asc")
                      }}
                      className="flex items-center"
                    >
                      Email
                      {sortOption === "email" && (
                        <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "" : "rotate-180"}`} />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => {
                        setSortOption("role")
                        setSortDirection(sortOption === "role" && sortDirection === "asc" ? "desc" : "asc")
                      }}
                      className="flex items-center"
                    >
                      Role
                      {sortOption === "role" && (
                        <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "" : "rotate-180"}`} />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => {
                        setSortOption("status")
                        setSortDirection(sortOption === "status" && sortDirection === "asc" ? "desc" : "asc")
                      }}
                      className="flex items-center"
                    >
                      Status
                      {sortOption === "status" && (
                        <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "" : "rotate-180"}`} />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => {
                        setSortOption("registrationDate")
                        setSortDirection(sortOption === "registrationDate" && sortDirection === "asc" ? "desc" : "asc")
                      }}
                      className="flex items-center"
                    >
                      Registration Date
                      {sortOption === "registrationDate" && (
                        <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "" : "rotate-180"}`} />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => {
                        setSortOption("lastLogin")
                        setSortDirection(sortOption === "lastLogin" && sortDirection === "asc" ? "desc" : "asc")
                      }}
                      className="flex items-center"
                    >
                      Last Login
                      {sortOption === "lastLogin" && (
                        <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "" : "rotate-180"}`} />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => {
                        setSortOption("bookingsCount")
                        setSortDirection(sortOption === "bookingsCount" && sortDirection === "asc" ? "desc" : "asc")
                      }}
                      className="flex items-center"
                    >
                      Bookings Count
                      {sortOption === "bookingsCount" && (
                        <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "" : "rotate-180"}`} />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 bg-gray-50"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.registrationDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastLogin}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.bookingsCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDeleteUser(user)} className="text-red-600 hover:text-red-900">
                        <Trash className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Modal */}
        {isModalOpen && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                &#8203;
              </span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <form onSubmit={handleSubmit}>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          {selectedUser ? "Edit User" : "Add User"}
                        </h3>
                        <div className="mt-2">
                          <div className="mb-4">
                            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                              Username:
                            </label>
                            <input
                              type="text"
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              id="username"
                              name="username"
                              value={formData.username || ""}
                              onChange={handleFormChange}
                              required
                            />
                          </div>
                          <div className="mb-4">
                            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                              Name:
                            </label>
                            <input
                              type="text"
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              id="name"
                              name="name"
                              value={formData.name || ""}
                              onChange={handleFormChange}
                              required
                            />
                          </div>
                          <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                              Email:
                            </label>
                            <input
                              type="email"
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              id="email"
                              name="email"
                              value={formData.email || ""}
                              onChange={handleFormChange}
                              required
                            />
                          </div>
                          <div className="mb-4">
                            <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
                              Role:
                            </label>
                            <select
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              id="role"
                              name="role"
                              value={formData.role || "USER"}
                              onChange={handleFormChange}
                            >
                              <option value="USER">User</option>
                              <option value="ADMIN">Admin</option>
                            </select>
                          </div>
                          <div className="mb-4">
                            <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">
                              Status:
                            </label>
                            <select
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              id="status"
                              name="status"
                              value={formData.status || "Active"}
                              onChange={handleFormChange}
                            >
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      {selectedUser ? "Update" : "Save"}
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                &#8203;
              </span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <X className="h-6 w-6 text-red-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Delete User</h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete this user? This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={confirmDeleteUser}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View User Modal */}
        {isViewModalOpen && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                &#8203;
              </span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">User Details</h3>
                      <div className="mt-2">
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
                          <p className="text-gray-500">{users.find((user) => user.id === selectedUser)?.username}</p>
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                          <p className="text-gray-500">{users.find((user) => user.id === selectedUser)?.name}</p>
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                          <p className="text-gray-500">{users.find((user) => user.id === selectedUser)?.email}</p>
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2">Role:</label>
                          <p className="text-gray-500">{users.find((user) => user.id === selectedUser)?.role}</p>
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2">Status:</label>
                          <p className="text-gray-500">{users.find((user) => user.id === selectedUser)?.status}</p>
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2">Registration Date:</label>
                          <p className="text-gray-500">
                            {users.find((user) => user.id === selectedUser)?.registrationDate}
                          </p>
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2">Last Login:</label>
                          <p className="text-gray-500">{users.find((user) => user.id === selectedUser)?.lastLogin}</p>
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2">Bookings Count:</label>
                          <p className="text-gray-500">
                            {users.find((user) => user.id === selectedUser)?.bookingsCount}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setIsViewModalOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  )
}

export default AdminUsers
