import type { LevelDefinition } from '../game/types'

type LevelListProps = {
  levels: LevelDefinition[]
  activeId: string
  completed: Set<string>
  unlocked: Set<string>
  onSelect: (id: string) => void
}

const LevelList = ({ levels, activeId, completed, unlocked, onSelect }: LevelListProps) => {
  return (
    <div className="level-row">
      {levels.map((level, index) => {
        const isActive = level.id === activeId
        const isComplete = completed.has(level.id)
        const isUnlocked = unlocked.has(level.id)
        return (
          <button
            key={level.id}
            type="button"
            className={`level-pill${isActive ? ' active' : ''}${isComplete ? ' done' : ''}${!isUnlocked ? ' locked' : ''}`}
            onClick={() => onSelect(level.id)}
            disabled={!isUnlocked}
            title={level.title}
          >
            {index + 1}
          </button>
        )
      })}
    </div>
  )
}

export default LevelList
