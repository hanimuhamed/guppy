type ControlsProps = {
  onRun: () => void
  onReset: () => void
  isRunning: boolean
}

const Controls = ({ onRun, onReset, isRunning }: ControlsProps) => {
  return (
    <div className="controls">
      <button type="button" className="btn primary" onClick={onRun} disabled={isRunning}>
        Run
      </button>
      <button type="button" className="btn" onClick={onReset} disabled={isRunning}>
        Reset
      </button>
    </div>
  )
}

export default Controls
