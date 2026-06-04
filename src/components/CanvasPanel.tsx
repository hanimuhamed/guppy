// CanvasPanel.tsx
import { useEffect, useMemo, useRef, useState } from 'react'
import { PixelBuffer } from '../engine/pixelBuffer'
import { renderBufferToCanvas } from '../engine/canvasRenderer'

type CanvasPanelProps = {
  title: string
  buffer: PixelBuffer | null
  embedded?: boolean
}

const CANVAS_PADDING = 12

type HoverInfo = {
  x: number
  y: number
  hex: string
  left: number
  top: number
}

const CanvasPanel = ({ title, buffer, embedded = false }: CanvasPanelProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const shellRef = useRef<HTMLDivElement | null>(null)
  const [shellSize, setShellSize] = useState({ width: 0, height: 0 })
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null)
  const [copied, setCopied] = useState(false)
  const copiedTimeoutRef = useRef<number | null>(null)

  const hasBuffer = Boolean(buffer)
  const renderRect = useMemo(() => {
    if (!buffer || shellSize.width <= 0 || shellSize.height <= 0) {
      return null
    }
    const availableWidth = Math.max(0, shellSize.width - CANVAS_PADDING * 2)
    const availableHeight = Math.max(0, shellSize.height - CANVAS_PADDING * 2)
    if (availableWidth === 0 || availableHeight === 0) {
      return null
    }
    const scale = Math.min(availableWidth / buffer.width, availableHeight / buffer.height)
    const drawWidth = Math.max(1, Math.floor(buffer.width * scale))
    const drawHeight = Math.max(1, Math.floor(buffer.height * scale))
    const offsetX = Math.floor(CANVAS_PADDING + (availableWidth - drawWidth) / 2)
    const offsetY = Math.floor(CANVAS_PADDING + (availableHeight - drawHeight) / 2)
    return { offsetX, offsetY, drawWidth, drawHeight, scale }
  }, [buffer, shellSize.width, shellSize.height])

  useEffect(() => {
    if (!shellRef.current) {
      return
    }

    const node = shellRef.current
    const updateSize = () => {
      // console.count("ResizeObserver")
      const rect = node.getBoundingClientRect()
      const nextWidth = Math.max(1, Math.floor(rect.width))
      const nextHeight = Math.max(1, Math.floor(rect.height))
      setShellSize((prev) =>
        prev.width === nextWidth && prev.height === nextHeight
          ? prev
          : { width: nextWidth, height: nextHeight },
      )
    }

    updateSize()
    const observer = new ResizeObserver(updateSize)
    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!canvasRef.current) {
      return
    }
    if (buffer && shellSize.width > 0 && shellSize.height > 0) {
      renderBufferToCanvas(
        canvasRef.current,
        buffer,
        shellSize.width,
        shellSize.height,
        CANVAS_PADDING,
      )
      return
    }
    const ctx = canvasRef.current.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
  }, [buffer, shellSize.width, shellSize.height])

  const handlePointer = (event: React.MouseEvent<HTMLDivElement>) => {
    // console.count("mousemove")
    if (!buffer || !renderRect || !shellRef.current) {
      setHoverInfo(null)
      return
    }
    const rect = shellRef.current.getBoundingClientRect()
    const localX = event.clientX - rect.left
    const localY = event.clientY - rect.top
    const { offsetX, offsetY, drawWidth, drawHeight, scale } = renderRect

    if (
      localX < offsetX ||
      localY < offsetY ||
      localX >= offsetX + drawWidth ||
      localY >= offsetY + drawHeight
    ) {
      setHoverInfo(null)
      return
    }

    const pixelX = Math.floor((localX - offsetX) / scale)
    const pixelY = Math.floor((localY - offsetY) / scale)
    const color = buffer.getPixel(pixelX, pixelY)
    if (!color) {
      setHoverInfo(null)
      return
    }

    const hex = `#${color.r.toString(16).padStart(2, '0')}${color.g
      .toString(16)
      .padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`
    const left = Math.min(rect.width - 10, Math.max(10, localX + 10))
    const top = Math.min(rect.height - 10, Math.max(10, localY + 10))
    setHoverInfo({ x: pixelX, y: pixelY, hex, left, top })
  }

  const handleLeave = () => setHoverInfo(null)

  const handleClick = async () => {
    if (!hoverInfo) {
      return
    }
    try {
      await navigator.clipboard.writeText(hoverInfo.hex)
      setCopied(true)
      if (copiedTimeoutRef.current !== null) {
        window.clearTimeout(copiedTimeoutRef.current)
      }
      copiedTimeoutRef.current = window.setTimeout(() => {
        setCopied(false)
      }, 900)
    } catch {
      // Ignore clipboard errors.
    }
  }

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current !== null) {
        window.clearTimeout(copiedTimeoutRef.current)
      }
    }
  }, [])

  const highlightStyle = useMemo(() => {
    if (!hoverInfo || !renderRect) {
      return null
    }
    const { offsetX, offsetY, scale } = renderRect
    const size = Math.max(1, Math.floor(scale))
    return {
      left: Math.floor(offsetX + hoverInfo.x * scale),
      top: Math.floor(offsetY + hoverInfo.y * scale),
      width: size,
      height: size,
    }
  }, [hoverInfo, renderRect])

  const content = (
    <>
      <div className="section-title">{title}</div>
      <div className="canvas-frame">
        <div
          className={`canvas-shell${hasBuffer ? ' canvas-shell--interactive' : ''}`}
          ref={shellRef}
          onMouseMove={handlePointer}
          onMouseLeave={handleLeave}
          onClick={handleClick}
        >
          <canvas ref={canvasRef} className="canvas-render" />
          {highlightStyle ? <div className="canvas-highlight" style={highlightStyle} /> : null}
          {!buffer ? <div className="canvas-empty">Waiting for output...</div> : null}
        </div>
        {hoverInfo ? (
          <div className="canvas-hover" style={{ left: hoverInfo.left, top: hoverInfo.top }}>
            <span>
              {hoverInfo.x},{hoverInfo.y}
            </span>
            <span>{hoverInfo.hex}</span>
            {copied ? <span className="canvas-hover__copied">Copied!</span> : null}
          </div>
        ) : null}
      </div>
    </>
  )

  if (embedded) {
    return <div className="canvas-block">{content}</div>
  }

  return (
    <div className="panel canvas-panel">
      <div className="panel-header">{title}</div>
      <div className="canvas-frame">
        <div className="canvas-shell" ref={shellRef}>
          <canvas ref={canvasRef} className="canvas-render" />
          {!buffer ? <div className="canvas-empty">Waiting for output...</div> : null}
        </div>
      </div>
    </div>
  )
}

export default CanvasPanel
