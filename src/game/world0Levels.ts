/*mport { PixelBuffer } from '../engine/pixelBuffer'
import type { LevelDefinition } from './types'

const black = { r: 0, g: 0, b: 0, a: 255 }
const white = { r: 255, g: 255, b: 255, a: 255 }
const blue = { r: 0, g: 85, b: 164, a: 255 }
const red = { r: 220, g: 36, b: 31, a: 255 }

const createBuffer = (width: number, height: number) => new PixelBuffer(width, height, white)

export const world1Levels: LevelDefinition[] = [
  {
    id: 'w1-single-pixel',
    index: 1,
    title: 'Single Pixel',
    description: 'Set the center pixel to black using setPixel(x, y, color).',
    difficulty: 'Easy',
    minimumWidth: 3,
    maximumWidth: 15,
    minimumHeight: 3,
    maximumHeight: 15,
    starterCode: `def solve(width, height):
    # Use #000000 for black.
    # Example: setPixel(0, 0, '#000000')
    pass
`,
    referenceGenerator: (width, height) => {
      const buffer = createBuffer(width, height)
      buffer.setPixel(Math.floor(width / 2), Math.floor(height / 2), black)
      return buffer
    },
    hiddenTestCases: [
      { width: 3, height: 3 },
      { width: 9, height: 11 },
    ],
  },
  {
    id: 'w1-horizontal-line',
    index: 2,
    title: 'Horizontal Line',
    description: 'Draw a black line across the middle row.',
    difficulty: 'Easy',
    minimumWidth: 3,
    maximumWidth: 25,
    minimumHeight: 3,
    maximumHeight: 15,
    starterCode: `def solve(width, height):
    # Draw a line across the middle row.
    # Hint: loop over x.
    pass
`,
    referenceGenerator: (width, height) => {
      const buffer = createBuffer(width, height)
      const y = Math.floor(height / 2)
      for (let x = 0; x < width; x += 1) {
        buffer.setPixel(x, y, black)
      }
      return buffer
    },
    hiddenTestCases: [
      { width: 5, height: 5 },
      { width: 20, height: 7 },
    ],
  },
  {
    id: 'w1-vertical-line',
    index: 3,
    title: 'Vertical Line',
    description: 'Draw a black line down the middle column.',
    difficulty: 'Easy',
    minimumWidth: 3,
    maximumWidth: 15,
    minimumHeight: 3,
    maximumHeight: 25,
    starterCode: `def solve(width, height):
    # Draw a line down the middle column.
    # Hint: loop over y.
    pass
`,
    referenceGenerator: (width, height) => {
      const buffer = createBuffer(width, height)
      const x = Math.floor(width / 2)
      for (let y = 0; y < height; y += 1) {
        buffer.setPixel(x, y, black)
      }
      return buffer
    },
    hiddenTestCases: [
      { width: 7, height: 5 },
      { width: 9, height: 21 },
    ],
  },
  {
    id: 'w1-border',
    index: 4,
    title: 'Border',
    description: 'Draw a 1-pixel black border around the grid.',
    difficulty: 'Easy',
    minimumWidth: 3,
    maximumWidth: 30,
    minimumHeight: 3,
    maximumHeight: 30,
    starterCode: `def solve(width, height):
    # Draw the outer border in black.
    pass
`,
    referenceGenerator: (width, height) => {
      const buffer = createBuffer(width, height)
      for (let x = 0; x < width; x += 1) {
        buffer.setPixel(x, 0, black)
        buffer.setPixel(x, height - 1, black)
      }
      for (let y = 0; y < height; y += 1) {
        buffer.setPixel(0, y, black)
        buffer.setPixel(width - 1, y, black)
      }
      return buffer
    },
    hiddenTestCases: [
      { width: 4, height: 9 },
      { width: 17, height: 11 },
    ],
  },
  {
    id: 'w1-french-flag',
    index: 5,
    title: 'French Flag',
    description: 'Draw vertical stripes: blue, white, red.',
    difficulty: 'Medium',
    minimumWidth: 3,
    maximumWidth: 30,
    minimumHeight: 3,
    maximumHeight: 30,
    starterCode: `def solve(width, height):
    # Split width into thirds for blue, white, red.
    pass
`,
    referenceGenerator: (width, height) => {
      const buffer = createBuffer(width, height)
      const third = Math.round(width / 3)
      for (let x = 0; x < width; x += 1) {
        const color = x < third ? blue : x < width - third ? white : red
        for (let y = 0; y < height; y += 1) {
          buffer.setPixel(x, y, color)
        }
      }
      return buffer
    },
    hiddenTestCases: [
      { width: 6, height: 9 },
      { width: 25, height: 10 },
    ],
  },
  {
    id: 'w1-england-flag',
    index: 6,
    title: 'England Flag',
    description: 'Draw a red cross centered on a white field.',
    difficulty: 'Medium',
    minimumWidth: 5,
    maximumWidth: 35,
    minimumHeight: 5,
    maximumHeight: 35,
    starterCode: `def solve(width, height):
    # Draw a centered red cross.
    pass
`,
    referenceGenerator: (width, height) => {
      const buffer = createBuffer(width, height)
      const midX = Math.floor(width / 2)
      const midY = Math.floor(height / 2)
      const thickness = Math.max(1, Math.floor(Math.min(width, height) / 5))
      for (let x = 0; x < width; x += 1) {
        for (let y = 0; y < height; y += 1) {
          if (Math.abs(x - midX) < thickness || Math.abs(y - midY) < thickness) {
            buffer.setPixel(x, y, red)
          }
        }
      }
      return buffer
    },
    hiddenTestCases: [
      { width: 9, height: 9 },
      { width: 27, height: 19 },
    ],
  },
  {
    id: 'w1-checkerboard',
    index: 7,
    title: 'Checkerboard',
    description: 'Alternating black and white cells.',
    difficulty: 'Easy',
    minimumWidth: 4,
    maximumWidth: 50,
    minimumHeight: 4,
    maximumHeight: 50,
    starterCode: `def solve(width, height):
    # Alternate colors using (x + y) % 2.
    pass
`,
    referenceGenerator: (width, height) => {
      const buffer = createBuffer(width, height)
      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          if ((x + y) % 2 === 0) {
            buffer.setPixel(x, y, black)
          }
        }
      }
      return buffer
    },
    hiddenTestCases: [
      { width: 5, height: 7 },
      { width: 41, height: 36 },
    ],
  },
  {
    id: 'w1-cross',
    index: 8,
    title: 'Cross',
    description: 'Draw a plus-shaped cross in black.',
    difficulty: 'Easy',
    minimumWidth: 5,
    maximumWidth: 40,
    minimumHeight: 5,
    maximumHeight: 40,
    starterCode: `def solve(width, height):
    # Draw vertical and horizontal lines crossing at the center.
    pass
`,
    referenceGenerator: (width, height) => {
      const buffer = createBuffer(width, height)
      const midX = Math.floor(width / 2)
      const midY = Math.floor(height / 2)
      for (let x = 0; x < width; x += 1) {
        buffer.setPixel(x, midY, black)
      }
      for (let y = 0; y < height; y += 1) {
        buffer.setPixel(midX, y, black)
      }
      return buffer
    },
    hiddenTestCases: [
      { width: 7, height: 11 },
      { width: 33, height: 21 },
    ],
  },
  {
    id: 'w1-diamond',
    index: 9,
    title: 'Diamond',
    description: 'Draw a diamond outline centered in the grid.',
    difficulty: 'Hard',
    minimumWidth: 7,
    maximumWidth: 41,
    minimumHeight: 7,
    maximumHeight: 41,
    starterCode: `def solve(width, height):
    # Manhattan distance from center defines the diamond.
    pass
`,
    referenceGenerator: (width, height) => {
      const buffer = createBuffer(width, height)
      const cx = Math.floor(width / 2)
      const cy = Math.floor(height / 2)
      const radius = Math.min(cx, cy)
      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const dist = Math.abs(x - cx) + Math.abs(y - cy)
          if (dist === radius) {
            buffer.setPixel(x, y, black)
          }
        }
      }
      return buffer
    },
    hiddenTestCases: [
      { width: 9, height: 9 },
      { width: 31, height: 25 },
    ],
  },
  {
    id: 'w1-circle',
    index: 10,
    title: 'Circle',
    description: 'Draw a circle outline centered in the grid.',
    difficulty: 'Hard',
    minimumWidth: 9,
    maximumWidth: 45,
    minimumHeight: 9,
    maximumHeight: 45,
    starterCode: `def solve(width, height):
    # Use a radius based on the smaller dimension.
    pass
`,
    referenceGenerator: (width, height) => {
      const buffer = createBuffer(width, height)
      const cx = Math.floor(width / 2)
      const cy = Math.floor(height / 2)
      const radius = Math.min(cx, cy)
      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const dx = x - cx
          const dy = y - cy
          const dist = Math.round(Math.sqrt(dx * dx + dy * dy))
          if (dist === radius) {
            buffer.setPixel(x, y, black)
          }
        }
      }
      return buffer
    },
    hiddenTestCases: [
      { width: 11, height: 11 },
      { width: 37, height: 29 },
    ],
  },
]*/
