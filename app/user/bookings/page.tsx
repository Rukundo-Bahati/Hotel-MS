"use client"

import { useState } from "react"
import DashboardLayout from "@/app/components/layout/DashboardLayout"
import { motion } from "framer-motion"
import { Calendar, Clock, X, Eye, AlertCircle, Search, Filter, SlidersHorizontal, ChevronDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Booking {
  id: number
  hotel: string
  roomType: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  status: "Confirmed" | "Pending" | "Cancelled"
  bookingDate: string
  cancellationDate?: string
}

interface Filters {
  status: string[]
  dateRange: {
    start: string
    end: string
  }
  priceRange: [number, number]
}

const bookingsData: Booking[] = [
  {
    id: 1,
    hotel: "Grand Hotel",
    roomType: "Deluxe King Room",
    checkIn: "2025-05-20",
    checkOut: "2025-05-23",
    guests: 2,
    totalPrice: 597,
    status: "Confirmed",
    bookingDate: "2025-05-01",
  },
  {
    id: 2,
    hotel: "Luxury Resort",
    roomType: "Executive Suite",
    checkIn: "2025-06-15",
    checkOut: "2025-06-20",
    guests: 2,
    totalPrice: 1495,
    status: "Confirmed",
    bookingDate: "2025-05-10",
  },
  {
    id: 3,
    hotel: "City Center Hotel",
    roomType: "Standard Queen Room",
    checkIn: "2025-07-05",
    checkOut: "2025-07-07",
    guests: 1,
    totalPrice: 258,
    status: "Pending",
    bookingDate: "2025-05-15",
  },
  {
    id: 4,
    hotel: "Skyline Hotel",
    roomType: "Penthouse Suite",
    checkIn: "2025-08-10",
    checkOut: "2025-08-15",
    guests: 2,
    totalPrice: 2495,
    status: "Confirmed",
    bookingDate: "2025-05-20",
  },
  {
    id: 5,
    hotel: "Grand Hotel",
    roomType: "Twin Room",
    checkIn: "2025-09-01",
    checkOut: "2025-09-03",
    guests: 2,
    totalPrice: 298,
    status: "Cancelled",
    bookingDate: "2025-05-25",
    cancellationDate: "2025-05-30",
  },
  {
    id: 6,
    hotel: "City Center Hotel",
    roomType: "Budget Single Room",
    checkIn: "2025-10-10",
    checkOut: "2025-10-12",
    guests: 1,
    totalPrice: 178,
    status: "Pending",
    bookingDate: "2025-06-01",
  },
]

const UserBookings = () => {
  const [selectedBooking, setSelectedBooking] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>(bookingsData)
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    status: [],
    dateRange: {
      start: "",
      end: "",
    },
    priceRange: [0, 3000],
  })
  const [sortOption, setSortOption] = useState<keyof Booking>("bookingDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const { toast } = useToast()

  // Get unique values for filters
  const statusOptions = [...new Set(bookings.map((booking) => booking.status))]

  // Filter bookings based on all criteria
  const filteredBookings = bookings.filter((booking) => {
    // Search term filter
    const matchesSearch =
      searchTerm === "" ||
      booking.hotel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.roomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.status.toLowerCase().includes(searchTerm.toLowerCase())

    // Status filter
    const matchesStatus = filters.status.length === 0 || filters.status.includes(booking.status)

    // Date range filter
    const matchesDateRange =
      (filters.dateRange.start === "" || new Date(booking.checkIn) >= new Date(filters.dateRange.start)) &&
      (filters.dateRange.end === "" || new Date(booking.checkOut) <= new Date(filters.dateRange.end))

    // Price range filter
    const matchesPrice = booking.totalPrice >= filters.priceRange[0] && booking.totalPrice <= filters.priceRange[1]

    return matchesSearch && matchesStatus && matchesDateRange && matchesPrice
  })

  // Sort the filtered bookings
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    let comparison = 0

    switch (sortOption) {
      case "checkIn":
        comparison = new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime()
        break
      case "checkOut":
        comparison = new Date(a.checkOut).getTime() - new Date(b.checkOut).getTime()
        break
      case "totalPrice":
        comparison = a.totalPrice - b.totalPrice
        break
      case "bookingDate":
      default:
        comparison = new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime()
        break
    }

    return sortDirection === "asc" ? comparison : -comparison
  })

  const handleViewBooking = (bookingId: number) => {
    setSelectedBooking(bookingId)
    setIsModalOpen(true)
  }

  const handleCancelBooking = (bookingId: number) => {
    setBookings(
      bookings.map((booking) =>
        booking.id === bookingId
          ? { 
              ...booking, 
              status: "Cancelled", 
              cancellationDate: new Date().toISOString().split("T")[0] 
            }
          : booking
      )
    )
    setIsModalOpen(false)

    toast({
      title: "Booking cancelled",
      description: "Your booking has been cancelled successfully.",
    })
  }

  const getBookingById = (id: number) => {
    return bookings.find((booking) => booking.id === id)
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
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

  // Handle filter changes
  const handleFilterChange = (filterType: keyof Filters, value: any) => {
    setFilters((prev) => {
      const newFilters = { ...prev }

      if (filterType === "status") {
        if (Array.isArray(value)) {
          newFilters.status = value
        } else {
          if (newFilters.status.includes(value)) {
            newFilters.status = newFilters.status.filter((item) => item !== value)
          } else {
            newFilters.status = [...newFilters.status, value]
          }
        }
      } else if (filterType === "dateRange") {
        newFilters.dateRange = { ...newFilters.dateRange, ...value }
      } else if (filterType === "priceRange") {
        newFilters.priceRange = value
      }

      return newFilters
    })
  }

  // Handle sort changes
  const handleSortChange = (option: keyof Booking) => {
    if (sortOption === option) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortOption(option)
      setSortDirection(option === "bookingDate" || option === "checkIn" || option === "checkOut" ? "desc" : "asc")
    }
  }

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      status: [],
      dateRange: {
        start: "",
        end: "",
      },
      priceRange: [0, 3000],
    })
    setSearchTerm("")
    setSortOption("bookingDate")
    setSortDirection("desc")
  }

  // Count active filters
  const countActiveFilters = () => {
    let count = 0
    if (filters.status.length > 0) count++
    if (filters.dateRange.start || filters.dateRange.end) count++
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 3000) count++
    return count
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Bookings</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">View and manage your bookings</p>
        </div>

        {/* Search and filters bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search bookings by hotel, room type, or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Filter toggle button (mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
              {countActiveFilters() > 0 && (
                <span className="ml-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {countActiveFilters()}
                </span>
              )}
            </button>

            {/* Sort dropdown */}
            <div className="relative w-full md:w-48">
              <div className="flex">
                <button
                  type="button"
                  className="flex items-center justify-between w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                  onClick={() => {
                    const dropdown = document.getElementById("sort-dropdown")
                    if (dropdown) dropdown.classList.toggle("hidden")
                  }}
                >
                  <span className="flex items-center">
                    <SlidersHorizontal className="h-5 w-5 mr-2" />
                    <span>
                      Sort:{" "}
                      {sortOption === "bookingDate"
                        ? "Booking Date"
                        : sortOption === "checkIn"
                          ? "Check-in Date"
                          : sortOption === "checkOut"
                            ? "Check-out Date"
                            : "Price"}{" "}
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  </span>
                  <ChevronDown className="h-5 w-5 ml-2" />
                </button>
              </div>
              <div
                id="sort-dropdown"
                className="hidden absolute right-0 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-10"
              >
                <ul className="py-1">
                  <li>
                    <button
                      className={`flex items-center justify-between w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        sortOption === "bookingDate" ? "bg-gray-100 dark:bg-gray-700" : ""
                      }`}
                      onClick={() => handleSortChange("bookingDate")}
                    >
                      Booking Date
                      {sortOption === "bookingDate" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                    </button>
                  </li>
                  <li>
                    <button
                      className={`flex items-center justify-between w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        sortOption === "checkIn" ? "bg-gray-100 dark:bg-gray-700" : ""
                      }`}
                      onClick={() => handleSortChange("checkIn")}
                    >
                      Check-in Date
                      {sortOption === "checkIn" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                    </button>
                  </li>
                  <li>
                    <button
                      className={`flex items-center justify-between w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        sortOption === "checkOut" ? "bg-gray-100 dark:bg-gray-700" : ""
                      }`}
                      onClick={() => handleSortChange("checkOut")}
                    >
                      Check-out Date
                      {sortOption === "checkOut" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                    </button>
                  </li>
                  <li>
                    <button
                      className={`flex items-center justify-between w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        sortOption === "totalPrice" ? "bg-gray-100 dark:bg-gray-700" : ""
                      }`}
                      onClick={() => handleSortChange("totalPrice")}
                    >
                      Price
                      {sortOption === "totalPrice" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area with filters and bookings table */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters sidebar - desktop version is always visible, mobile version is toggleable */}
          <div
            className={`${
              showFilters ? "block" : "hidden"
            } md:block w-full md:w-64 bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-6 h-fit sticky top-20`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h3>
              <div className="flex items-center">
                <button
                  onClick={resetFilters}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                >
                  Reset all
                </button>
                <button onClick={() => setShowFilters(false)} className="ml-2 md:hidden text-gray-500">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Status</h4>
              <div className="space-y-2">
                {statusOptions.map((status) => (
                  <div key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`status-${status}`}
                      checked={filters.status.includes(status)}
                      onChange={() => handleFilterChange("status", status)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`status-${status}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {status}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Range Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Check-in Date Range</h4>
              <div className="flex flex-col space-y-2">
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => handleFilterChange("dateRange", { start: e.target.value })}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => handleFilterChange("dateRange", { end: e.target.value })}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Price Range</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>${filters.priceRange[0]}</span>
                  <span>${filters.priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3000"
                  step="100"
                  value={filters.priceRange[0]}
                  onChange={(e) =>
                    handleFilterChange("priceRange", [Number.parseInt(e.target.value), filters.priceRange[1]])
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <input
                  type="range"
                  min="0"
                  max="3000"
                  step="100"
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    handleFilterChange("priceRange", [filters.priceRange[0], Number.parseInt(e.target.value)])
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Bookings table */}
          <div className="flex-1">
            {/* Active filters display */}
            {countActiveFilters() > 0 && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active filters:</span>

                  {filters.status.map((status) => (
                    <span
                      key={status}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                    >
                      Status: {status}
                      <button
                        onClick={() => handleFilterChange("status", status)}
                        className="ml-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}

                  {filters.dateRange.start && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                      From: {filters.dateRange.start}
                      <button
                        onClick={() => handleFilterChange("dateRange", { start: "" })}
                        className="ml-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}

                  {filters.dateRange.end && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                      To: {filters.dateRange.end}
                      <button
                        onClick={() => handleFilterChange("dateRange", { end: "" })}
                        className="ml-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}

                  {(filters.priceRange[0] > 0 || filters.priceRange[1] < 3000) && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                      Price: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                      <button
                        onClick={() => handleFilterChange("priceRange", [0, 3000])}
                        className="ml-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}

                  <button
                    onClick={resetFilters}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 ml-auto"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            )}

            {/* Results count */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {sortedBookings.length} of {bookings.length} bookings
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              {sortedBookings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
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
                          Dates
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Guests
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Total
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {sortedBookings.map((booking) => (
                        <motion.tr
                          key={booking.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{booking.hotel}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{booking.roomType}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900 dark:text-white">
                              <Calendar className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                              {formatDate(booking.checkIn)}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(booking.checkOut)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {booking.guests}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            ${booking.totalPrice}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleViewBooking(booking.id)}
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </button>
                            {booking.status !== "Cancelled" && (
                              <button
                                onClick={() => handleCancelBooking(booking.id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Cancel</span>
                              </button>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No bookings found</h3>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    No bookings match your current filters. Try adjusting your search criteria.
                  </p>
                  {countActiveFilters() > 0 && (
                    <button
                      onClick={resetFilters}
                      className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking details modal */}
        {isModalOpen && selectedBooking && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
                onClick={() => setIsModalOpen(false)}
              >
                <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                &#8203;
              </span>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              >
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Booking Details</h3>
                        <button
                          onClick={() => setIsModalOpen(false)}
                          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="mt-4 space-y-6">
                        {/* Booking info */}
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Booking ID</p>
                              <p className="text-sm text-gray-900 dark:text-white">#{selectedBooking}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                              <p
                                className={`text-sm inline-flex items-center ${getStatusColor(
                                  getBookingById(selectedBooking)?.status || ""
                                )} px-2 py-0.5 rounded-full`}
                              >
                                {getBookingById(selectedBooking)?.status}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Hotel</p>
                              <p className="text-sm text-gray-900 dark:text-white">
                                {getBookingById(selectedBooking)?.hotel}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Room Type</p>
                              <p className="text-sm text-gray-900 dark:text-white">
                                {getBookingById(selectedBooking)?.roomType}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Check-in</p>
                              <p className="text-sm text-gray-900 dark:text-white flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(getBookingById(selectedBooking)?.checkIn || "")}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Check-out</p>
                              <p className="text-sm text-gray-900 dark:text-white flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(getBookingById(selectedBooking)?.checkOut || "")}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Guests</p>
                              <p className="text-sm text-gray-900 dark:text-white">
                                {getBookingById(selectedBooking)?.guests}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Booking Date</p>
                              <p className="text-sm text-gray-900 dark:text-white flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatDate(getBookingById(selectedBooking)?.bookingDate || "")}
                              </p>
                            </div>
                            {getBookingById(selectedBooking)?.cancellationDate && (
                              <div className="col-span-2">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Cancellation Date
                                </p>
                                <p className="text-sm text-gray-900 dark:text-white flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {formatDate(getBookingById(selectedBooking)?.cancellationDate || "")}
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                            <div className="flex justify-between">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Total Price</p>
                              <p className="text-sm font-bold text-gray-900 dark:text-white">
                                ${getBookingById(selectedBooking)?.totalPrice}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Close
                  </button>
                  {getBookingById(selectedBooking)?.status !== "Cancelled" && (
                    <button
                      type="button"
                      onClick={() => handleCancelBooking(selectedBooking)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default UserBookings