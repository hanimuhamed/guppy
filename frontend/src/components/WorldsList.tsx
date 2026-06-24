type WorldsListProps = {
  currentWorld: number
  onWorldChange: (world: number) => void
  style?: React.CSSProperties
}

const WORLD_NAMES = [
  'Basics',
  'Flags',
  '???',
]
const WorldsList = ({ currentWorld, onWorldChange, style }: WorldsListProps) => {
  return (
    <aside className="worlds-list panel" aria-label="Worlds" style={style}>
      <hr/>
      {Array.from({ length: WORLD_NAMES.length }, (_, index) => {
        const world = index + 1
        return (
          <button
            key={world}
            type="button"
            className={`world-button${currentWorld === world ? ' active' : ''}`}
            onClick={() => onWorldChange(world)}
          >
            {WORLD_NAMES[world - 1] || `???`}
          </button>
        )
      })}
      <hr/>
    </aside>
  )
}
export default WorldsList