
import "./globals.css"
import { ThemeProvider } from "@/app/context/ThemeContext" // path to your ThemeContext file
import { AuthProvider } from "@/app/context/AuthContext"

// app/layout.tsx (App Router)
export const metadata = {
  title: 'HotelMS',
  icons: {
    icon: '/favicon.png',
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



