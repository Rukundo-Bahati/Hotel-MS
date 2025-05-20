"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

type UserRole = "USER" | "ADMIN"

interface User {
  id: string
  username: string
  email: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()


  useEffect(() => {
    // Check if user is already logged in
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }

    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // Mock API call - replace with actual API call
      // const response = await fetch("/api/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password }),
      // });
      // const data = await response.json();

      // Mock response
      const mockResponse = {
        token: "mock-jwt-token",
        user: {
          id: "1",
          username: email.split("@")[0],
          email,
          // For demo: if email contains 'admin', assign ADMIN role
          role: email.toLowerCase().includes("admin") ? "ADMIN" : ("USER" as UserRole),
        },
      }

      // Store token and user info
      localStorage.setItem("token", mockResponse.token)
      localStorage.setItem("user", JSON.stringify(mockResponse.user))

      // Update state
      setToken(mockResponse.token)
      setUser(mockResponse.user)
      setIsAuthenticated(true)

      // Redirect based on role
      if (mockResponse.user.role === "ADMIN") {
        router.push("/admin")

      } else {
        router.push("/user")
      }
    } catch (error) {
      console.error("Login failed:", error)
      throw new Error("Login failed. Please check your credentials.")
    }
  }

  const register = async (username: string, email: string, password: string) => {
    try {
      // Mock API call - replace with actual API call
      // const response = await fetch("/api/register", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ username, email, password }),
      // });
      // const data = await response.json();

      // Mock response
      const mockResponse = {
        token: "mock-jwt-token",
        user: {
          id: "1",
          username,
          email,
          role: "USER" as UserRole,
        },
      }

      // Store token and user info
      localStorage.setItem("token", mockResponse.token)
      localStorage.setItem("user", JSON.stringify(mockResponse.user))

      // Update state
      setToken(mockResponse.token)
      setUser(mockResponse.user)
      setIsAuthenticated(true)

      // Redirect to user dashboard
      router.push("/user")
    } catch (error) {
      console.error("Registration failed:", error)
      throw new Error("Registration failed. Please try again.")
    }
  }

  const logout = () => {
    // Clear local storage
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    // Reset state
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)

    // Redirect to login
    router.push("/login")
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
