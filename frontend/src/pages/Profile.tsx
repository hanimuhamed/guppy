import React, { useMemo } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useProgress } from '../context/ProgressContext'
import { Avatar } from '../components/Avatar'
import { worlds } from '../game/worlds'
import { getWorldName } from '../constants/worlds'

export const Profile: React.FC = () => {
  const { user } = useAuth()
  const { progress } = useProgress()

  const stats = useMemo(() => {
    let totalLevels = 0
    let totalSolved = 0
    const difficultyStats: Record<string, { total: number, solved: number }> = {
      easy: { total: 0, solved: 0 },
      medium: { total: 0, solved: 0 },
      hard: { total: 0, solved: 0 }
    }
    const worldStats: { total: number, solved: number }[] = []

    worlds.forEach((worldLevels) => {
      let worldTotal = 0
      let worldSolved = 0

      worldLevels.forEach(level => {
        const difficulty = level.difficulty || 'easy'
        if (!difficultyStats[difficulty]) {
          difficultyStats[difficulty] = { total: 0, solved: 0 }
        }
        
        totalLevels++
        worldTotal++
        difficultyStats[difficulty].total++

        if (progress.completedLevels.includes(level.id)) {
          totalSolved++
          worldSolved++
          difficultyStats[difficulty].solved++
        }
      })

      if (worldLevels.length > 0) {
        worldStats.push({ total: worldTotal, solved: worldSolved })
      }
    })

    const completionPercentage = totalLevels === 0 ? 0 : Math.round((totalSolved / totalLevels) * 100)

    return { totalLevels, totalSolved, completionPercentage, difficultyStats, worldStats }
  }, [progress.completedLevels])

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const joinDate = new Date(user.joinDate).toLocaleDateString()

  return (
    <div className="app-shell" style={{ overflowY: 'auto', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '32px', paddingTop: '32px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Avatar 
              username={user.username} 
              favoriteColor={user.favoriteColor} 
              size={98} 
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <h1 style={{ margin: 0, fontSize: '32px' }}>{user.username}</h1>
              <span style={{ color: 'var(--text-muted)' }}>Joined {joinDate}</span>
            </div>
          </div>
          <Link to="/levels" className="ghost-button" style={{ border: '1px solid var(--border)' }}>Back to Levels</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
          
          {/* Left Column - Overall & Difficulty Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="panel" style={{ alignItems: 'center', padding: '24px' }}>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Completion</div>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--success)' }}>
                {stats.completionPercentage}%
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                {stats.totalSolved} / {stats.totalLevels} Solved
              </div>
            </div>

            <div className="panel">
              <div className="panel-header" style={{ marginBottom: '16px' }}>Difficulty</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {['easy', 'medium', 'hard'].map(diff => {
                  const stat = stats.difficultyStats[diff]
                  if (stat.total === 0) return null
                  const perc = Math.round((stat.solved / stat.total) * 100)
                  const colors: any = { easy: 'var(--success)', medium: 'var(--accent)', hard: 'var(--danger)' }
                  return (
                    <div key={diff} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                        <span style={{ textTransform: 'capitalize', color: colors[diff] }}>{diff}</span>
                        <span>{stat.solved} / {stat.total}</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'var(--surface)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${perc}%`, background: colors[diff] }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column - World Progress */}
          <div className="panel" style={{ gridColumn: '2' }}>
            <div className="panel-header" style={{ marginBottom: '16px' }}>World Progress</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {stats.worldStats.map((world, index) => {
                const perc = Math.round((world.solved / world.total) * 100)
                return (
                  <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span>{getWorldName(index)}</span>
                      <span>{world.solved} / {world.total}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'var(--surface)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${perc}%`, background: perc === 100 ? 'var(--success)' : 'var(--primary)' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
