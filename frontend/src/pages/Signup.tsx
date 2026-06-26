import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HexColorPicker } from 'react-colorful'
import { useAuth } from '../context/AuthContext'
import { Avatar } from '../components/Avatar'

export const Signup: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [favoriteColor, setFavoriteColor] = useState('#FF5C5C')
  const [error, setError] = useState('')
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    try {
      await signup({ username, password, favoriteColor })
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
          
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <Avatar 
              username={username || 'preview'} 
              favoriteColor={favoriteColor} 
              size={126}
            />
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
          <div className="auth-field">
            <label className="auth-label">Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)}
              className="auth-input"
              required
            />
          </div>
          <div className="auth-field" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label className="auth-label">Favorite Color</label>
            <HexColorPicker color={favoriteColor} onChange={setFavoriteColor} />
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
