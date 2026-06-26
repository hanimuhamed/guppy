import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Profile } from './pages/Profile'
import { LevelPage } from './pages/LevelPage'
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
    path: '/level/:id',
    element: <LevelPage />,
  },
])

import { warmupPyWorker } from './runtime/runner'

// Initialize Pyodide as early as possible
void warmupPyWorker()

function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <RouterProvider router={router} />
      </ProgressProvider>
    </AuthProvider>
  )
}

export default App