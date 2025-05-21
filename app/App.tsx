import { AuthProvider } from "./context/AuthContext"
import { ThemeProvider } from "./context/ThemeContext"
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
      <ThemeProvider>
        <AuthProvider>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
  )
}

export default App
