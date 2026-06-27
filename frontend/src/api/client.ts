export const API_BASE_URL = 'http://localhost:8081/api'

export interface User {
  id: string
  username: string
  favoriteColor: string
  joinDate: string
}

export interface Progress {
  completedLevels: string[]
  levelCode: Record<string, string>
  levelDimensions: Record<string, { width: number; height: number }>
}

export const getAuthToken = () => localStorage.getItem('token')
export const setAuthToken = (token: string) => localStorage.setItem('token', token)
export const clearAuthToken = () => localStorage.removeItem('token')

const request = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    throw new Error(errData.error || `Request failed with status ${response.status}`)
  }

  return response.json()
}

export const api = {
  signup: (data: any): Promise<{ token: string, user: User }> => request('/auth/signup', { method: 'POST', body: JSON.stringify(data) }) as any,
  login: (data: any): Promise<{ token: string, user: User }> => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }) as any,
  getMe: (): Promise<User> => request('/users/me', { method: 'GET' }) as any,
  getProgress: (): Promise<Progress> => request('/progress', { method: 'GET' }) as any,
  saveProgress: (data: any): Promise<{ success: boolean }> => request('/progress', { method: 'POST', body: JSON.stringify(data) }) as any,
}
