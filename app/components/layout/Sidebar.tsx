"use client";

import Link from "next/link";
import { usePathname,useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Hotel, Bed, Calendar, Users, X, BookOpen } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { type ReactNode } from "react";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const pathname = usePathname();
  const router = useRouter()

  const userLinks = [
    { href: "/user", icon: <Home size={20} />, label: "Dashboard" },
    { href: "/user/rooms", icon: <Bed size={20} />, label: "View Rooms" },
    { href: "/user/book-room", icon: <Calendar size={20} />, label: "Book Room" },
    { href: "/user/bookings", icon: <BookOpen size={20} />, label: "My Bookings" },
  ];
  
  const adminLinks = [
    { href: "/admin", icon: <Home size={20} />, label: "Dashboard" },
    { href: "/admin/hotels", icon: <Hotel size={20} />, label: "Manage Hotels" },
    { href: "/admin/rooms", icon: <Bed size={20} />, label: "Manage Rooms" },
    { href: "/admin/bookings", icon: <Calendar size={20} />, label: "All Bookings" },
    { href: "/admin/users", icon: <Users size={20} />, label: "Manage Users" },
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
              {links.map(({ href, icon, label }) => {
                const isActive =
                pathname === href ||
                (pathname.startsWith(href + "/") && href !== "/admin" && href !== "/user");              

                return (
                  <li key={href}>
                  <a
                    href={href}
                    onClick={(e) => {
                      e.preventDefault();   // prevent full reload
                      router.push(href);    // do client navigation
                      if (window.innerWidth < 768) toggleSidebar();
                    }}
                    className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                      isActive ? "bg-indigo-800 text-white" : "text-indigo-100 hover:bg-indigo-600"
                    }`}
                  >
                    <span className="mr-3">{icon}</span>
                    <span>{label}</span>
                  </a>
                </li>
                );
              })}
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
