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
      <button
        type="button"
        className="level-nav-button"
        onClick={() => {
          const currentIndex = levels.findIndex((level) => level.id === activeId)
          onSelect(levels[Math.max(currentIndex - 1, 0)].id)
        }}
        disabled={activeId === levels[0].id}
        title="Previous level"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 5L5 10L10 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
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
      <button
        type="button"
        className="level-nav-button"
        onClick={() => {
          const currentIndex = levels.findIndex((level) => level.id === activeId)
          onSelect(levels[Math.min(currentIndex + 1, levels.length - 1)].id)
        }}
        disabled={activeId === levels[levels.length - 1].id}
        title="Next level"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 5L11 10L6 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  )
}

export default LevelList
