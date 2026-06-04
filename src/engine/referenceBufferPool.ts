import { PixelBuffer, type RgbaColor } from '../engine/pixelBuffer'

const white: RgbaColor = {
  r: 255,
  g: 255,
  b: 255,
  a: 255,
}

const bufferPool = new Map<string, PixelBuffer>()

export const getReferenceBuffer = (
  levelId: string,
  width: number,
  height: number,
): PixelBuffer => {
  const key = `${levelId}:${width}x${height}`

  let buffer = bufferPool.get(key)

  if (!buffer) {
    buffer = new PixelBuffer(width, height, white)
    bufferPool.set(key, buffer)
  }

  // Reset to white before redrawing
  buffer.data.fill(255)

  return buffer
}

export const clearReferenceBufferPool = () => {
  bufferPool.clear()
}

export const getReferenceBufferPoolSize = () => {
  return bufferPool.size
}