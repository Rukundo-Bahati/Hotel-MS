import "./globals.css"
import { ReactNode } from "react"
import { AuthProvider } from "@/app/context/AuthContext"

export const metadata = {
  title: "Hotel Booking App",
  description: "Login and manage your bookings",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
