type WorldsListProps = {
  currentWorld: number
  onWorldChange: (world: number) => void
}

const WORLD_COUNT = 10

const WorldsList = ({ currentWorld, onWorldChange }: WorldsListProps) => {
  return (
    <aside className="worlds-list panel" aria-label="Worlds">
      <hr/>
      {Array.from({ length: WORLD_COUNT }, (_, index) => {
        const world = index + 1
        return (
          <button
            key={world}
            type="button"
            className={`world-button${currentWorld === world ? ' active' : ''}`}
            onClick={() => onWorldChange(world)}
          >
            World {world}
          </button>
        )
      })}
      <hr/>
    </aside>
  )
}

export default WorldsList
