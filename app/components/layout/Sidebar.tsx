"use client";

import { useAuth } from "../../context/AuthContext";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Hotel, Bed, Calendar, Users, X, BookOpen } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const base = "/dashboard";
  const userLinks = [
    { to: `${base}/user`, icon: <Home size={20} />, label: "Dashboard" },
    { to: `${base}/user/rooms`, icon: <Bed size={20} />, label: "View Rooms" },
    { to: `${base}/user/book`, icon: <Calendar size={20} />, label: "Book Room" },
    { to: `${base}/user/bookings`, icon: <BookOpen size={20} />, label: "My Bookings" },
  ];

  const adminLinks = [
    { to: `${base}/admin`, icon: <Home size={20} />, label: "Dashboard" },
    { to: `${base}/admin/hotels`, icon: <Hotel size={20} />, label: "Manage Hotels" },
    { to: `${base}/admin/rooms`, icon: <Bed size={20} />, label: "Manage Rooms" },
    { to: `${base}/admin/bookings`, icon: <Calendar size={20} />, label: "All Bookings" },
    { to: `${base}/admin/users`, icon: <Users size={20} />, label: "Manage Users" },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-20 md:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      <motion.aside
        variants={{
          open: { x: 0 },
          closed: { x: "-100%" }
        }}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className="fixed md:relative w-64 h-full bg-indigo-700 text-white z-30 shadow-lg"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-indigo-600">
            <h2 className="text-xl font-bold">Hotel Booking</h2>
            <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-indigo-600 md:hidden">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to.endsWith("/user") || link.to.endsWith("/admin")}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 rounded-md transition-colors ${
                        isActive
                          ? "bg-indigo-800 text-white"
                          : "text-indigo-100 hover:bg-indigo-600"
                      }`
                    }
                    onClick={() => {
                      if (window.innerWidth < 768) toggleSidebar();
                    }}
                  >
                    <span className="mr-3">{link.icon}</span>
                    <span>{link.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-indigo-600">
            <div className="text-sm text-indigo-200">
              <p>Logged in as:</p>
              <p className="font-semibold">{user?.username}</p>
              <p className="text-xs mt-1">{user?.role}</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;