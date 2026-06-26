import React from 'react'
import { Link } from 'react-router-dom'
import type { LevelDefinition } from '../game/types'
import { generateLevelThumbnail } from '../utils/thumbnail'
import { useProgress } from '../context/ProgressContext'

interface LevelCardProps {
  level: LevelDefinition
  worldIndex: number
}

export const LevelCard: React.FC<LevelCardProps> = ({ level }) => {
  const { progress } = useProgress()
  const isSolved = progress.completedLevels.includes(level.id)
  const isAttempted = !!progress.levelCode[level.id]
  const thumbnailDataUrl = React.useMemo(() => generateLevelThumbnail(level), [level])

  let statusColor = 'var(--text-muted)'
  let statusText = ''
  if (isSolved) {
    statusColor = 'var(--success)'
    statusText = 'Solved'
  } else if (isAttempted) {
    statusColor = 'var(--accent)'
    statusText = 'Attempted'
  }

  // derive difficulty styling, fallback to a default if not fully specified in LevelDefinition
  const difficulty = level.difficulty || 'easy'
  const diffColors: Record<string, string> = {
    easy: 'var(--success)',
    medium: 'var(--accent)',
    hard: 'var(--danger)'
  }

  return (
    <Link 
      to={`/levels/${level.id}`} 
      className="panel level-card"
    >
      <div 
        className="level-card-image"
        style={{
          backgroundImage: `url(${thumbnailDataUrl})`
        }}
      />
      
      <div className="level-card-content">
        <h3 className="level-card-title">{level.title}</h3>
        
        <div className="level-card-footer">
          <span className={`difficulty-pill difficulty-pill--${difficulty.toLowerCase()}`} style={{ color: diffColors[difficulty], borderColor: diffColors[difficulty] }}>
            {difficulty}
          </span>
          <span className="level-card-status" style={{ color: statusColor }}>
            {statusText}
          </span>
        </div>
      </div>
    </Link>
  )
}
