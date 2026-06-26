import type { LevelDefinition } from '../game/types'


const thumbnailCache = new Map<string, string>()

export const generateLevelThumbnail = (level: LevelDefinition): string => {
  if (thumbnailCache.has(level.id)) {
    return thumbnailCache.get(level.id)!
  }

  // Use the average of min and max for dimensions
  const width = Math.round((level.minimumWidth + level.maximumWidth) / 2)
  const height = Math.round((level.minimumHeight + level.maximumHeight) / 2)

  // Generate reference buffer
  const buffer = level.referenceGenerator(width, height)

  // Convert to image data URL
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  
  if (!ctx) {
    buffer.dispose()
    return ''
  }

  const imageData = ctx.createImageData(width, height)
  const data = buffer.data
  
  for (let i = 0; i < data.length; i++) {
    imageData.data[i] = data[i]
  }

  ctx.putImageData(imageData, 0, 0)
  
  // Scale up for better rendering, using nearest neighbor
  const scaledCanvas = document.createElement('canvas')
  const scale = Math.max(1, Math.floor(100 / Math.max(width, height)))
  scaledCanvas.width = width * scale
  scaledCanvas.height = height * scale
  
  const scaledCtx = scaledCanvas.getContext('2d')
  if (scaledCtx) {
    scaledCtx.imageSmoothingEnabled = false
    scaledCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height)
    const dataUrl = scaledCanvas.toDataURL('image/png')
    thumbnailCache.set(level.id, dataUrl)
    buffer.dispose()
    return dataUrl
  }

  buffer.dispose()
  return canvas.toDataURL('image/png')
}
