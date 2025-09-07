"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import { api } from "@/lib/api"
import { getCookie, setCookie, deleteCookie, setAuthCookies, clearAuthCookies, getUserName, getUserEmail } from "@/lib/cookies"

export interface User {
  id: string
  name: string
  email: string
  phone_number: string
  is_active: boolean
  date_joined: string
  avatar?: string
  status: "online" | "offline" | "away"
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "CLEAR_ERROR" }

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true, error: null }
    
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }
    
    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      }
    
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      }
    
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    
    case "CLEAR_ERROR":
      return { ...state, error: null }
    
    default:
      return state
  }
}

interface AuthContextType {
  state: AuthState
  login: (email: string, password: string) => Promise<void>
  signup: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)


  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = getCookie("access_token")
      const refreshToken = getCookie("refresh_token")
      const userId = getCookie("user_id")
      
      if (accessToken) {
        try {
          // Validate token with backend
          const response = await api.getCurrentUser()
          
          if (response.ok) {
            const userData = await response.json()
            
            // Ensure user details are stored in cookies (in case they were missing)
            if (!userId && userData.id) {
              setCookie("user_id", userData.id, 7)
            }
            if (userData.name) {
              setCookie("user_name", userData.name, 7)
            }
            if (userData.email) {
              setCookie("user_email", userData.email, 7)
            }
            
            const user: User = {
              id: userData.id, // This should be the user ID from the API
              name: userData.name,
              email: userData.email || "",
              phone_number: userData.phone_number || "",
              is_active: userData.is_active,
              date_joined: userData.date_joined,
              status: "online" as const,
            }
            dispatch({ type: "LOGIN_SUCCESS", payload: user })
          } else {
            // No valid tokens, clear cookies
            clearAuthCookies()
          }
        } catch (error) {
          console.error("Auth check failed:", error)
          
          // If we have a user ID in cookies, try to restore user state from cookies
          if (userId) {
            console.log("Attempting to restore user state from cookies")
            const userName = getUserName()
            const userEmail = getUserEmail()
            
            const user: User = {
              id: userId,
              name: userName || "User", // Use stored name or fallback
              email: userEmail || "", // Use stored email or fallback
              phone_number: "",
              is_active: true,
              date_joined: new Date().toISOString(),
              status: "online" as const,
            }
            dispatch({ type: "LOGIN_SUCCESS", payload: user })
          } else {
            clearAuthCookies()
          }
        }
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    dispatch({ type: "LOGIN_START" })
    
    try {
      const response = await api.login(email, password)

      if (response.ok) {
        const data = await response.json()
        
        // Store tokens and user ID in cookies
        setAuthCookies(data.access, data.refresh, data.id, { name: data.name, email: data.email })
        
        // Create user object from API response
        const user: User = {
          id: data.id, // Use the actual id from the API response
          name: data.name,
          email: data.email,
          phone_number: data.phone_number,
          is_active: data.is_active,
          date_joined: data.date_joined,
          status: "online",
        }
        
        dispatch({ type: "LOGIN_SUCCESS", payload: user })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Login failed")
      }
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", payload: error instanceof Error ? error.message : "Login failed" })
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    dispatch({ type: "LOGIN_START" })
    
    try {
      const response = await api.register(name, email, password, "None")

      if (response.ok) {
        const data = await response.json()
        
        // After successful registration, automatically log in
        await login(email, password)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Registration failed")
      }
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", payload: error instanceof Error ? error.message : "Registration failed" })
    }
  }

  const logout = () => {
    clearAuthCookies()
    dispatch({ type: "LOGOUT" })
  }

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" })
  }

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        signup,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

