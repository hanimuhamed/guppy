import { PixelBuffer } from '../engine/pixelBuffer'
import type { LevelDefinition } from './types'

const black = { r: 0, g: 0, b: 0, a: 255 }
const white = { r: 255, g: 255, b: 255, a: 255 }
const blue = { r: 0, g: 85, b: 164, a: 255 }
const red = { r: 220, g: 36, b: 31, a: 255 }
const yellow = { r: 255, g: 215, b: 0, a: 255 }
const purple = { r: 128, g: 0, b: 255, a: 255 }
const green = { r: 34, g: 177, b: 76, a: 255 }
const cyan = { r: 0, g: 255, b: 255, a: 255 }
const orange = { r: 255, g: 140, b: 0, a: 255 }
const lightOrange = { r: 255, g: 200, b: 120, a: 255 }
const grey = { r: 128, g: 128, b: 128, a: 255 }

const createBuffer = (width: number, height: number) => new PixelBuffer(width, height, white)

export const world1Levels: LevelDefinition[] = [
  {
    id: 'w1-center-dot',
    index: 1,
    title: 'Dot',
    description: (
      <>
        <p>
          Place a single <strong>yellow pixel</strong> at the exact center of the
          canvas.
        </p>

        <p>
          Use <code>setPixel<span style={{color: '#ffd700'}}>(</span>x, y, <span style={{color: 'var(--string)'}}>'#RRGGBB'</span><span style={{color: '#ffd700'}}>)</span></code> to set the pixel color at
          position <code><span style={{color: '#ffd700'}}>(</span>x, y<span style={{color: '#ffd700'}}>)</span></code>.
        </p>

        <p>
          Try clicking a pixel on the reference image to see its coordinates and
          copy the color code.
        </p>
      </>
    ),
    difficulty: 'Easy',
    hints: [
      {
        id: 1,
        description: 'Calculate the center coordinates using width and height.',
      },
      {
        id: 2,
        description: 'Use floor division (//) to get the integer coordinates of the center.',
      },
      {
        id: 3,
        description: 'As mentioned in the description, click on the yellow pixel in the reference image to get its color code.',
      },
      {
        id: 4,
        description: 'The center pixel is at (width // 2, height // 2).',
      },
      {
        id: 5,
        description: 'Use setPixel(width//2, height//2, \'#ffd700\')',
      }
    ],
    minimumWidth: 3,
    maximumWidth: 15,
    minimumHeight: 3,
    maximumHeight: 15,
    dimensionStep: 2,
    starterCode: `def solve(width: int, height: int) -> None:
    # Your code goes here.
    return
`,
    referenceGenerator: (width, height) => {
      const buffer = createBuffer(width, height)
      buffer.setPixel(Math.floor(width / 2), Math.floor(height / 2), yellow)
      return buffer
    },
    hiddenTestCases: [
      { width: 3, height: 3 },
      { width: 9, height: 11 },
    ],
  },
  {
    id: 'w1-border',
    index: 2,
    title: 'Border',
    description: 'Draw a 1-pixel green border around the entire canvas edge.',
    difficulty: 'Easy',
    hints: [
      {
        id: 1,
        description: 'Use for loops to iterate over the x and y coordinates along the edges of the canvas.',
      },
      {
        id: 2,
        description: <p><a href="https://www.geeksforgeeks.org/python/python-for-loops/" target="_blank" rel="noopener noreferrer" style={{color: '#f7fff7', textDecoration: 'underline'}}>Here</a> is a refresher on for loops in Python if you need it.</p>,
      },
    ],
    minimumWidth: 3,
    maximumWidth: 25,
    minimumHeight: 3,
    maximumHeight: 25,
    dimensionStep: 1,
    starterCode: `def solve(width: int, height: int) -> None:
    # Your code goes here.
    return
`,
    referenceGenerator: (width, height) => {
      const buffer = createBuffer(width, height)
      for (let x = 0; x < width; x += 1) {
        buffer.setPixel(x, 0, green)
        buffer.setPixel(x, height - 1, green)
      }
      for (let y = 0; y < height; y += 1) {
        buffer.setPixel(0, y, green)
        buffer.setPixel(width - 1, y, green)
      }
      return buffer
    },
    hiddenTestCases: [
      { width: 5, height: 9 },
      { width: 17, height: 11 },
    ],
  },
  {
    id: 'w1-cross',
    index: 3,
    title: 'Cross',
    description: 'Draw a red plus-shaped cross with lines running through the center of the canvas.',
    difficulty: 'Easy',
    hints: [
      {
        id: 1,
        description: 'The vertical line of the cross consists of pixels where x is equal to the center x coordinate.',
      },
      {
        id: 2,
        description: 'The horizontal line of the cross consists of pixels where y is equal to the center y coordinate.',
      },
    ],
    minimumWidth: 5,
    maximumWidth: 25,
    minimumHeight: 5,
    maximumHeight: 25,
    dimensionStep: 2,
    starterCode: `def solve(width: int, height: int) -> None:
    # Your code goes here.
    return
`,
    referenceGenerator: (width, height) => {
      const buffer = createBuffer(width, height)
      const midX = Math.floor(width / 2)
      const midY = Math.floor(height / 2)
      for (let x = 0; x < width; x += 1) {
        buffer.setPixel(x, midY, red)
      }
      for (let y = 0; y < height; y += 1) {
        buffer.setPixel(midX, y, red)
      }
      return buffer
    },
    hiddenTestCases: [
      { width: 7, height: 11 },
      { width: 17, height: 21 },
    ],
  },
  {
    id: 'w1-checkerboard',
    index: 4,
    title: 'Checkerboard',
    description: 'Fill the canvas with alternating black and white cells.',
    difficulty: 'Easy',
    hints: [
      {
        id: 1,
        description: 'If x + y is even, color the cell black; if odd, color it white.',
      },
    ],
    minimumWidth: 4,
    maximumWidth: 24,
    minimumHeight: 4,
    maximumHeight: 24,
    dimensionStep: 1, 
    starterCode: `def solve(width: int, height: int) -> None:
    # Your code goes here.
    return
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
      { width: 6, height: 10 },
      { width: 20, height: 18 },
    ],
  },
  {
    id: 'w1-x-shape',
    index: 5,
    title: 'X',
    description: 'Draw both diagonals of the canvas in green to form an X.',
    difficulty: 'Medium',
    hints: [
      {
        id: 1,
        description: 'The first diagonal consists of pixels where x = y.',
      },
      {
        id: 2,
        description: 'The second diagonal consists of pixels where x = width - y - 1.',
      },
    ],
    minimumWidth: 5,
    maximumWidth: 25,
    minimumHeight: 5,
    maximumHeight: 25,
    dimensionStep: 2,
    starterCode: `def solve(width: int, height: int) -> None:
    # Your code goes here.
    return
`,
    referenceGenerator: (width, height) => {
      const buffer = createBuffer(width, height)
      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          if (x === y || x === width - y - 1) {
            buffer.setPixel(x, y, green)
          }
        }
      }
      return buffer
    },
    hiddenTestCases: [
      { width: 7, height: 7 },
      { width: 25, height: 19 },
    ],
  },
  {
    id: 'w1-filled-diamond',
    index: 6,
    title: 'Diamond',
    description: 'Fill a diamond shape centered in the canvas.',
    difficulty: 'Medium',
    hints: [
      {
        id: 1,
        description: 'For each pixel, calculate the Manhattan distance from the center: dist = abs(x - cx) + abs(y - cy).',
      },
      {
        id: 2,
        description: 'Fill the pixels where the distance is less than or equal to the radius.',
      },
      {
        id: 3,
        description: 'Radius is the minimum of cx and cy',
      }
    ],
    minimumWidth: 7,
    maximumWidth: 43,
    minimumHeight: 7,
    maximumHeight: 43,
    dimensionStep: 2,
    starterCode: `def solve(width: int, height: int) -> None:
    # Your code goes here.
    return
`,
    referenceGenerator: (width, height) => {
      const buffer = createBuffer(width, height)
      const cx = Math.floor(width / 2)
      const cy = Math.floor(height / 2)
      const radius = Math.min(cx, cy)
      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const dist = Math.abs(x - cx) + Math.abs(y - cy)
          if (dist <= radius) {
            buffer.setPixel(x, y, cyan)
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
    id: 'w1-concentric-rectangles',
    index: 7,
    title: 'Rectangles',
    description: 'Draw nested rectangular rings alternating between purple and yellow.',
    difficulty: 'Medium',
    hints: [
      {
        id: 1,
        description: 'The number of rings is determined by how many times you can inset a rectangle before reaching the center.',
      },
      {
        id: 2,
        description: 'Use a loop to draw each ring, calculating the coordinates and color of the current rectangle based on the ring index.',
      },
    ],
    minimumWidth: 5,
    maximumWidth: 45,
    minimumHeight: 5,
    maximumHeight: 45,
    dimensionStep: 2,
    starterCode: `def solve(width: int, height: int) -> None:
    # Your code goes here.
    return
`,
    referenceGenerator: (width, height) => {
      const buffer = createBuffer(width, height)
      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const layer = Math.min(x, y, width - x - 1, height - y - 1)
          buffer.setPixel(x, y, layer % 2 === 0 ? purple : yellow)
        }
      }
      return buffer
    },
    hiddenTestCases: [
      { width: 9, height: 5 },
      { width: 29, height: 19 },
    ],
  },
  {
    id: 'w1-filled-circle',
    index: 8,
    title: 'Ball',
    description: 'Fill a circle centered in the canvas.',
    difficulty: 'Hard',
    hints: [
      {
        id: 1,
        description: 'For each pixel, calculate the Euclidean distance from the center: dist = sqrt((x - cx)^2 + (y - cy)^2).',
      },
      {
        id: 2,
        description: 'Fill the pixels where the distance is less than the radius + 1.',
      }
    ],
    minimumWidth: 9,
    maximumWidth: 45,
    minimumHeight: 9,
    maximumHeight: 45,
    dimensionStep: 2,
    starterCode: `def solve(width: int, height: int) -> None:
    # Your code goes here.
    return
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
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < radius + 1) {
            buffer.setPixel(x, y, blue)
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
  {
    id: 'w1-grid',
    index: 9,
    title: 'Grid',
    description: 'Draw evenly spaced grey grid lines on a white background. Spacing scales with canvas size.',
    difficulty: 'Hard',
    hints: [
      {
        id: 1,
        description: 'Calculate the spacing based on the canvas size.',
      },
      {
        id: 2,
        description: 'Use modulo operator to determine which pixels should be colored grey.',
      },
      {
        id: 3,
        description: 'Notice the spacing is 5 times less the minimum of width and height.',
      }
    ],
    minimumWidth: 11,
    maximumWidth: 55,
    minimumHeight: 11,
    maximumHeight: 55,
    dimensionStep: 1,
    starterCode: `def solve(width: int, height: int) -> None:
    # Your code goes here.
    return
`,
    referenceGenerator: (width, height) => {
      const buffer = createBuffer(width, height)
      const spacing = Math.floor(Math.min(width, height) / 5)
      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          if (x % spacing === 0 || y % spacing === 0) {
            buffer.setPixel(x, y, grey)
          }
        }
      }
      return buffer
    },
    hiddenTestCases: [
      { width: 21, height: 15 },
      { width: 45, height: 41 },
    ],
  },
  {
    id: 'w1-citrus-slice',
    index: 10,
    title: 'Citrus',
    description:
      'Draw an orange slice: an orange outer circle, a light orange inner circle, and white cross + diagonal dividers.',
    difficulty: 'Extreme',
    hints: [
      {
        id: 1,
        description: 'Notice the inner circle is 2 pixels smaller than the outer circle.',
      },
    ],
    minimumWidth: 17,
    maximumWidth: 57,
    minimumHeight: 17,
    maximumHeight: 57,
    dimensionStep: 2,
    starterCode: `def solve(width: int, height: int) -> None:
    # Your code goes here.
    return
`,
    referenceGenerator: (width, height) => {
      const buffer = createBuffer(width, height)
      const cx = Math.floor(width / 2)
      const cy = Math.floor(height / 2)
      const outerRadius = Math.min(cx, cy)
      const innerRadius = outerRadius - 2
 
      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const dx = x - cx
          const dy = y - cy
          const dist = Math.sqrt(dx * dx + dy * dy)
 
          if (dist < outerRadius + 1) {
            buffer.setPixel(x, y, orange)
          }
          if (dist < innerRadius + 1) {
            buffer.setPixel(x, y, lightOrange)
            const onCross = dy === 0 || dx === 0
            const onDiag = dx === dy || dx === -dy
            if (onCross || onDiag) {
              buffer.setPixel(x, y, white)
            }
          }
        }
      }
      return buffer
    },
    hiddenTestCases: [
      { width: 21, height: 17 },
      { width: 35, height: 45 },
    ],
  },
]