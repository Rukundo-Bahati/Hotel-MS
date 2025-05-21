"use client";

import type React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Dialog } from "@/components/ui/dialog";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  ArrowUpDown,
  Hotel,
  Bed,
  Users,
  DollarSign,
  Star,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

// Mock data for rooms
const mockRooms = [
  {
    id: 1,
    name: "Deluxe King Room",
    hotel: "Grand Plaza Hotel",
    type: "Deluxe",
    price: 199,
    capacity: 2,
    amenities: ["Wi-Fi", "TV", "Mini Bar", "Air Conditioning"],
    status: "Available",
    rating: 4.7,
  },
  {
    id: 2,
    name: "Executive Suite",
    hotel: "Skyline Resort",
    type: "Suite",
    price: 349,
    capacity: 4,
    amenities: ["Wi-Fi", "TV", "Mini Bar", "Kitchen", "Jacuzzi"],
    status: "Available",
    rating: 4.9,
  },
  {
    id: 3,
    name: "Standard Twin Room",
    hotel: "Comfort Inn",
    type: "Standard",
    price: 129,
    capacity: 2,
    amenities: ["Wi-Fi", "TV", "Air Conditioning"],
    status: "Maintenance",
    rating: 4.2,
  },
  {
    id: 4,
    name: "Family Suite",
    hotel: "Beachfront Resort",
    type: "Suite",
    price: 299,
    capacity: 6,
    amenities: ["Wi-Fi", "TV", "Kitchen", "Balcony", "Pool Access"],
    status: "Available",
    rating: 4.8,
  },
  {
    id: 5,
    name: "Budget Single Room",
    hotel: "City Center Hotel",
    type: "Standard",
    price: 89,
    capacity: 1,
    amenities: ["Wi-Fi", "TV"],
    status: "Available",
    rating: 3.9,
  },
  {
    id: 6,
    name: "Luxury Penthouse",
    hotel: "Grand Plaza Hotel",
    type: "Penthouse",
    price: 599,
    capacity: 4,
    amenities: [
      "Wi-Fi",
      "TV",
      "Mini Bar",
      "Kitchen",
      "Jacuzzi",
      "Private Terrace",
    ],
    status: "Booked",
    rating: 5.0,
  },
];
// Room types for filter
const roomTypes = ["Standard", "Deluxe", "Suite", "Penthouse"];

// Hotels for filter
const hotels = [
  "Grand Plaza Hotel",
  "Skyline Resort",
  "Comfort Inn",
  "Beachfront Resort",
  "City Center Hotel",
];

// Amenities for filter
const allAmenities = [
  "Wi-Fi",
  "TV",
  "Mini Bar",
  "Air Conditioning",
  "Kitchen",
  "Jacuzzi",
  "Balcony",
  "Pool Access",
  "Private Terrace",
];

// Status options for filter
const statusOptions = ["Available", "Booked", "Maintenance"];

