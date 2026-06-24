import { PixelBuffer} from '../engine/pixelBuffer'

export const buildDiffBuffer = (expected: PixelBuffer, actual: PixelBuffer) => {
  // const diff = new PixelBuffer(expected.width, expected.height, matchColor)
  let mismatchCount = 0
  // let firstMismatch: { x: number; y: number } | null = null
  const totalPixels = expected.width * expected.height
  const e = expected.data
  const a = actual.data
  for (let y = 0; y < expected.height; y += 1) {
    for (let x = 0; x < expected.width; x += 1) {
      const idx = (y * expected.width + x) * 4
      if (
        e[idx] !== a[idx] || 
        e[idx + 1] !== a[idx + 1] || 
        e[idx + 2] !== a[idx + 2] || 
        e[idx + 3] !== a[idx + 3]
      ) {
        mismatchCount += 1
      }
    }
  }

  const correctCount = totalPixels - mismatchCount
  const accuracy = totalPixels === 0 ? 0 : correctCount / totalPixels

  return {mismatchCount, totalPixels, correctCount, accuracy }
}
