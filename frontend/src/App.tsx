import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Profile } from './pages/Profile'
import { Levels } from './pages/Levels'
import { LevelPage } from './pages/LevelPage'
import { Terms } from './pages/Terms'
import { Privacy } from './pages/Privacy'
import { NotFound } from './pages/NotFound'
import { AuthProvider } from './context/AuthContext'
import { ProgressProvider } from './context/ProgressContext'
import './App.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/levels',
    element: <Levels />,
  },
  {
    path: '/levels/:id',
    element: <LevelPage />,
  },
  {
    path: '/terms',
    element: <Terms />,
  },
  {
    path: '/privacy',
    element: <Privacy />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

import { warmupPyWorker } from './runtime/runner'

import { API_BASE_URL } from './api/client'
import { useEffect } from 'react'

// Initialize Pyodide as early as possible
void warmupPyWorker()

function App() {
  useEffect(() => {
    // Ping the backend on initial load to wake up Render free tier instances
    fetch(`${API_BASE_URL}/health`).catch(() => {})
  }, [])

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy-client-id'}>
      <AuthProvider>
        <ProgressProvider>
          <RouterProvider router={router} />
        </ProgressProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}

export default App