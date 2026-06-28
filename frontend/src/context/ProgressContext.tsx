import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/client'
import type { Progress } from '../api/client'
import { useAuth } from './AuthContext'
import { loadSaveState, saveState } from '../storage/saveSystem'
import type { SaveState } from '../storage/saveSystem'

interface ProgressContextType {
  progress: SaveState
  updateLevelCode: (levelId: string, code: string) => void
  updateLevelDimensions: (levelId: string, dimensions: { width: number, height: number }) => void
  markLevelCompleted: (levelId: string) => void
  updateCurrentWorld: (world: number) => void
  updateActiveLevel: (levelId: string) => void
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading } = useAuth()
  const [progress, setProgress] = useState<SaveState>(loadSaveState())
  const [loading, setLoading] = useState(true)

  const prevUser = React.useRef(user)

  useEffect(() => {
    if (authLoading) return

    if (user) {
      api.getProgress().then((remoteProgress: Progress) => {
        setProgress(prev => {
          const newState = {
            ...prev,
            completedLevels: remoteProgress.completedLevels,
            levelCode: remoteProgress.levelCode,
            levelDimensions: remoteProgress.levelDimensions
          }
          saveState(newState)
          return newState
        })
      }).finally(() => setLoading(false))
    } else {
      if (prevUser.current) {
        setProgress(loadSaveState())
      }
      setLoading(false)
    }
    prevUser.current = user
  }, [user, authLoading])

  const persistChange = (newState: SaveState, levelId?: string, isComplete?: boolean) => {
    setProgress(newState)
    saveState(newState)
    if (user && levelId) {
      api.saveProgress({
        levelId,
        code: newState.levelCode[levelId] || '',
        dimensions: newState.levelDimensions[levelId] || { width: 5, height: 5 },
        completed: isComplete
      }).catch(console.error) // Optimistic update, ignore errors for now
    }
  }

  const updateLevelCode = (levelId: string, code: string) => {
    const newState = { ...progress, levelCode: { ...progress.levelCode, [levelId]: code } }
    persistChange(newState, levelId, false)
  }

  const updateLevelDimensions = (levelId: string, dimensions: { width: number, height: number }) => {
    const newState = { ...progress, levelDimensions: { ...progress.levelDimensions, [levelId]: dimensions } }
    persistChange(newState, levelId, false)
  }

  const markLevelCompleted = (levelId: string) => {
    if (progress.completedLevels.includes(levelId)) return
    const newState = { ...progress, completedLevels: [...progress.completedLevels, levelId] }
    persistChange(newState, levelId, true)
  }

  const updateCurrentWorld = (world: number) => {
    const newState = { ...progress, currentWorld: world }
    setProgress(newState)
    saveState(newState)
  }

  const updateActiveLevel = (levelId: string) => {
    const newState = { ...progress, activeLevelId: levelId }
    setProgress(newState)
    saveState(newState)
  }

  if (loading || authLoading) {
    return (
      <div style={{ display: 'flex', width: '100vw', height: '100vh', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '18px' }}>
        Loading...
      </div>
    )
  }

  return (
    <ProgressContext.Provider value={{
      progress,
      updateLevelCode,
      updateLevelDimensions,
      markLevelCompleted,
      updateCurrentWorld,
      updateActiveLevel
    }}>
      {children}
    </ProgressContext.Provider>
  )
}

export const useProgress = () => {
  const context = useContext(ProgressContext)
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider')
  }
  return context
}
