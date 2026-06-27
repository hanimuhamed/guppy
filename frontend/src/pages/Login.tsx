import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login({ username, password })
      navigate('/levels')
    } catch (err: any) {
      setError(err.message || 'Failed to login')
    }
  }

  return (
    <div className="app-shell auth-container">
      <div className="panel auth-panel">
        <div className="panel-header auth-header">
          Welcome Back
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              className="auth-input"
              required
            />
          </div>
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              className="auth-input"
              required
            />
          </div>
          
          <button type="submit" className="auth-submit" style={{ marginTop: '16px' }}>
            Login
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: '16px' }}>
          <span>Don't have an account? </span>
          <Link to="/signup" style={{ color: 'var(--primary)' }}>Sign up</Link>
        </div>
        <div className="auth-footer" style={{ marginTop: '8px' }}>
          <Link to="/levels">Return to Levels</Link>
        </div>
      </div>
    </div>
  )
}
