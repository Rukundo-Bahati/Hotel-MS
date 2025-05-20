"use client"

import type React from "react"

import { useState } from "react"
import DashboardLayout from "../../components/layout/DashboardLayout"
import { motion } from "framer-motion"
import { Plus, Edit, Trash, X, Search, MapPin, Star, Phone, Filter, SlidersHorizontal, ChevronDown } from "lucide-react"
import { useToast } from "../../../src/hooks/use-toast"

// Mock hotels data
const hotelsData = [
  {
    id: 1,
    name: "Grand Hotel",
    location: "New York, NY",
    address: "123 Broadway, New York, NY 10001",
    phone: "+1 (212) 555-1234",
    email: "info@grandhotel.com",
    rating: 4.8,
    rooms: 24,
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: 2,
    name: "Luxury Resort",
    location: "Miami, FL",
    address: "456 Ocean Drive, Miami, FL 33139",
    phone: "+1 (305) 555-5678",
    email: "info@luxuryresort.com",
    rating: 4.9,
    rooms: 36,
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: 3,
    name: "City Center Hotel",
    location: "Chicago, IL",
    address: "789 Michigan Ave, Chicago, IL 60611",
    phone: "+1 (312) 555-9012",
    email: "info@citycenterhotel.com",
    rating: 4.5,
    rooms: 18,
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: 4,
    name: "Skyline Hotel",
    location: "Los Angeles, CA",
    address: "321 Hollywood Blvd, Los Angeles, CA 90028",
    phone: "+1 (213) 555-3456",
    email: "info@skylinehotel.com",
    rating: 4.7,
    rooms: 30,
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: 5,
    name: "Mountain View Lodge",
    location: "Denver, CO",
    address: "567 Mountain Rd, Denver, CO 80202",
    phone: "+1 (303) 555-7890",
    email: "info@mountainviewlodge.com",
    rating: 4.6,
    rooms: 15,
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: 6,
    name: "Seaside Inn",
    location: "San Diego, CA",
    address: "890 Coast Hwy, San Diego, CA 92101",
    phone: "+1 (619) 555-2345",
    email: "info@seasideinn.com",
    rating: 4.4,
    rooms: 22,
    image: "/placeholder.svg?height=300&width=500",
  },
]

interface Hotel {
  id: number
  name: string
  location: string
  address: string
  phone: string
  email: string
  rating: number
  rooms: number
  image: string
}

