import type React from 'react'
import { PixelBuffer } from '../engine/pixelBuffer'

export type LevelTestCase = {
  width: number
  height: number
}

export type LevelDefinition = {
  id: string
  index: number
  title: string
  description: React.ReactNode
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme'
  minimumWidth: number
  maximumWidth: number
  minimumHeight: number
  maximumHeight: number
  dimensionStep: number
  starterCode: string
  referenceGenerator: (width: number, height: number) => PixelBuffer
  hiddenTestCases: LevelTestCase[]
}
