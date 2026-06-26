import React from 'react'
import { Link } from 'react-router-dom'
import { worlds } from '../game/worlds'
import { LevelCard } from '../components/LevelCard'
import { Avatar } from '../components/Avatar'
import { useAuth } from '../context/AuthContext'
import { useProgress } from '../context/ProgressContext'

export const Home: React.FC = () => {
  const { user, logout } = useAuth()
  const { progress } = useProgress()

  const totalLevels = worlds.reduce((acc, w) => acc + w.length, 0)
  const completedLevels = progress.completedLevels.length
  const completionPercentage = totalLevels === 0 ? 0 : Math.round((completedLevels / totalLevels) * 100)
  const appName = 'guppy'
  const appLogo = (
    <h1 style={{fontSize: '48px'}}>
      <span className='color-primary'>■</span><span className='color-accent'>▪</span>{appName}
    </h1>
  )

  return (
    <div className="app-shell home-container">
      <aside className="panel home-sidebar">
        <div className="home-profile-section">
          {user ? (
            <>
              <Avatar 
                username={user.username} 
                favoriteColor={user.favoriteColor} 
                leastFavoriteColor={user.leastFavoriteColor} 
                size={126} 
              />
              <h2 className="home-username">{user.username}</h2>
              <button className="ghost-button home-logout-btn" onClick={logout}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Avatar 
                username="Guest User" 
                size={126} 
              />
              <h2 className="home-username">Guest User</h2>
              <div className="home-guest-actions">
                <Link to="/login" className="ghost-button home-guest-login">Login</Link>
                <Link to="/signup" className="ghost-button home-guest-signup">Signup</Link>
              </div>
            </>
          )}
        </div>

        <hr className="home-divider" />

        <div className="home-stats-section">
          <div className="home-stats-header">
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Total Progress</span>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{Math.round(completionPercentage)}%</span>
          </div>
          <div className="home-progress-bar-container">
            <div className="home-progress-bar-fill" style={{ width: `${completionPercentage}%` }} />
          </div>
        </div>

        
      </aside>

      <main className="home-main">
        <header className="app-header">
          {appLogo}
        </header>
        <section className="about-section">
          <h2><span className='color-primary'>■</span> What is <code>
              <span style={{color: '#f1fa8c'}}>'guppy'</span>
            </code></h2>
          <p>
            <code>
              <span style={{color: '#f1fa8c'}}>'guppy'</span>
            </code> is a programming puzzle game where you recreate pixel art by
            writing <a style={{ color: 'var(--primary)', textDecoration: 'underline' }} href="https://docs.python.org/3/" target="_blank" rel="noopener noreferrer">Python</a> code.<br/>
            The target images change with the canvas dimensions, so your solutions 
            must work for any valid size.<br/>
            Use the built-in function <code>setPixel
              <span style={{color: 'var(--accent)'}}>(</span>
              x, y, 
              <span style={{color: '#f1fa8c'}}>'#RRGGBB'</span>
              <span style={{color: 'var(--accent)'}}>)</span>
            </code> to 
            set the color of a pixel at coordinates <code>
              <span style={{color: 'var(--accent)'}}>(</span>
              x, y
              <span style={{color: 'var(--accent)'}}>)</span>
            </code>.
          </p>
          <h2><span className='color-primary'>■</span> How to Play</h2>
          <ul style={{ listStyleType: 'disc', paddingLeft: '24px' }}>
            <li>Open a level and study the target image.</li>
            <li>Write Python code to recreate it.</li>
            <li>Test your solution across different canvas dimensions.</li>
            <li>Pass the level by producing the correct output for every valid size.</li>
          </ul>
        </section>
        {worlds.map((worldLevels, index) => {
          if (!worldLevels || worldLevels.length === 0) return null;
          return (
            <section key={index}>
              <hr className="home-divider" />
              <h2 className="panel-header home-world-header">World {index + 1}</h2>
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
      </main>
    </div>
  )
}
