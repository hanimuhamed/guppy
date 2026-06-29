import React, { createContext, useContext, useEffect, useState } from 'react'
import { api, clearAuthToken, getAuthToken, setAuthToken, getCachedUser, setCachedUser, clearCachedUser } from '../api/client'
import type { User } from '../api/client'
import { clearSaveState } from '../storage/saveSystem'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (data: any) => Promise<void>
  signup: (data: any) => Promise<void>
  logout: () => void
  updateUser: (data: { username?: string, favoriteColor?: string }) => Promise<void>
  deleteAccount: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getCachedUser())
  const loading = false

  useEffect(() => {
    const token = getAuthToken()
    if (token) {
      api.getMe()
        .then(u => {
          setUser(u)
          setCachedUser(u)
        })
        .catch(() => {
          clearAuthToken()
          clearCachedUser()
          setUser(null)
        })
    }
  }, [])

  const login = async (data: any) => {
    const res = await api.login(data)
    setAuthToken(res.token)
    setCachedUser(res.user)
    setUser(res.user)
  }

  const signup = async (data: any) => {
    const res = await api.signup(data)
    setAuthToken(res.token)
    setCachedUser(res.user)
    setUser(res.user)
  }

  const logout = () => {
    clearAuthToken()
    clearCachedUser()
    clearSaveState()
    setUser(null)
  }

  const updateUser = async (data: { username?: string, favoriteColor?: string }) => {
    const updatedUser = await api.updateMe(data)
    setCachedUser(updatedUser)
    setUser(updatedUser)
  }

  const deleteAccount = async () => {
    await api.deleteMe()
    logout()
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser, deleteAccount }}>
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
