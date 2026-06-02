import { useEffect, useRef, useState } from 'react'

type DimensionControlsProps = {
  width: number
  height: number
  minWidth: number
  maxWidth: number
  minHeight: number
  maxHeight: number
  onWidthChange: (value: number) => void
  onHeightChange: (value: number) => void
}

/** Animate a displayed number toward a target using lerp on rAF */
function useLerpValue(target: number, speed = 0.18) {
  const [display, setDisplay] = useState(target)
  const rafRef = useRef<number | null>(null)
  const currentRef = useRef(target)

  useEffect(() => {
    const animate = () => {
      const diff = target - currentRef.current
      if (Math.abs(diff) < 0.5) {
        currentRef.current = target
        setDisplay(target)
        return
      }
      currentRef.current = currentRef.current + diff * speed
      setDisplay(Math.round(currentRef.current))
      rafRef.current = requestAnimationFrame(animate)
    }

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [target, speed])

  return display
}

const DimensionControls = ({
  width,
  height,
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
  onWidthChange,
  onHeightChange,
}: DimensionControlsProps) => {
  const displayWidth = useLerpValue(width)
  const displayHeight = useLerpValue(height)

  return (
    <div className="dimension-controls">
      <div className="section-title">Dimensions</div>
      <div className="dimension-row">
        <div className="slider-row">
          <label htmlFor="width-slider">
            W <span className="slider-value">{displayWidth}</span>
          </label>
          <input
            id="width-slider"
            type="range"
            min={minWidth}
            max={maxWidth}
            value={width}
            onChange={(event) => onWidthChange(Number(event.target.value))}
          />
        </div>
        <div className="slider-row">
          <label htmlFor="height-slider">
            H <span className="slider-value">{displayHeight}</span>
          </label>
          <input
            id="height-slider"
            type="range"
            min={minHeight}
            max={maxHeight}
            value={height}
            onChange={(event) => onHeightChange(Number(event.target.value))}
          />
        </div>
      </div>
    </div>
  )
}

export default DimensionControls
