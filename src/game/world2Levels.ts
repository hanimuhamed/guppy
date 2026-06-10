import { PixelBuffer } from '../engine/pixelBuffer'
import type { LevelDefinition } from './types'

const black  = { r: 0,   g: 0,   b: 0,   a: 255 }
const white  = { r: 255, g: 255, b: 255, a: 255 }
const red    = { r: 220, g: 36,  b: 31,  a: 255 }
const yellow = { r: 255, g: 215, b: 0,   a: 255 }
const green  = { r: 34,  g: 177, b: 76,  a: 255 }

const createBuffer = (width: number, height: number) => new PixelBuffer(width, height, white)

export const world2Levels: LevelDefinition[] = [

  // ─── EASY 1 ── Germany ───────────────────────────────────────────────────
  {
    id: 'w2-flag-germany',
    index: 1,
    title: 'Germany',
    description: 'Draw the German flag: three equal horizontal stripes — black on top, red in the middle, yellow on the bottom.',
    difficulty: 'Easy',
    hints: [
      {
        id: 1,
        description: 'Each stripe should be one-third of the total height.'
      },
    ],
    minimumWidth: 6,
    maximumWidth: 30,
    minimumHeight: 6,
    maximumHeight: 30,
    dimensionStep: 3,
    starterCode: `def solve(width: int, height: int) -> None:
    # Your code goes here.
    return
`,
    referenceGenerator: (width, height) => {
      const buffer = createBuffer(width, height)
      const s = Math.floor(height / 3)
      const colors = [black, red, yellow]
      for (let y = 0; y < height; y++) {
        const c = colors[y < s ? 0 : y < s * 2 ? 1 : 2]
        for (let x = 0; x < width; x++) buffer.setPixel(x, y, c)
      }
      return buffer
    },
    hiddenTestCases: [
      { width: 9,  height: 6  },
      { width: 18, height: 12 },
    ],
  },

  // ─── EASY 2 ── France ────────────────────────────────────────────────────
  {
    id: 'w2-flag-france',
    index: 2,
    title: 'France',
    description: 'Draw the French flag: three equal vertical stripes — blue on the left, white in the middle, red on the right.',
    difficulty: 'Easy',
    minimumWidth: 6,
    maximumWidth: 30,
    minimumHeight: 6,
    maximumHeight: 30,
    dimensionStep: 3,
    starterCode: `def solve(width: int, height: int) -> None:
    # Your code goes here.
    return
`,
    referenceGenerator: (width, height) => {
      const buffer = createBuffer(width, height)
      const franceBlue = { r: 0, g: 85, b: 164, a: 255 }
      const s = Math.floor(width / 3)
      for (let x = 0; x < width; x++) {
        const c = x < s ? franceBlue : x < s * 2 ? white : red
        for (let y = 0; y < height; y++) buffer.setPixel(x, y, c)
      }
      return buffer
    },
    hiddenTestCases: [
      { width: 9,  height: 12  },
      { width: 21, height: 15 },
    ],
  },

  // ─── EASY 3 ── Ukraine ───────────────────────────────────────────────────
  {
    id: 'w2-flag-ukraine',
    index: 3,
    title: 'Ukraine',
    description: 'Draw the Ukrainian flag: the top half is blue, the bottom half is yellow.',
    difficulty: 'Easy',
    minimumWidth: 4,
    maximumWidth: 28,
    minimumHeight: 4,
    maximumHeight: 28,
    dimensionStep: 2,
    starterCode: `def solve(width: int, height: int) -> None:
    # Your code goes here.
    return
`,
    referenceGenerator: (width, height) => {
      const buffer = createBuffer(width, height)
      const ukraineBlue = { r: 0, g: 87, b: 183, a: 255 }
      const half = Math.floor(height / 2)
      for (let y = 0; y < height; y++) {
        const c = y < half ? ukraineBlue : yellow
        for (let x = 0; x < width; x++) buffer.setPixel(x, y, c)
      }
      return buffer
    },
    hiddenTestCases: [
      { width: 10, height: 6  },
      { width: 20, height: 14 },
    ],
  },

  // ─── EASY 4 ── Thailand ──────────────────────────────────────────────────
  {
    id: 'w2-flag-thailand',
    index: 4,
    title: 'Thailand',
    description: 'Draw the Thai flag: five horizontal stripes — red, white, blue, white, red. The middle blue stripe is twice the height of each outer stripe.',
    difficulty: 'Easy',
    minimumWidth: 6,
    maximumWidth: 30,
    minimumHeight: 6,
    maximumHeight: 30,
    dimensionStep: 6,
    starterCode: `def solve(width: int, height: int) -> None:
    # Your code goes here.
    return
`,
    referenceGenerator: (width, height) => {
      const buffer = createBuffer(width, height)
      const thaiBlue = { r: 45, g: 55, b: 125, a: 255 }
      // Proportions: 1:1:2:1:1 (total 6 parts)
      const unit = Math.floor(height / 6)
      for (let y = 0; y < height; y++) {
        let c
        if      (y < unit)         c = red
        else if (y < unit * 2)     c = white
        else if (y < unit * 4)     c = thaiBlue
        else if (y < unit * 5)     c = white
        else                       c = red
        for (let x = 0; x < width; x++) buffer.setPixel(x, y, c)
      }
      return buffer
    },
    hiddenTestCases: [
      { width: 12, height: 12 },
      { width: 24, height: 18 },
    ],
  },

  // ─── MEDIUM 1 ── Japan ───────────────────────────────────────────────────
  {
    id: 'w2-flag-japan',
    index: 5,
    title: 'Japan',
    description: 'Draw the Japanese flag: a white background with a red circle centered on the canvas. The circle radius is one-quarter of the shorter canvas dimension.',
    difficulty: 'Medium',
    minimumWidth: 9,
    maximumWidth: 41,
    minimumHeight: 9,
    maximumHeight: 41,
    dimensionStep: 2,
    starterCode: `def solve(width: int, height: int) -> None:
    # Your code goes here.
    return
`,
    referenceGenerator: (width, height) => {
      const buffer = createBuffer(width, height)
      const cx = Math.floor(width / 2)
      const cy = Math.floor(height / 2)
      const radius = Math.floor(Math.min(width, height) / 4)
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const dx = x - cx, dy = y - cy
          if (dx * dx + dy * dy < radius * radius) buffer.setPixel(x, y, red)
        }
      }
      return buffer
    },
    hiddenTestCases: [
      { width: 15, height: 11 },
      { width: 31, height: 23 },
    ],
  },

  // ─── MEDIUM 2 ── England ─────────────────────────────────────────────────
  {
    id: 'w2-flag-england',
    index: 6,
    title: 'England',
    description: "Draw St George's Cross: a white background with a centered red cross. Each arm of the cross has a thickness of one-sixth of the shorter canvas dimension (minimum 1).",
    difficulty: 'Medium',
    minimumWidth: 7,
    maximumWidth: 39,
    minimumHeight: 7,
    maximumHeight: 39,
    dimensionStep: 2,
    starterCode: `def solve(width: int, height: int) -> None:
    # Your code goes here.
    return
`,
    referenceGenerator: (width, height) => {
      const buffer = createBuffer(width, height)
      const cx = Math.floor(width / 2)
      const cy = Math.floor(height / 2)
      const t = Math.max(1, Math.floor(Math.min(width, height) / 6))
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (Math.abs(x - cx) < t || Math.abs(y - cy) < t) buffer.setPixel(x, y, red)
        }
      }
      return buffer
    },
    hiddenTestCases: [
      { width: 13, height: 11 },
      { width: 27, height: 21 },
    ],
  },

  // ─── MEDIUM 3 ── Sweden ──────────────────────────────────────────────────
  {
    id: 'w2-flag-sweden',
    index: 7,
    title: 'Sweden',
    description: 'Draw the Swedish flag: a blue background with a yellow Scandinavian cross. The vertical bar sits one-third from the left edge. Each bar is one-fifth of its respective dimension wide (minimum 1).',
    difficulty: 'Medium',
    minimumWidth: 12,
    maximumWidth: 40,
    minimumHeight: 10,
    maximumHeight: 30,
    dimensionStep: 2,
    starterCode: `def solve(width: int, height: int) -> None:
    # Your code goes here.
    return
`,
    referenceGenerator: (width, height) => {
      const buffer = createBuffer(width, height)
      const sweBlue   = { r: 0,   g: 106, b: 167, a: 255 }
      const sweYellow = { r: 255, g: 205, b: 0,   a: 255 }
      const barW = Math.max(1, Math.round(width  / 5))
      const barH = Math.max(1, Math.round(height / 5))
      const vx   = Math.floor(width  / 3)
      const hy   = Math.floor(height / 2)
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          buffer.setPixel(x, y, sweBlue)
        }
      }
      for (let y = 0; y < height; y++) {
        for (let dx = 0; dx < barW; dx++) {
          const x = vx - Math.floor(barW / 2) + dx
          if (x >= 0 && x < width) buffer.setPixel(x, y, sweYellow)
        }
      }
      for (let x = 0; x < width; x++) {
        for (let dy = 0; dy < barH; dy++) {
          const y = hy - Math.floor(barH / 2) + dy
          if (y >= 0 && y < height) buffer.setPixel(x, y, sweYellow)
        }
      }
      return buffer
    },
    hiddenTestCases: [
      { width: 16, height: 10 },
      { width: 30, height: 20 },
    ],
  },

    // ─── HARD 1 ── India ─────────────────────────────────────────────────────
  {
    id: 'w2-flag-india',
    index: 8,
    title: 'India',
    description: 'Draw the Indian flag: three equal horizontal stripes — saffron, white, green. In the center of the white stripe, draw the Ashoka Chakra: a navy blue circle outline with 8 (actually 24 but 8 for simplicity) evenly spaced spokes radiating from its center.',
    difficulty: 'Hard',
    minimumWidth: 15,
    maximumWidth: 75,
    minimumHeight: 15,
    maximumHeight: 75,
    dimensionStep: 6,
    starterCode: `def solve(width: int, height: int) -> None:
    # Your code goes here.
    return
`,
    referenceGenerator: (width, height) => {
      const buffer = createBuffer(width, height)
      const saffron   = { r: 255, g: 153, b: 51,  a: 255 }
      const indiaGreen = { r: 19,  g: 136, b: 8,   a: 255 }
      const chakraBlue = { r: 0,   g: 0,   b: 128, a: 255 }
 
      const s = Math.floor(height / 3)
      // Stripes
      for (let y = 0; y < height; y++) {
        const c = y < s ? saffron : y < s * 2 ? white : indiaGreen
        for (let x = 0; x < width; x++) buffer.setPixel(x, y, c)
      }
 
      // Chakra: centered in the white stripe (rows s to s*2-1)
      const cx = Math.floor(width / 2)
      const cy = s + Math.floor((s - 1) / 2)           // true center of the white band
      const chakraR = Math.floor((s - 1) / 2)          // guaranteed to stay inside the stripe
      const TWO_PI = Math.PI * 2
 
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const dx = x - cx, dy = y - cy
          const dist = Math.sqrt(dx * dx + dy * dy)
 
          // Ring: 1px thick outline
          if (Math.abs(dist - chakraR) < 0.8) {
            buffer.setPixel(x, y, chakraBlue)
            continue
          }
          // Spokes: 8 directions, all the way from center to ring (no hole)
          if (dist < chakraR) {
            for (let i = 0; i < 8; i++) {
              const spokeAngle = (i * TWO_PI) / 8
              const perpDist = Math.abs(dx * Math.sin(spokeAngle) - dy * Math.cos(spokeAngle))
              if (perpDist < 0.6) {
                buffer.setPixel(x, y, chakraBlue)
                break
              }
            }
          }
        }
      }
      return buffer
    },
    hiddenTestCases: [
      { width: 69, height: 51 },
      { width: 39, height: 27 },
    ],
  },
 
  // ─── HARD 2 ── Jamaica ───────────────────────────────────────────────────
  {
    id: 'w2-flag-jamaica',
    index: 9,
    title: 'Jamaica',
    description: 'Draw the Jamaican flag: two diagonal lines divide the canvas into four triangles. The top and bottom triangles are green, the left and right are black. The diagonal bars are gold.',
    difficulty: 'Hard',
    minimumWidth: 9,
    maximumWidth: 57,
    minimumHeight: 9,
    maximumHeight: 57,
    dimensionStep: 2,
    starterCode: `def solve(width: int, height: int) -> None:
    # Your code goes here.
    return
`,
    referenceGenerator: (width, height) => {
      const buffer = createBuffer(width, height)
      const jamaicaGold  = { r: 254, g: 209, b: 0,   a: 255 }
      const jamaicaGreen = { r: 0,   g: 163, b: 68,  a: 255 }
 
      const diagLen  = Math.sqrt(width * width + height * height)
      const barHalf  = Math.max(1, Math.round(Math.min(width, height) / 12))
 
      // s1: TL->BR  — H*x - W*y = 0
      // s2: BL->TR  — H*x + W*y - W*(H-1) = 0
      // Quadrant signs:
      //   TOP    s1 > 0, s2 < 0  → green
      //   BOTTOM s1 < 0, s2 > 0  → green
      //   LEFT   s1 < 0, s2 < 0  → black
      //   RIGHT  s1 > 0, s2 > 0  → black
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const s1  = height * x - width * y
          const s2  = height * x + width * y - width * (height - 1)
          const ad1 = Math.abs(s1) / diagLen
          const ad2 = Math.abs(s2) / diagLen
 
          if (ad1 < barHalf || ad2 < barHalf) {
            buffer.setPixel(x, y, jamaicaGold)
          } else if ((s1 > 0 && s2 < 0) || (s1 < 0 && s2 > 0)) {
            buffer.setPixel(x, y, jamaicaGreen)   // top & bottom
          } else {
            buffer.setPixel(x, y, black)           // left & right
          }
        }
      }
      return buffer
    },
    hiddenTestCases: [
      { width: 17, height: 13 },
      { width: 39, height: 27 },
    ],
  },
 
  // ─── EXTREME ── United Kingdom ───────────────────────────────────────────
  {
    id: 'w2-flag-uk',
    index: 10,
    title: 'United Kingdom',
    description: "Draw the Union Jack: a blue background, a white diagonal X cross, and a red upright cross centered on top. The white diagonals are one-tenth of the shorter dimension wide; the red cross is one-sixth.",
    difficulty: 'Extreme',
    minimumWidth: 23,
    maximumWidth: 55,
    minimumHeight: 23,
    maximumHeight: 55,
    dimensionStep: 2,
    starterCode: `def solve(width: int, height: int) -> None:
    # Your code goes here.
    return
`,
    referenceGenerator: (width, height) => {
      const buffer = createBuffer(width, height)
      const ukBlue = { r: 0,   g: 36,  b: 125, a: 255 }
      const ukRed  = { r: 207, g: 20,  b: 43,  a: 255 }
 
      const cx = Math.floor(width  / 2)
      const cy = Math.floor(height / 2)
      const diagNorm = Math.sqrt(width * width + height * height)
 
      // Half-widths
      const tAnd = Math.max(1, Math.round(Math.min(width, height) / 10))  // white X diagonals
      const tGeo = Math.max(1, Math.round(Math.min(width, height) / 6))   // red upright cross
 
      // Diagonal line distances (raw, un-normalised):
      // d1: TL->BR  — H*x - W*y = 0
      // d2: BL->TR  — H*x + W*y - W*(H-1) = 0
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const ad1 = Math.abs(height * x - width * y)                          / diagNorm
          const ad2 = Math.abs(height * x + width * y - width * (height - 1))   / diagNorm
 
          const onDiag  = ad1 < tAnd || ad2 < tAnd
          const onCross = Math.abs(y - cy) < tGeo      || Math.abs(x - cx) < tGeo
          const onOutline = Math.abs(y - cy) < tGeo + 1 || Math.abs(x - cx) < tGeo + 1
 
          // Paint order: blue → white X → white cross outline (1px border) → red cross
          let c = ukBlue
          if (onDiag)    c = white
          if (onOutline) c = white   // 1px white halo around the red cross
          if (onCross)   c = ukRed
 
          buffer.setPixel(x, y, c)
        }
      }
      return buffer
    },
    hiddenTestCases: [
      { width: 37, height: 27 },
      { width: 45, height: 33 },
    ],
  },
]
