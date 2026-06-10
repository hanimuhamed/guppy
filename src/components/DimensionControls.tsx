type DimensionControlsProps = {
  width: number
  height: number
  minWidth: number
  maxWidth: number
  minHeight: number
  maxHeight: number
  step: number
  onWidthChange: (value: number) => void
  onHeightChange: (value: number) => void
}

const DimensionControls = ({
  width,
  height,
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
  step,
  onWidthChange,
  onHeightChange,
}: DimensionControlsProps) => {

  return (
    <div className="dimension-controls">
      <div className="section-title">Dimensions</div>
      <div className="dimension-row">
        <div className="slider-row">
          <label htmlFor="width-slider">W: {width}</label>
          <input
            id="slider"
            type="range"
            min={minWidth}
            max={maxWidth}
            step={step}
            value={width}
            onChange={(event) => onWidthChange(Number(event.target.value))}
          />
        </div>
        <div className="slider-row">
          <label htmlFor="height-slider">H: {height}</label>
          <input
            id="slider"
            type="range"
            min={minHeight}
            max={maxHeight}
            step={step}
            value={height}
            onChange={(event) => onHeightChange(Number(event.target.value))}
          />
        </div>
      </div>
    </div>
  )
}

export default DimensionControls
