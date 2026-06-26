import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import type { LevelDefinition } from '../game/types'
import { useProgress } from '../context/ProgressContext'

interface LevelDrawerProps {
  worldLevels: LevelDefinition[]
  worldIndex: number
  activeLevelId: string
  isOpen: boolean
  onClose: () => void
}

export const LevelDrawer: React.FC<LevelDrawerProps> = ({
  worldLevels,
  worldIndex,
  activeLevelId,
  isOpen,
  onClose
}) => {
  const { progress } = useProgress()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div 
      ref={ref}
      className="panel level-drawer-dropdown"
      style={{
        left: '50%',
        transform: 'translateX(-50%)',
        maxHeight: '400px',
        overflowY: 'auto'
      }}
    >
      <div className="panel-header level-drawer-header">
        World {worldIndex} Levels
      </div>
      <div className="level-drawer-list">
        {worldLevels.map((level) => {
          const isSolved = progress.completedLevels.includes(level.id)
          const isAttempted = !!progress.levelCode[level.id]
          const isActive = level.id === activeLevelId
          
          let iconClass = 'color-text-muted'
          if (isSolved) iconClass = 'color-success'
          else if (isAttempted) iconClass = 'color-accent'

          return (
            <Link
              key={level.id}
              to={`/level/${level.id}`}
              onClick={onClose}
              className="level-drawer-item"
              style={{
                color: isActive ? 'var(--text)' : 'var(--text-muted)',
                backgroundColor: isActive ? 'var(--surface)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <span className={iconClass}>■</span>
              <span style={{ fontWeight: isActive ? 'bold' : 'normal' }}>{level.title}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