const AdminHotels = () => {
  const [hotels, setHotels] = useState<Hotel[]>(hotelsData)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentHotel, setCurrentHotel] = useState<Hotel | null>(null)
  const [formData, setFormData] = useState<Partial<Hotel>>({
    name: "",
    location: "",
    address: "",
    phone: "",
    email: "",
    rating: 5,
    rooms: 0,
    image: "/placeholder.svg?height=300&width=500",
  })
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<{
    location: string[]
    ratingRange: [number, number]
    roomsRange: [number, number]
  }>({
    location: [],
    ratingRange: [0, 5],
    roomsRange: [0, 50],
  })
  const [sortOption, setSortOption] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const { toast } = useToast()

  // Get unique values for filters
  const locationOptions = [...new Set(hotels.map((hotel) => hotel.location.split(",")[1].trim()))]

  // Filter hotels based on all criteria
  const filteredHotels = hotels.filter((hotel) => {
    // Search term filter
    const matchesSearch =
      searchTerm === "" ||
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.phone.toLowerCase().includes(searchTerm.toLowerCase())

    // Location filter
    const matchesLocation =
      filters.location.length === 0 || filters.location.some((loc) => hotel.location.includes(loc))

    // Rating range filter
    const matchesRating = hotel.rating >= filters.ratingRange[0] && hotel.rating <= filters.ratingRange[1]

    // Rooms range filter
    const matchesRooms = hotel.rooms >= filters.roomsRange[0] && hotel.rooms <= filters.roomsRange[1]

    return matchesSearch && matchesLocation && matchesRating && matchesRooms
  })

  // Sort the filtered hotels
  const sortedHotels = [...filteredHotels].sort((a, b) => {
    let comparison = 0

    switch (sortOption) {
      case "name":
        comparison = a.name.localeCompare(b.name)
        break
      case "location":
        comparison = a.location.localeCompare(b.location)
        break
      case "rating":
        comparison = a.rating - b.rating
        break
      case "rooms":
        comparison = a.rooms - b.rooms
        break
      default:
        comparison = a.name.localeCompare(b.name)
        break
    }

    return sortDirection === "asc" ? comparison : -comparison
  })

  const handleAddHotel = () => {
    setCurrentHotel(null)
    setFormData({
      name: "",
      location: "",
      address: "",
      phone: "",
      email: "",
      rating: 5,
      rooms: 0,
      image: "/placeholder.svg?height=300&width=500",
    })
    setIsModalOpen(true)
  }

  const handleEditHotel = (hotel: Hotel) => {
    setCurrentHotel(hotel)
    setFormData({ ...hotel })
    setIsModalOpen(true)
  }

  const handleDeleteHotel = (hotel: Hotel) => {
    setCurrentHotel(hotel)
    setIsDeleteModalOpen(true)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" || name === "rooms" ? Number(value) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (currentHotel) {
      // Update existing hotel
      setHotels(hotels.map((hotel) => (hotel.id === currentHotel.id ? { ...hotel, ...formData } : hotel)))
      toast({
        title: "Hotel updated",
        description: "The hotel has been updated successfully.",
      })
    } else {
      // Add new hotel
      const newHotel = {
        ...(formData as Hotel),
        id: Math.max(...hotels.map((h) => h.id)) + 1,
      }
      setHotels([...hotels, newHotel])
      toast({
        title: "Hotel added",
        description: "The hotel has been added successfully.",
      })
    }

    setIsModalOpen(false)
  }

  const confirmDelete = () => {
    if (currentHotel) {
      setHotels(hotels.filter((hotel) => hotel.id !== currentHotel.id))
      toast({
        title: "Hotel deleted",
        description: "The hotel has been deleted successfully.",
      })
      setIsDeleteModalOpen(false)
    }
  }

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string | number[]) => {
    setFilters((prev) => {
      const newFilters = { ...prev }

      if (filterType === "location") {
        if (typeof value === "string" && newFilters.location.includes(value)) {
          // Remove the value if it's already selected
          newFilters.location = newFilters.location.filter((item) => item !== value)
        } else {
          // Add the value if it's not already selected
          if (typeof value === "string") {
            newFilters.location = [...newFilters.location, value]
          }
        }
      } else if (filterType === "ratingRange") {
        if (Array.isArray(value) && value.length === 2) {
          newFilters.ratingRange = value as [number, number]
        }
      } else if (filterType === "roomsRange") {
        if (Array.isArray(value) && value.length === 2) {
          newFilters.roomsRange = value as [number, number]
        }
      }

      return newFilters
    })
  }

  // Handle sort changes
  const handleSortChange = (option: React.SetStateAction<string>) => {
    if (sortOption === option) {
      // Toggle direction if clicking the same option
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new option and reset direction to ascending
      setSortOption(option)
      setSortDirection("asc")
    }
  }

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      location: [],
      ratingRange: [0, 5],
      roomsRange: [0, 50],
    })
    setSearchTerm("")
    setSortOption("name")
    setSortDirection("asc")
  }

  // Count active filters
  const countActiveFilters = () => {
    let count = 0
    if (filters.location.length > 0) count++
    if (filters.ratingRange[0] > 0 || filters.ratingRange[1] < 5) count++
    if (filters.roomsRange[0] > 0 || filters.roomsRange[1] < 50) count++
    return count
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Hotels</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">Add, edit or remove hotels from your system</p>
          </div>
          <button
            onClick={handleAddHotel}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Hotel
          </button>
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
                placeholder="Search hotels by name, location, email, or phone..."
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
                    const dropdown = document.getElementById("sort-dropdown");
                    if (dropdown) {
                      dropdown.classList.toggle("hidden");
                    }
                  }}
                >
                  <span className="flex items-center">
                    <SlidersHorizontal className="h-5 w-5 mr-2" />
                    <span>
                      Sort: {sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}{" "}
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
                        sortOption === "name" ? "bg-gray-100 dark:bg-gray-700" : ""
                      }`}
                      onClick={() => handleSortChange("name")}
                    >
                      Name
                      {sortOption === "name" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                    </button>
                  </li>
                  <li>
                    <button
                      className={`flex items-center justify-between w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        sortOption === "location" ? "bg-gray-100 dark:bg-gray-700" : ""
                      }`}
                      onClick={() => handleSortChange("location")}
                    >
                      Location
                      {sortOption === "location" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                    </button>
                  </li>
                  <li>
                    <button
                      className={`flex items-center justify-between w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        sortOption === "rating" ? "bg-gray-100 dark:bg-gray-700" : ""
                      }`}
                      onClick={() => handleSortChange("rating")}
                    >
                      Rating
                      {sortOption === "rating" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                    </button>
                  </li>
                  <li>
                    <button
                      className={`flex items-center justify-between w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        sortOption === "rooms" ? "bg-gray-100 dark:bg-gray-700" : ""
                      }`}
                      onClick={() => handleSortChange("rooms")}
                    >
                      Number of Rooms
                      {sortOption === "rooms" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area with filters and hotels grid */}
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

            {/* Location Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">State</h4>
              <div className="space-y-2">
                {locationOptions.map((location) => (
                  <div key={location} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`location-${location}`}
                      checked={filters.location.includes(location)}
                      onChange={() => handleFilterChange("location", location)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`location-${location}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {location}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating Range Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Rating Range: {filters.ratingRange[0]} - {filters.ratingRange[1]}
              </h4>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={filters.ratingRange[0]}
                  onChange={(e) =>
                    handleFilterChange("ratingRange", [Number.parseFloat(e.target.value), filters.ratingRange[1]])
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={filters.ratingRange[1]}
                  onChange={(e) =>
                    handleFilterChange("ratingRange", [filters.ratingRange[0], Number.parseFloat(e.target.value)])
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>0</span>
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                </div>
              </div>
            </div>

            {/* Rooms Range Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Number of Rooms: {filters.roomsRange[0]} - {filters.roomsRange[1]}
              </h4>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={filters.roomsRange[0]}
                  onChange={(e) =>
                    handleFilterChange("roomsRange", [Number.parseInt(e.target.value), filters.roomsRange[1]])
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={filters.roomsRange[1]}
                  onChange={(e) =>
                    handleFilterChange("roomsRange", [filters.roomsRange[0], Number.parseInt(e.target.value)])
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>0</span>
                  <span>10</span>
                  <span>20</span>
                  <span>30</span>
                  <span>40</span>
                  <span>50</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hotels grid */}
          <div className="flex-1">
            {/* Active filters display */}
            {countActiveFilters() > 0 && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active filters:</span>

                  {filters.location.map((location) => (
                    <span
                      key={location}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                    >
                      State: {location}
                      <button
                        onClick={() => handleFilterChange("location", location)}
                        className="ml-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}

                  {(filters.ratingRange[0] > 0 || filters.ratingRange[1] < 5) && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                      Rating: {filters.ratingRange[0]} - {filters.ratingRange[1]}
                      <button
                        onClick={() => handleFilterChange("ratingRange", [0, 5])}
                        className="ml-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}

                  {(filters.roomsRange[0] > 0 || filters.roomsRange[1] < 50) && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                      Rooms: {filters.roomsRange[0]} - {filters.roomsRange[1]}
                      <button
                        onClick={() => handleFilterChange("roomsRange", [0, 50])}
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
                Showing {sortedHotels.length} of {hotels.length} hotels
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedHotels.length > 0 ? (
                sortedHotels.map((hotel) => (
                  <motion.div
                    key={hotel.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
                  >
                    <img
                      src={hotel.image || "/placeholder.svg"}
                      alt={hotel.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{hotel.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {hotel.location}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="ml-1 text-sm font-medium text-gray-900 dark:text-white">{hotel.rating}</span>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {hotel.phone}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{hotel.email}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{hotel.rooms} Rooms</p>
                      </div>
                      <div className="mt-4 flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditHotel(hotel)}
                          className="p-2 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 focus:outline-none"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteHotel(hotel)}
                          className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 focus:outline-none"
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">
                    No hotels found matching your search criteria. Try adjusting your filters.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add/Edit Hotel Modal */}
        {isModalOpen && (
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
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                          {currentHotel ? "Edit Hotel" : "Add New Hotel"}
                        </h3>
                        <button
                          onClick={() => setIsModalOpen(false)}
                          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Hotel Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleFormChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="location"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Location
                          </label>
                          <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleFormChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="address"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Address
                          </label>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleFormChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="phone"
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                              Phone
                            </label>
                            <input
                              type="text"
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleFormChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                              Email
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleFormChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="rating"
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                              Rating (1-5)
                            </label>
                            <input
                              type="number"
                              id="rating"
                              name="rating"
                              min="1"
                              max="5"
                              step="0.1"
                              value={formData.rating}
                              onChange={handleFormChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="rooms"
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                              Number of Rooms
                            </label>
                            <input
                              type="number"
                              id="rooms"
                              name="rooms"
                              min="1"
                              value={formData.rooms}
                              onChange={handleFormChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="image"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Image URL
                          </label>
                          <input
                            type="text"
                            id="image"
                            name="image"
                            value={formData.image}
                            onChange={handleFormChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {currentHotel ? "Update" : "Add"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && currentHotel && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
                onClick={() => setIsDeleteModalOpen(false)}
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
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                      <Trash className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Delete Hotel</h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Are you sure you want to delete {currentHotel.name}? This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={confirmDelete}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default AdminHotels
