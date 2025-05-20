"use client"

import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext"
import { Menu, Sun, Moon, LogOut, User } from "lucide-react"

interface TopbarProps {
  toggleSidebar: () => void
}

const Topbar = ({ toggleSidebar }: TopbarProps) => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left side - Menu toggle */}
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Right side - User info, theme toggle, logout */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* User info */}
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
              <User className="h-4 w-4" />
            </div>
            <div className="ml-2 hidden md:block">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.username}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={logout}
            className="p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Topbar
