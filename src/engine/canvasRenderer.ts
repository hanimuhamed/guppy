import { PixelBuffer } from './pixelBuffer'
export const renderBufferToCanvas = (
  canvas: HTMLCanvasElement,
  buffer: PixelBuffer,
  targetWidth: number,
  targetHeight: number,
  padding = 0,
) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return
  }
  const width = buffer.width
  const height = buffer.height
  canvas.width = targetWidth
  canvas.height = targetHeight
  const availableWidth = Math.max(0, targetWidth - padding * 2)
  const availableHeight = Math.max(0, targetHeight - padding * 2)
  if (availableWidth === 0 || availableHeight === 0) {
    ctx.clearRect(0, 0, targetWidth, targetHeight)
    return
  }
  const offscreen = document.createElement('canvas')
  offscreen.width = width
  offscreen.height = height
  const offscreenCtx = offscreen.getContext('2d')
  if (!offscreenCtx) {
    return
  }
  const imageData = offscreenCtx.createImageData(width, height)
  imageData.data.set(buffer.data)
  offscreenCtx.putImageData(imageData, 0, 0)
  ctx.imageSmoothingEnabled = false
  ctx.clearRect(0, 0, targetWidth, targetHeight)
  const scale = Math.min(availableWidth / width, availableHeight / height)
  const drawWidth = Math.max(1, Math.floor(width * scale))
  const drawHeight = Math.max(1, Math.floor(height * scale))
  const offsetX = Math.floor(padding + (availableWidth - drawWidth) / 2)
  const offsetY = Math.floor(padding + (availableHeight - drawHeight) / 2)
  ctx.drawImage(offscreen, offsetX, offsetY, drawWidth, drawHeight)
}