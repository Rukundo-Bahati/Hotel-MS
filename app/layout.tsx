
import "./globals.css"
import { ThemeProvider } from "@/app/context/ThemeContext" // path to your ThemeContext file
import { AuthProvider } from "@/app/context/AuthContext"

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



