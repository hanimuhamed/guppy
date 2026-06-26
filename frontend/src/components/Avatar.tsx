import React, { useEffect, useRef } from 'react'
import { generateAvatarPixels } from '../utils/avatar'

interface AvatarProps {
  username: string
  favoriteColor?: string
  size?: number
}

export const Avatar: React.FC<AvatarProps> = ({
  username,
  favoriteColor = '#FF5C5C',
  size = 42
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, size, size)
    const pixels = generateAvatarPixels(username, favoriteColor, 7)
    const pixelSize = size / 7

    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        ctx.fillStyle = pixels[y][x]
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize)
      }
    }
  }, [username, favoriteColor, size])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        imageRendering: 'pixelated',
        backgroundColor: 'var(--surface)'
      }}
      title={username}
    />
  )
}
