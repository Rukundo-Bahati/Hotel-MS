import { AuthProvider } from "./context/AuthContext"
import { ThemeProvider } from "./context/ThemeContext"
import AppRoutes from "@/app/routes/AppRoutes"
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
  )
}

export default App
