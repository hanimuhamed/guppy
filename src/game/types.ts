import type React from 'react'
import { PixelBuffer } from '../engine/pixelBuffer'

export type LevelTestCase = {
  width: number
  height: number
}

export type Hint = {
  id: number
  description: React.ReactNode
}

export type LevelDefinition = {
  id: string
  index: number
  title: string
  description: React.ReactNode
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme'
  hints?: Hint[]
  minimumWidth: number
  maximumWidth: number
  minimumHeight: number
  maximumHeight: number
  dimensionStep: number
  starterCode: string
  referenceGenerator: (width: number, height: number) => PixelBuffer
  hiddenTestCases: LevelTestCase[]
}
