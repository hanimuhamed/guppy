import { PixelBuffer } from '../engine/pixelBuffer'
import { buildDiffBuffer } from './diff'

export type JudgeResult = {
  match: boolean
  mismatchCount: number
  totalPixels: number
  correctCount: number
  accuracy: number
  firstMismatch: { x: number; y: number } | null
  diffBuffer: PixelBuffer
}

export const judgeBuffers = (expected: PixelBuffer, actual: PixelBuffer): JudgeResult => {
  const { diff, mismatchCount, firstMismatch, totalPixels, correctCount, accuracy } =
    buildDiffBuffer(expected, actual)
  return {
    match: mismatchCount === 0,
    mismatchCount,
    totalPixels,
    correctCount,
    accuracy,
    firstMismatch,
    diffBuffer: diff,
  }
}
