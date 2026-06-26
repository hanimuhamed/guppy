import React, { createContext, useContext, useEffect, useState } from 'react'
import { api, clearAuthToken, getAuthToken, setAuthToken } from '../api/client'
import type { User } from '../api/client'
import { clearSaveState } from '../storage/saveSystem'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (data: any) => Promise<void>
  signup: (data: any) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getAuthToken()
    if (token) {
      api.getMe()
        .then(setUser)
        .catch(() => clearAuthToken())
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (data: any) => {
    const res = await api.login(data)
    setAuthToken(res.token)
    setUser(res.user)
  }

  const signup = async (data: any) => {
    const res = await api.signup(data)
    setAuthToken(res.token)
    setUser(res.user)
  }

  const logout = () => {
    clearAuthToken()
    clearSaveState()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
