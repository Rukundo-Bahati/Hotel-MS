"use client"

import type React from "react"

import { useState } from "react"
import DashboardLayout from "../../components/layout/DashboardLayout"
import { motion } from "framer-motion"
import { Calendar, Users, CreditCard, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock hotel data
const hotels = [
  { id: 1, name: "Grand Hotel" },
  { id: 2, name: "Luxury Resort" },
  { id: 3, name: "City Center Hotel" },
  { id: 4, name: "Skyline Hotel" },
]

// Mock room types
const roomTypes = [
  { id: 1, name: "Standard Room", price: 129, hotelId: 1 },
  { id: 2, name: "Deluxe Room", price: 199, hotelId: 1 },
  { id: 3, name: "Executive Suite", price: 299, hotelId: 1 },
  { id: 4, name: "Standard Room", price: 149, hotelId: 2 },
  { id: 5, name: "Deluxe Room", price: 229, hotelId: 2 },
  { id: 6, name: "Executive Suite", price: 349, hotelId: 2 },
  { id: 7, name: "Standard Room", price: 119, hotelId: 3 },
  { id: 8, name: "Deluxe Room", price: 179, hotelId: 3 },
  { id: 9, name: "Standard Room", price: 159, hotelId: 4 },
  { id: 10, name: "Penthouse Suite", price: 499, hotelId: 4 },
]

const UserBookRoom = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedHotel, setSelectedHotel] = useState<number | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null)
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Filter room types based on selected hotel
  const filteredRoomTypes = selectedHotel ? roomTypes.filter((room) => room.hotelId === selectedHotel) : []

  // Get selected room details
  const selectedRoomDetails = selectedRoom ? roomTypes.find((room) => room.id === selectedRoom) : null

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!selectedRoomDetails || !checkIn || !checkOut) return 0

    const startDate = new Date(checkIn)
    const endDate = new Date(checkOut)
    const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    return selectedRoomDetails.price * nights
  }

  const totalPrice = calculateTotalPrice()

  const handleNextStep = () => {
    if (currentStep === 1 && (!selectedHotel || !selectedRoom || !checkIn || !checkOut)) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      })
      return
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Booking successful",
        description: "Your room has been booked successfully.",
      })
      // Reset form
      setCurrentStep(1)
      setSelectedHotel(null)
      setSelectedRoom(null)
      setCheckIn("")
      setCheckOut("")
      setGuests(1)
    }, 1500)
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Book a Room</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Complete the form below to make a reservation</p>
        </div>

        {/* Booking steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= 1
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                }`}
              >
                <Calendar className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p
                  className={`text-sm font-medium ${
                    currentStep >= 1 ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  Room Selection
                </p>
              </div>
            </div>
            <div className="hidden sm:block w-24 border-t border-gray-300 dark:border-gray-600"></div>
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= 2
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                }`}
              >
                <Users className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p
                  className={`text-sm font-medium ${
                    currentStep >= 2 ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  Guest Details
                </p>
              </div>
            </div>
            <div className="hidden sm:block w-24 border-t border-gray-300 dark:border-gray-600"></div>
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= 3
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                }`}
              >
                <CreditCard className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p
                  className={`text-sm font-medium ${
                    currentStep >= 3 ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  Confirmation
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <motion.div
          key={`step-${currentStep}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <form onSubmit={handleSubmit}>
            {/* Step 1: Room Selection */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="hotel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Select Hotel
                  </label>
                  <select
                    id="hotel"
                    value={selectedHotel || ""}
                    onChange={(e) => {
                      setSelectedHotel(Number(e.target.value))
                      setSelectedRoom(null)
                    }}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select a hotel</option>
                    {hotels.map((hotel) => (
                      <option key={hotel.id} value={hotel.id}>
                        {hotel.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="room" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Select Room Type
                  </label>
                  <select
                    id="room"
                    value={selectedRoom || ""}
                    onChange={(e) => setSelectedRoom(Number(e.target.value))}
                    disabled={!selectedHotel}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select a room type</option>
                    {filteredRoomTypes.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.name} - ${room.price}/night
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="check-in"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Check-in Date
                    </label>
                    <input
                      id="check-in"
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="check-out"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Check-out Date
                    </label>
                    <input
                      id="check-out"
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="guests" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Number of Guests
                  </label>
                  <input
                    id="guests"
                    type="number"
                    min="1"
                    max="4"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Guest Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label
                    htmlFor="special-requests"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Special Requests (Optional)
                  </label>
                  <textarea
                    id="special-requests"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Any special requests or requirements?"
                  ></textarea>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Booking Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Hotel:</span>
                      <span className="text-gray-900 dark:text-white">
                        {selectedHotel ? hotels.find((h) => h.id === selectedHotel)?.name : ""}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Room Type:</span>
                      <span className="text-gray-900 dark:text-white">{selectedRoomDetails?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Check-in Date:</span>
                      <span className="text-gray-900 dark:text-white">{checkIn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Check-out Date:</span>
                      <span className="text-gray-900 dark:text-white">{checkOut}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Number of Guests:</span>
                      <span className="text-gray-900 dark:text-white">{guests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Price per Night:</span>
                      <span className="text-gray-900 dark:text-white">${selectedRoomDetails?.price}</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-3 mt-3">
                      <div className="flex justify-between font-medium">
                        <span className="text-gray-900 dark:text-white">Total Price:</span>
                        <span className="text-gray-900 dark:text-white">${totalPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Payment Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="card-number"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Card Number
                      </label>
                      <input
                        id="card-number"
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="expiry"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Expiry Date
                        </label>
                        <input
                          id="expiry"
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="cvc"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          CVC
                        </label>
                        <input
                          id="cvc"
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                          placeholder="123"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="name-on-card"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Name on Card
                      </label>
                      <input
                        id="name-on-card"
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Enter name as it appears on card"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    I agree to the{" "}
                    <a href="#" className="text-indigo-600 hover:text-indigo-500">
                      terms and conditions
                    </a>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="mt-8 flex justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Previous
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Confirm Booking
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

export default UserBookRoom
