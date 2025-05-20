import { BrowserRouter as Router } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { ThemeProvider } from "./context/ThemeContext"
import AppRoutes from "@/app/routes/AppRoutes"
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