const AdminRooms = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState("name-asc");
  const [rooms, setRooms] = useState(mockRooms);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({
    name: "",
    hotel: "",
    type: "Standard",
    price: 100,
    capacity: 1,
    amenities: [],
    status: "Available",
    rating: 0,
  });

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedHotels, setSelectedHotels] = useState<string[]>([]);
  const [selectedCapacity, setSelectedCapacity] = useState<number | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  // Active filters tracking
  const [activeFilters, setActiveFilters] = useState<
    {
      type: string;
      value: string;
      id: string;
    }[]
  >([]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Apply filters
  const applyFilters = () => {
    const newActiveFilters: {
      type: string;
      value: string;
      id: string;
    }[] = [];

    // Add price range filter if changed from default
    if (priceRange[0] > 0 || priceRange[1] < 1000) {
      newActiveFilters.push({
        type: "Price Range",
        value: `$${priceRange[0]} - $${priceRange[1]}`,
        id: `price-${priceRange[0]}-${priceRange[1]}`,
      });
    }

    // Add room type filters
    selectedTypes.forEach((type) => {
      newActiveFilters.push({
        type: "Room Type",
        value: type,
        id: `type-${type}`,
      });
    });

    // Add hotel filters
    selectedHotels.forEach((hotel) => {
      newActiveFilters.push({
        type: "Hotel",
        value: hotel,
        id: `hotel-${hotel}`,
      });
    });

    // Add capacity filter
    if (selectedCapacity) {
      newActiveFilters.push({
        type: "Capacity",
        value: `${selectedCapacity} ${
          selectedCapacity === 1 ? "Person" : "People"
        }`,
        id: `capacity-${selectedCapacity}`,
      });
    }

    // Add amenity filters
    selectedAmenities.forEach((amenity) => {
      newActiveFilters.push({
        type: "Amenity",
        value: amenity,
        id: `amenity-${amenity}`,
      });
    });

    // Add status filters
    selectedStatus.forEach((status) => {
      newActiveFilters.push({
        type: "Status",
        value: status,
        id: `status-${status}`,
      });
    });

    setActiveFilters(newActiveFilters);
    setIsFilterOpen(false);

    toast({
      title: "Filters Applied",
      description: `${newActiveFilters.length} filters applied to rooms.`,
    });
  };

  // Remove a specific filter
  const removeFilter = (filterId: string) => {
    const [type, value] = filterId.split("-");

    if (type === "price") {
      setPriceRange([0, 1000]);
    } else if (type === "type") {
      setSelectedTypes((prev) => prev.filter((t) => t !== value));
    } else if (type === "hotel") {
      setSelectedHotels((prev) => prev.filter((h) => h !== value));
    } else if (type === "capacity") {
      setSelectedCapacity(null);
    } else if (type === "amenity") {
      setSelectedAmenities((prev) => prev.filter((a) => a !== value));
    } else if (type === "status") {
      setSelectedStatus((prev) => prev.filter((s) => s !== value));
    }

    setActiveFilters((prev) => prev.filter((filter) => filter.id !== filterId));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedTypes([]);
    setSelectedHotels([]);
    setSelectedCapacity(null);
    setSelectedAmenities([]);
    setSelectedStatus([]);
    setActiveFilters([]);
    setSearchTerm("");
    setSortOption("name-asc");

    toast({
      title: "Filters Cleared",
      description: "All filters have been cleared.",
    });
  };

  // Filter and sort rooms
  const filteredAndSortedRooms = rooms
    .filter((room) => {
      // Search term filter
      const matchesSearch =
        searchTerm === "" ||
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.hotel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.type.toLowerCase().includes(searchTerm.toLowerCase());

      // Price range filter
      const matchesPrice =
        room.price >= priceRange[0] && room.price <= priceRange[1];

      // Room type filter
      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(room.type);

      // Hotel filter
      const matchesHotel =
        selectedHotels.length === 0 || selectedHotels.includes(room.hotel);

      // Capacity filter
      const matchesCapacity =
        !selectedCapacity || room.capacity >= selectedCapacity;

      // Amenities filter
      const matchesAmenities =
        selectedAmenities.length === 0 ||
        selectedAmenities.every((amenity) => room.amenities.includes(amenity));

      // Status filter
      const matchesStatus =
        selectedStatus.length === 0 || selectedStatus.includes(room.status);

      return (
        matchesSearch &&
        matchesPrice &&
        matchesType &&
        matchesHotel &&
        matchesCapacity &&
        matchesAmenities &&
        matchesStatus
      );
    })
    .sort((a, b) => {
      // Sort based on selected option
      switch (sortOption) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "hotel-asc":
          return a.hotel.localeCompare(b.hotel);
        case "hotel-desc":
          return b.hotel.localeCompare(a.hotel);
        case "capacity-asc":
          return a.capacity - b.capacity;
        case "capacity-desc":
          return b.capacity - a.capacity;
        case "rating-asc":
          return a.rating - b.rating;
        case "rating-desc":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">Manage Rooms</h1>
          <button
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} />
            <span>Add Room</span>
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-grow">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search rooms by name, hotel, or type..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            {/* Filter Button */}
            <button
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg ${
                isFilterOpen
                  ? "bg-blue-50 border-blue-500 text-blue-600"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter size={18} />
              <span>Filter</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  isFilterOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                className="appearance-none bg-white border rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="hotel-asc">Hotel (A-Z)</option>
                <option value="hotel-desc">Hotel (Z-A)</option>
                <option value="capacity-asc">Capacity (Low to High)</option>
                <option value="capacity-desc">Capacity (High to Low)</option>
                <option value="rating-asc">Rating (Low to High)</option>
                <option value="rating-desc">Rating (High to Low)</option>
              </select>
              <ArrowUpDown
                size={16}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Filter Panel */}
          {isFilterOpen && (
            <div className="mt-4 border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Price Range Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Price Range
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">$</span>
                    <input
                      type="number"
                      min="0"
                      max={priceRange[1]}
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([
                          Number.parseInt(e.target.value),
                          priceRange[1],
                        ])
                      }
                      className="w-full border rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="text-gray-500">to</span>
                    <span className="text-gray-500">$</span>
                    <input
                      type="number"
                      min={priceRange[0]}
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([
                          priceRange[0],
                          Number.parseInt(e.target.value),
                        ])
                      }
                      className="w-full border rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Room Type Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Room Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {roomTypes.map((type) => (
                      <button
                        key={type}
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedTypes.includes(type)
                            ? "bg-blue-100 text-blue-700 border border-blue-300"
                            : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                        }`}
                        onClick={() => {
                          if (selectedTypes.includes(type)) {
                            setSelectedTypes(
                              selectedTypes.filter((t) => t !== type)
                            );
                          } else {
                            setSelectedTypes([...selectedTypes, type]);
                          }
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hotel Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Hotel
                  </label>
                  <select
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    multiple
                    size={3}
                    value={selectedHotels}
                    onChange={(e) => {
                      const values = Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      );
                      setSelectedHotels(values);
                    }}
                  >
                    {hotels.map((hotel) => (
                      <option key={hotel} value={hotel}>
                        {hotel}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Capacity Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Minimum Capacity
                  </label>
                  <select
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={selectedCapacity || ""}
                    onChange={(e) =>
                      setSelectedCapacity(
                        e.target.value ? Number.parseInt(e.target.value) : null
                      )
                    }
                  >
                    <option value="">Any</option>
                    <option value="1">1 Person</option>
                    <option value="2">2 People</option>
                    <option value="4">4 People</option>
                    <option value="6">6+ People</option>
                  </select>
                </div>

                {/* Amenities Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Amenities
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allAmenities.slice(0, 5).map((amenity) => (
                      <button
                        key={amenity}
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedAmenities.includes(amenity)
                            ? "bg-blue-100 text-blue-700 border border-blue-300"
                            : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                        }`}
                        onClick={() => {
                          if (selectedAmenities.includes(amenity)) {
                            setSelectedAmenities(
                              selectedAmenities.filter((a) => a !== amenity)
                            );
                          } else {
                            setSelectedAmenities([
                              ...selectedAmenities,
                              amenity,
                            ]);
                          }
                        }}
                      >
                        {amenity}
                      </button>
                    ))}
                    {/* Show more button for amenities */}
                    {allAmenities.length > 5 && (
                      <button
                        className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                        onClick={() => {
                          toast({
                            title: "More Amenities",
                            description:
                              "Additional amenities selection coming soon.",
                          });
                        }}
                      >
                        + More
                      </button>
                    )}
                  </div>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedStatus.includes(status)
                            ? "bg-blue-100 text-blue-700 border border-blue-300"
                            : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                        }`}
                        onClick={() => {
                          if (selectedStatus.includes(status)) {
                            setSelectedStatus(
                              selectedStatus.filter((s) => s !== status)
                            );
                          } else {
                            setSelectedStatus([...selectedStatus, status]);
                          }
                        }}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  onClick={clearAllFilters}
                >
                  Clear All
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={applyFilters}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">Active Filters:</span>
              {activeFilters.map((filter) => (
                <div
                  key={filter.id}
                  className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-sm"
                >
                  <span className="font-medium">{filter.type}:</span>
                  <span>{filter.value}</span>
                  <button
                    className="ml-1 text-blue-500 hover:text-blue-700"
                    onClick={() => removeFilter(filter.id)}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                onClick={clearAllFilters}
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 text-gray-600">
          Showing {filteredAndSortedRooms.length} of {mockRooms.length} rooms
        </div>

        {/* Rooms Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hotel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                          <Bed className="text-gray-500" size={20} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {room.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {room.type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Hotel size={16} className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {room.hotel}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign size={16} className="text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">
                          {room.price}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          /night
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users size={16} className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {room.capacity}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          room.status === "Available"
                            ? "bg-green-100 text-green-800"
                            : room.status === "Booked"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {room.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star size={16} className="text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-900">
                          {room.rating}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() =>
                            toast({
                              title: "Edit Room",
                              description: `Edit functionality for ${room.name} coming soon.`,
                            })
                          }
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() =>
                            toast({
                              title: "Delete Room",
                              description: `Delete functionality for ${room.name} coming soon.`,
                            })
                          }
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredAndSortedRooms.length === 0 && (
            <div className="py-8 text-center">
              <Bed className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No rooms found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={clearAllFilters}
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}

          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-md space-y-4">
                <h2 className="text-lg font-bold">Add New Room</h2>

                <input
                  type="text"
                  placeholder="Room Name"
                  value={newRoom.name}
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, name: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Hotel Name"
                  value={newRoom.hotel}
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, hotel: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={newRoom.price}
                  onChange={(e) =>
                    setNewRoom({
                      ...newRoom,
                      price: parseFloat(e.target.value),
                    })
                  }
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="number"
                  placeholder="Capacity"
                  value={newRoom.capacity}
                  onChange={(e) =>
                    setNewRoom({
                      ...newRoom,
                      capacity: parseInt(e.target.value),
                    })
                  }
                  className="w-full border px-3 py-2 rounded"
                />
                <select
                  value={newRoom.type}
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, type: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                >
                  {roomTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <select
                  value={newRoom.status}
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, status: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={() => {
                      const roomToAdd = {
                        ...newRoom,
                        id: rooms.length + 1,
                        rating: 4.5,
                        amenities: [],
                      };
                      setRooms([...rooms, roomToAdd]);
                      setIsModalOpen(false);
                      toast({
                        title: "Room Added",
                        description: `${roomToAdd.name} was added.`,
                      });
                    }}
                  >
                    Add Room
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminRooms;
