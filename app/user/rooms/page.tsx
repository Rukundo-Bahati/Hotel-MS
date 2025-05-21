"use client";

import { useState, useMemo, useCallback } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { Star, Search, Filter, X, ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";

interface Room {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  hotel: string;
  amenities: string[];
  capacity: number;
  type: string;
}

interface Filters {
  priceRange: [number, number];
  hotels: string[];
  amenities: string[];
  capacity: number[];
  type: string[];
  rating: number;
}

const roomsData: Room[] = [
  // Add your room data here
];

const getUniqueValues = <T, K extends keyof T>(data: T[], key: K): T[K][] => {
  return [...new Set(data.map((item) => item[key]))];
};

interface PriceRangeFilterProps {
  filters: Filters;
  handleFilterChange: (filterType: keyof Filters, value: any) => void;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({ filters, handleFilterChange }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
      <span>${filters.priceRange[0]}</span>
      <span>${filters.priceRange[1]}</span>
    </div>
    <input
      type="range"
      min="0"
      max="500"
      step="10"
      value={filters.priceRange[0]}
      onChange={(e) =>
        handleFilterChange("priceRange", [
          Number.parseInt(e.target.value),
          Math.max(Number.parseInt(e.target.value), filters.priceRange[1]),
        ])
      }
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      aria-label="Minimum price"
    />
    <input
      type="range"
      min="0"
      max="500"
      step="10"
      value={filters.priceRange[1]}
      onChange={(e) =>
        handleFilterChange("priceRange", [
          Math.min(filters.priceRange[0], Number.parseInt(e.target.value)),
          Number.parseInt(e.target.value),
        ])
      }
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      aria-label="Maximum price"
    />
  </div>
);

const UserRooms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filters>({
    priceRange: [0, 500],
    hotels: [],
    amenities: [],
    capacity: [],
    type: [],
    rating: 0,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState<"recommended" | "price" | "rating" | "name">("recommended");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isSortOpen, setIsSortOpen] = useState(false);

  const hotelOptions = getUniqueValues(roomsData, "hotel");
  const amenityOptions = [...new Set(roomsData.flatMap((room) => room.amenities))];
  const capacityOptions = [...new Set(roomsData.map((room) => room.capacity))].sort((a, b) => a - b);
  const typeOptions = getUniqueValues(roomsData, "type");

  const filteredRooms = useMemo(() => {
    return roomsData.filter((room) => {
      const matchesSearch =
        searchTerm === "" ||
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.hotel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.type.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPrice = room.price >= filters.priceRange[0] && room.price <= filters.priceRange[1];
      const matchesHotel = filters.hotels.length === 0 || filters.hotels.includes(room.hotel);
      const matchesAmenities =
        filters.amenities.length === 0 || filters.amenities.every((a) => room.amenities.includes(a));
      const matchesCapacity = filters.capacity.length === 0 || filters.capacity.includes(room.capacity);
      const matchesType = filters.type.length === 0 || filters.type.includes(room.type);
      const matchesRating = room.rating >= filters.rating;

      return (
        matchesSearch &&
        matchesPrice &&
        matchesHotel &&
        matchesAmenities &&
        matchesCapacity &&
        matchesType &&
        matchesRating
      );
    });
  }, [searchTerm, filters]);

  const sortedRooms = useMemo(() => {
    return [...filteredRooms].sort((a, b) => {
      let comparison = 0;
      switch (sortOption) {
        case "price":
          comparison = a.price - b.price;
          break;
        case "rating":
          comparison = b.rating - a.rating;
          break;
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "recommended":
        default:
          comparison = b.rating - a.rating || a.price - b.price;
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredRooms, sortOption, sortDirection]);

  const handleFilterChange = useCallback((filterType: keyof Filters, value: any) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      if (filterType === "priceRange") {
        const [min, max] = value;
        newFilters.priceRange = [Math.min(min, max), Math.max(min, max)];
      } else if (filterType === "rating") {
        newFilters.rating = value;
      } else {
        const currentValues = newFilters[filterType] as any[];
        newFilters[filterType] = currentValues.includes(value)
          ? currentValues.filter((item) => item !== value)
          : [...currentValues, value];
      }
      return newFilters;
    });
  }, []);

  const handleSortChange = useCallback(
    (option: typeof sortOption) => {
      if (sortOption === option) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortOption(option);
        setSortDirection("asc");
      }
      setIsSortOpen(false);
    },
    [sortOption]
  );

  const resetFilters = useCallback(() => {
    setFilters({
      priceRange: [0, 500],
      hotels: [],
      amenities: [],
      capacity: [],
      type: [],
      rating: 0,
    });
    setSearchTerm("");
    setSortOption("recommended");
    setSortDirection("asc");
  }, []);

  return (
    <DashboardLayout>
    <div className="p-4 space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg w-full">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-200"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>
  
      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
          <PriceRangeFilter filters={filters} handleFilterChange={handleFilterChange} />
          {/* Add other filter components here like Hotel, Amenities, Capacity, etc. */}
          <button
            onClick={resetFilters}
            className="mt-4 text-sm text-red-500 underline"
          >
            Reset Filters
          </button>
        </div>
      )}
  
      {/* Room List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedRooms.length > 0 ? (
          sortedRooms.map((room) => (
            <div key={room.id} className="border rounded-lg p-4 shadow bg-white dark:bg-gray-800">
              <img src={room.image} alt={room.name} className="w-full h-40 object-cover rounded" />
              <h3 className="mt-2 text-lg font-semibold">{room.name}</h3>
              <p className="text-sm text-gray-500">{room.hotel}</p>
              <p className="text-sm text-gray-600 mt-1">${room.price} / night</p>
              <div className="flex items-center text-yellow-500 mt-1">
                <Star className="w-4 h-4" />
                <span className="ml-1 text-sm">{room.rating}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No rooms found matching your criteria.</p>
        )}
      </div>
    </div>
  </DashboardLayout>
  
  );
};

export default UserRooms;
