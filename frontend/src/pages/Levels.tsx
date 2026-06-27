import React, { useState, useEffect, useRef } from 'react'
import { worlds } from '../game/worlds'
import { LevelCard } from '../components/LevelCard'
import { Avatar } from '../components/Avatar'
import { useAuth } from '../context/AuthContext'
import { useProgress } from '../context/ProgressContext'
import { Link } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { getWorldName } from '../constants/worlds'

export const Levels: React.FC = () => {
  const { user, logout } = useAuth()
  const { progress } = useProgress()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }
    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileMenuOpen])

  const allLevels = worlds.flat()
  const totalLevels = allLevels.length
  const completedLevels = progress.completedLevels.length
  const attemptedLevels = Object.keys(progress.levelCode).length
  const completionPercentage = totalLevels === 0 ? 0 : Math.round((completedLevels / totalLevels) * 100)
  const successRate = attemptedLevels === 0 ? 0 : Math.round((completedLevels / attemptedLevels) * 100)

  let easyCount = 0, mediumCount = 0, hardCount = 0, extremeCount = 0
  let totalEasy = 0, totalMedium = 0, totalHard = 0, totalExtreme = 0
  
  allLevels.forEach(l => {
    if (l.difficulty === 'Easy') totalEasy++
    else if (l.difficulty === 'Medium') totalMedium++
    else if (l.difficulty === 'Hard') totalHard++
    else if (l.difficulty === 'Extreme') totalExtreme++
  })
  progress.completedLevels.forEach(id => {
    const level = allLevels.find(l => l.id === id)
    if (level) {
      if (level.difficulty === 'Easy') easyCount++
      else if (level.difficulty === 'Medium') mediumCount++
      else if (level.difficulty === 'Hard') hardCount++
      else if (level.difficulty === 'Extreme') extremeCount++
    }
  })

  const handleLogin = () => {
    window.location.href = '/login'
  }

  const handleSignup = () => {
    window.location.href = '/signup'
  }

  const statsData = [
    { label: 'Easy', count: easyCount, total: totalEasy, colorClass: 'difficulty-pill--easy', bgClass: 'var(--success)' },
    { label: 'Medium', count: mediumCount, total: totalMedium, colorClass: 'difficulty-pill--medium', bgClass: 'var(--accent)' },
    { label: 'Hard', count: hardCount, total: totalHard, colorClass: 'difficulty-pill--hard', bgClass: 'var(--danger)' },
    { label: 'Extreme', count: extremeCount, total: totalExtreme, colorClass: 'difficulty-pill--extreme', bgClass: 'var(--extreme)' },
  ]
  
  const appName = 'guppy'
  const appLogo = (
    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
      <h1 style={{fontSize: '32px'}}>
        <span className='color-primary'>■</span><span className='color-accent'>▪</span>{appName}
      </h1>
    </Link>
  )

  const renderProfileContent = () => (
    <>
      <div className="home-profile-section">
        {user ? (
          <>
            <Avatar 
              username={user.username} 
              favoriteColor={user.favoriteColor} 
              size={147} 
            />
            <h2 className="home-username">{user.username}</h2>
            <div className="home-guest-actions">
              <button className="ghost-button home-logout-btn" onClick={logout}>
                signOut()
              </button>
            </div>
          </>
        ) : (
          <>
            <Avatar 
              username="Guest" 
              size={147} 
            />
            <h2 className="home-username">Ghost</h2>
            <div className="home-guest-actions">
              <button className="ghost-button home-guest-login" onClick={handleLogin}>
                login()
              </button>
              <button className="ghost-button home-guest-signup" onClick={handleSignup}>
                signUp()
              </button>
            </div>
          </>
        )}
      </div>

      <hr className="progress-divider" />

      <div className="home-stats-section">
        <div className="home-stats-header">
          <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Total Progress</span>
          <span style={{ fontSize: '12px'}}>{completionPercentage}%</span>
        </div>
        <div className="home-progress-bar-container">
          <div className="home-progress-bar-fill" style={{ width: `${completionPercentage}%` }} />
        </div>

        <div className="home-stats-list">
          {statsData.map(stat => (
            <div key={stat.label}>
              <div className="home-stat-row">
                <span className={stat.colorClass}>{stat.label}</span>
                <span className="home-stat-value">{stat.count} / {stat.total}</span>
              </div>
              <div className="home-progress-bar-container home-progress-bar-container--secondary">
                <div 
                  className="home-progress-bar-fill" 
                  style={{ 
                    width: `${stat.total === 0 ? 0 : (stat.count / stat.total) * 100}%`, 
                    backgroundColor: stat.bgClass,
                    height: '12px',
                  }} 
                />
              </div>
            </div>
          ))}
          <div className="home-stat-row" style={{ marginTop: '8px' }}>
            <span className="home-stat-label">Success Rate</span>
            <span className="home-stat-value">{successRate}%</span>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <div className="app-shell home-container">
      <aside className="panel home-sidebar">
        {renderProfileContent()}
      </aside>

      <main className="home-main">
        <header className="app-header-sticky" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <header className="app-header">
            <div>
              {appLogo}
            </div>
          </header>
          <div className="mobile-only" style={{ position: 'relative' }} ref={menuRef}>
            <button 
              className="ghost-button" 
              style={{ padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            >
              <Avatar username={user ? user.username : 'Guest'} favoriteColor={user?.favoriteColor} size={35} />
            </button>
            {isProfileMenuOpen && (
              <div className="mobile-profile-dropdown">
                {renderProfileContent()}
              </div>
            )}
          </div>
        </header>
        {worlds.map((worldLevels, index) => {
          if (!worldLevels || worldLevels.length === 0) return null;
          return (
            <section key={index}>
              <hr className="home-divider" />
              <h2 className="panel-header home-world-header">{getWorldName(index)}</h2>
              <div className="home-world-grid">
                {worldLevels.map((level) => (
                  <LevelCard
                    key={level.id}
                    level={level}
                    worldIndex={index + 1}
                  />
                ))}
              </div>
            </section>
          )
        })}
        <hr className="home-divider" />
        <Footer/>
      </main>
    </div>
  )
}
