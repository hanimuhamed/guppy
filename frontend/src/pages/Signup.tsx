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
  const [showColorPicker, setShowColorPicker] = useState(false)
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
      navigate('/levels')
    } catch (err: any) {
      setError(err.message || 'Failed to sign up')
    }
  }

  return (
    <div className="app-shell auth-container">
      <div className="panel auth-panel" style={{ width: '800px', maxWidth: '90vw' }}>
        <div className="panel-header auth-header">
          Create Account
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form" style={{ display: 'flex', gap: '32px', flexDirection: 'row' }}>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Avatar 
              username={username || 'preview'} 
              favoriteColor={favoriteColor} 
              size={252}
            />
            <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Your Avatar</p>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
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
            <div className="auth-field" style={{ position: 'relative' }}>
              <label className="auth-label">Favorite Color</label>
              <div 
                style={{ width: '100%', height: '40px', backgroundColor: favoriteColor, border: '2px solid var(--border)', cursor: 'pointer', borderRadius: '0px' }}
                onClick={() => setShowColorPicker(!showColorPicker)}
              />
              {showColorPicker && (
                <div style={{ position: 'absolute', bottom: '100%', left: 0, zIndex: 10, marginBottom: '8px' }}>
                  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }} onClick={() => setShowColorPicker(false)} />
                  <div style={{ position: 'relative' }}>
                    <HexColorPicker color={favoriteColor} onChange={setFavoriteColor} />
                  </div>
                </div>
              )}
            </div>
            <button type="submit" className="auth-submit" style={{ marginTop: '32px' }}>
              Sign Up
            </button>
            <div className="auth-footer" style={{ marginTop: '16px', textAlign: 'left' }}>
              <span>Already have an account? </span>
              <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
            </div>
            <div className="auth-footer" style={{ marginTop: '8px', textAlign: 'left' }}>
              <Link to="/levels">Return to Levels</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
