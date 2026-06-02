import { PixelBuffer } from '../engine/pixelBuffer'

export type LevelTestCase = {
  width: number
  height: number
}

export type LevelDefinition = {
  id: string
  index: number
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  minimumWidth: number
  maximumWidth: number
  minimumHeight: number
  maximumHeight: number
  starterCode: string
  referenceGenerator: (width: number, height: number) => PixelBuffer
  hiddenTestCases: LevelTestCase[]
}
