import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HexColorPicker } from 'react-colorful'
import { useAuth } from '../context/AuthContext'
import { Avatar } from '../components/Avatar'
import { Footer } from '../components/Footer'
import { validateUsername } from '../utils/validation'

export const Profile: React.FC = () => {
  const { user, updateUser, deleteAccount, logout } = useAuth()
  const navigate = useNavigate()
  
  const [username, setUsername] = useState('')
  const [favoriteColor, setFavoriteColor] = useState('#FF5C5C')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  useEffect(() => {
    if (user) {
      setUsername(user.username)
      setFavoriteColor(user.favoriteColor)
    } else {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user) return null

  const handleUpdate = async () => {
    if (username !== user.username) {
      const validationError = validateUsername(username)
      if (validationError) {
        setError(validationError)
        return
      }
    }
    
    setError('')
    setSuccess('')
    setIsUpdating(true)
    try {
      await updateUser({ username, favoriteColor })
      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (deleteConfirmText !== user.username) {
      return
    }
    try {
      await deleteAccount()
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Failed to delete account')
      setShowDeleteModal(false)
    }
  }

  return (
    <div className="app-shell auth-container">
      <div className="panel auth-panel" style={{ width: '800px', maxWidth: '90vw', position: 'relative' }}>
        <div className="panel-header auth-header">
          Edit Profile
        </div>
        
        <div className="auth-form auth-form-split">
          
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
            
            <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              {error && <div className="auth-error" style={{ marginBottom: '16px' }}>{error}</div>}
              {success && <div style={{ color: 'var(--success)', marginBottom: '16px', fontSize: '14px' }}>{success}</div>}
              
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', opacity: username ? 1 : 0.5, transition: 'opacity 0.2s', gap: '12px' }}>
                <button 
                  type="button" 
                  className="auth-submit" 
                  onClick={handleUpdate}
                  disabled={isUpdating || !username}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: username ? 'pointer' : 'not-allowed' }}
                >
                  {isUpdating ? 'Updating...' : 'Update Profile'}
                </button>

                <button 
                  type="button" 
                  className="auth-submit" 
                  onClick={() => setShowDeleteModal(true)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', color: 'var(--danger)', cursor: 'pointer' }}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="auth-footer" style={{ marginTop: '8px', justifyContent: 'center' }}>
          <Link to="/levels">Return to Levels</Link>
        </div>
      </div>
      <Footer />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div className="panel auth-panel" style={{ width: '400px', maxWidth: '100%'}}>
            <div className="panel-header" style={{ color: 'var(--danger)', borderBottomColor: 'var(--danger)' }}>
              Danger Zone
            </div>
            <div style={{ marginTop: '24px' }}>
              <p style={{ color: 'var(--text)', marginBottom: '16px', fontSize: '14px', lineHeight: '1.5' }}>
                You are about to permanently delete your account. This action <strong>cannot be undone</strong> and all your progress will be lost.
              </p>
              <p style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '12px' }}>
                To confirm, type your username: <strong style={{color: 'var(--text)'}}>{user.username}</strong>
              </p>
              <input 
                type="text" 
                value={deleteConfirmText}
                onChange={e => setDeleteConfirmText(e.target.value)}
                className="auth-input"
                placeholder={user.username}
                style={{ marginBottom: '24px' }}
              />
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className="auth-submit" 
                  onClick={() => setShowDeleteModal(false)}
                  style={{ flex: 1, background: 'var(--surface)', color: 'var(--text-muted)', border: '2px solid var(--border)' }}
                  
                >
                  Cancel
                </button>
                <button 
                  className="auth-submit" 
                  onClick={handleDelete}
                  disabled={deleteConfirmText !== user.username}
                  style={{ flex: 1, opacity: deleteConfirmText === user.username ? 1 : 0.5, cursor: deleteConfirmText === user.username ? 'pointer' : 'not-allowed' }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
