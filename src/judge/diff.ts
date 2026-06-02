import { PixelBuffer, type RgbaColor } from '../engine/pixelBuffer'

const diffColor: RgbaColor = { r: 255, g: 80, b: 80, a: 255 }
const matchColor: RgbaColor = { r: 30, g: 30, b: 30, a: 255 }

export const buildDiffBuffer = (expected: PixelBuffer, actual: PixelBuffer) => {
  const diff = new PixelBuffer(expected.width, expected.height, matchColor)
  let mismatchCount = 0
  let firstMismatch: { x: number; y: number } | null = null
  const totalPixels = expected.width * expected.height

  for (let y = 0; y < expected.height; y += 1) {
    for (let x = 0; x < expected.width; x += 1) {
      const exp = expected.getPixel(x, y)
      const act = actual.getPixel(x, y)
      if (!exp || !act) {
        continue
      }
      if (exp.r !== act.r || exp.g !== act.g || exp.b !== act.b || exp.a !== act.a) {
        diff.setPixel(x, y, diffColor)
        mismatchCount += 1
        if (!firstMismatch) {
          firstMismatch = { x, y }
        }
      }
    }
  }

  const correctCount = totalPixels - mismatchCount
  const accuracy = totalPixels === 0 ? 0 : correctCount / totalPixels

  return { diff, mismatchCount, firstMismatch, totalPixels, correctCount, accuracy }
}
