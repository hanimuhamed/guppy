import type React from 'react'
import { useState } from 'react'

const HintItem = ({ hint }: { hint: { id: number; description: React.ReactNode } }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className={`hint${open ? ' hint--open' : ''}`}>
      <button className="hint-header" onClick={() => setOpen((prev) => !prev)}>
        <span>Hint {hint.id}</span>
        <span className={`hint-chevron${open ? ' hint-chevron--up' : ''}`}>⏷</span>
      </button>
      {open && (
        <div className="hint-body">{hint.description}</div>
      )}
    </div>
  )
}

export default HintItem