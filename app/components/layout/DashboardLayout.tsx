"use client"

import { type ReactNode, useState } from "react"
import { useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"

interface DashboardLayoutProps {
  children: ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`hidden md:block`}>
        <Sidebar isOpen={true} toggleSidebar={toggleSidebar} />
      </div>
      <div className={`md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto"
          >
            {children} {/* Ensure children are rendered correctly */}
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
