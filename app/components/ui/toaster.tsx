"use client"

import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function Toaster() {
  const { toasts, dismiss } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed top-0 right-0 z-50 p-4 w-full md:max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`mb-3 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 ${
              toast.variant === "destructive"
                ? "border-l-4 border-red-500"
                : toast.variant === "success"
                  ? "border-l-4 border-green-500"
                  : ""
            }`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p
                    className={`text-sm font-medium ${
                      toast.variant === "destructive"
                        ? "text-red-600 dark:text-red-400"
                        : toast.variant === "success"
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    {toast.title}
                  </p>
                  {toast.description && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{toast.description}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200 dark:border-gray-700">
              <button
                onClick={() => dismiss(toast.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
