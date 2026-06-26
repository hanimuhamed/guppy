import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Avatar } from '../components/Avatar'

export const Signup: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [favoriteColor, setFavoriteColor] = useState('#FF5C5C')
  const [leastFavoriteColor, setLeastFavoriteColor] = useState('#272a31')
  const [error, setError] = useState('')
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signup({ username, password, favoriteColor, leastFavoriteColor })
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Failed to sign up')
    }
  }

  return (
    <div className="app-shell auth-container">
      <div className="panel auth-panel" style={{ width: '450px' }}>
        <div className="panel-header auth-header">
          Create Account
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Avatar 
              username={username || 'preview'} 
              favoriteColor={favoriteColor} 
              leastFavoriteColor={leastFavoriteColor}
              size={63}
            />
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              This will be your procedurally generated avatar.
            </div>
          </div>

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
          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="auth-field" style={{ flex: 1 }}>
              <label className="auth-label">Favorite Color</label>
              <input 
                type="color" 
                value={favoriteColor} 
                onChange={e => setFavoriteColor(e.target.value)}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>
            <div className="auth-field" style={{ flex: 1 }}>
              <label className="auth-label">Least Favorite Color</label>
              <input 
                type="color" 
                value={leastFavoriteColor} 
                onChange={e => setLeastFavoriteColor(e.target.value)}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>
          </div>
          
          <button type="submit" className="auth-submit" style={{ marginTop: '8px' }}>
            Sign Up
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: '16px' }}>
          <span>Already have an account? </span>
          <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
        </div>
        <div className="auth-footer" style={{ marginTop: '8px' }}>
          <Link to="/">Return to Home</Link>
        </div>
      </div>
    </div>
  )
}
