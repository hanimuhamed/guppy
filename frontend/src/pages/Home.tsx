import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { worlds } from '../game/worlds'
import { LevelCard } from '../components/LevelCard'
import { Avatar } from '../components/Avatar'
import { useAuth } from '../context/AuthContext'
import { useProgress } from '../context/ProgressContext'
import CanvasPanel from '../components/CanvasPanel'
import EditorPanel from '../components/EditorPanel'
import DimensionControls from '../components/DimensionControls'
import { runLevelCode } from '../runtime/runner'
import { PixelBuffer } from '../engine/pixelBuffer'

export const Home: React.FC = () => {
  const { user, logout } = useAuth()
  const { progress } = useProgress()

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

  const statsData = [
    { label: 'Easy', count: easyCount, total: totalEasy, colorClass: 'difficulty-pill--easy', bgClass: 'var(--success)' },
    { label: 'Medium', count: mediumCount, total: totalMedium, colorClass: 'difficulty-pill--medium', bgClass: 'var(--accent)' },
    { label: 'Hard', count: hardCount, total: totalHard, colorClass: 'difficulty-pill--hard', bgClass: 'var(--danger)' },
    { label: 'Extreme', count: extremeCount, total: totalExtreme, colorClass: 'difficulty-pill--extreme', bgClass: 'var(--extreme)' },
  ]
  
  const appName = 'guppy'
  const appLogo = (
    <h1 style={{fontSize: '48px'}}>
      <span className='color-primary'>■</span><span className='color-accent'>▪</span>{appName}
    </h1>
  )

  const [exampleCode, setExampleCode] = useState(`def solve(width, height):\n    # Let's draw a smiley face!\n    cx, cy = width // 2, height // 2\n    r = min(width, height) // 2 - 1\n    \n    for y in range(height):\n        for x in range(width):\n            dx, dy = x - cx, y - cy\n            dist_sq = dx*dx + dy*dy\n            \n            # Face background\n            if dist_sq <= r*r:\n                setPixel(x, y, '#FBBF24')\n                \n            # Eyes\n            if y == cy - r//3 and abs(dx) == r//3:\n                setPixel(x, y, '#1F2937')\n                \n            # Smile\n            if y == cy + r//3 and abs(dx) <= r//3 and y > cy:\n                setPixel(x, y, '#1F2937')\n`)
  const [exampleWidth, setExampleWidth] = useState(11)
  const [exampleHeight, setExampleHeight] = useState(11)
  const [exampleOutput, setExampleOutput] = useState<PixelBuffer | null>(null)
  const [exampleError, setExampleError] = useState<string | null>(null)
  const [isExampleRunning, setIsExampleRunning] = useState(false)

  useEffect(() => {
    const handle = window.setTimeout(async () => {
      setIsExampleRunning(true)
      try {
        const out = await runLevelCode(exampleCode, exampleWidth, exampleHeight)
        setExampleOutput(out)
        setExampleError(null)
      } catch (err: any) {
        setExampleError(err.message)
      } finally {
        setIsExampleRunning(false)
      }
    }, 500)
    return () => window.clearTimeout(handle)
  }, [exampleCode, exampleWidth, exampleHeight])

  return (
    <div className="app-shell home-container">
      <aside className="panel home-sidebar">
        <div className="home-profile-section">
          {user ? (
            <>
              <Avatar 
                username={user.username} 
                favoriteColor={user.favoriteColor} 
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
                username="Guest" 
                size={126} 
              />
              <h2 className="home-username">Guest</h2>
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

        
      </aside>

      <main className="home-main">
        <header className="app-header">
          {appLogo}
        </header>
        <section className="about-section">
          <hr className="home-divider" />
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
          <hr className="home-divider" />
          <h2><span className='color-primary'>■</span> How to Play</h2>
          <ul style={{ listStyleType: 'disc', paddingLeft: '24px' }}>
            <li>Open a level and study the target image.</li>
            <li>Write Python code to recreate it.</li>
            <li>Test your solution across different canvas dimensions.</li>
            <li>Pass the level by producing the correct output for every valid size.</li>
          </ul>
          <hr className="home-divider" />
          <h2><span className='color-primary'>■</span> Try it Out!</h2>
          <p style={{ color: 'var(--text)', marginBottom: '16px' }}>
            Edit the Python code below to see how it affects the canvas instantly.
          </p>
          <div className="main-split" style={{gap: '16px', height: '420px', paddingTop: '16px'}}>
            <section className="left-panel" style={{ width: '40%', border: '2px solid var(--border)', background: 'var(--panel)'}}>
              <div className="left-panel-inner"  >
                <div className="section">
                  <CanvasPanel 
                    title="Live Output"
                    buffer={exampleOutput}
                    embedded
                  />
                </div>
                <hr/>
                <DimensionControls
                  width={exampleWidth}
                  height={exampleHeight}
                  minWidth={3}
                  maxWidth={25}
                  minHeight={3}
                  maxHeight={25}
                  step={2}
                  onWidthChange={w => setExampleWidth(w)}
                  onHeightChange={h => setExampleHeight(h)}
                />
              </div>
            </section>
            <section className="right-panel">
              <EditorPanel
                code={exampleCode}
                onChange={v => setExampleCode(v || '')}
                isRunning={isExampleRunning}
                status={exampleError ? 'error' : (isExampleRunning ? 'running' : 'idle')}
                message={exampleError ? 'Python error' : 'Ready'}
                modelPath="example"
                errorMessage={exampleError}
                onReset={() => {}}
                onRun={() => {}}
                fontSize={progress.codeFontSize || 14}
              />
            </section>
          </div>
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
