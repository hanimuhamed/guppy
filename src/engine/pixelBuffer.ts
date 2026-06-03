// pixelBuffer.ts
export type RgbaColor = { r: number; g: number; b: number; a: number }

const clamp8 = (value: number) => Math.min(255, Math.max(0, Math.round(value)))

export const parseColorInput = (input: unknown): RgbaColor | null => {
  if (!input) {
    return null
  }

  if (typeof input === 'string') {
    const value = input.trim().toLowerCase()
    if (value.startsWith('#')) {
      const hex = value.slice(1)
      if (hex.length === 3) {
        const r = parseInt(hex[0] + hex[0], 16)
        const g = parseInt(hex[1] + hex[1], 16)
        const b = parseInt(hex[2] + hex[2], 16)
        return { r, g, b, a: 255 }
      }
      if (hex.length === 6) {
        const r = parseInt(hex.slice(0, 2), 16)
        const g = parseInt(hex.slice(2, 4), 16)
        const b = parseInt(hex.slice(4, 6), 16)
        return { r, g, b, a: 255 }
      }
      if (hex.length === 8) {
        const r = parseInt(hex.slice(0, 2), 16)
        const g = parseInt(hex.slice(2, 4), 16)
        const b = parseInt(hex.slice(4, 6), 16)
        const a = parseInt(hex.slice(6, 8), 16)
        return { r, g, b, a }
      }
    }
  }

  if (Array.isArray(input)) {
    const [r, g, b, a] = input
    if ([r, g, b].every((value) => typeof value === 'number')) {
      return {
        r: clamp8(r),
        g: clamp8(g),
        b: clamp8(b),
        a: typeof a === 'number' ? clamp8(a) : 255,
      }
    }
  }

  if (typeof input === 'object') {
    const color = input as Partial<RgbaColor>
    if (
      typeof color.r === 'number' &&
      typeof color.g === 'number' &&
      typeof color.b === 'number'
    ) {
      return {
        r: clamp8(color.r),
        g: clamp8(color.g),
        b: clamp8(color.b),
        a: typeof color.a === 'number' ? clamp8(color.a) : 255,
      }
    }
  }

  return null
}

export class PixelBuffer {
  readonly width: number
  readonly height: number
  readonly data: Uint8ClampedArray

  constructor(width: number, height: number, fill?: RgbaColor) {
    this.width = width
    this.height = height
    this.data = new Uint8ClampedArray(width * height * 4)
    const color = fill ?? { r: 255, g: 255, b: 255, a: 255 }
    for (let i = 0; i < this.data.length; i += 4) {
      this.data[i] = color.r
      this.data[i + 1] = color.g
      this.data[i + 2] = color.b
      this.data[i + 3] = color.a
    }
  }

  setPixel(x: number, y: number, color: RgbaColor) {
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      return
    }
    const xi = Math.floor(x)
    const yi = Math.floor(y)
    if (xi < 0 || yi < 0 || xi >= this.width || yi >= this.height) {
      return
    }
    const index = (yi * this.width + xi) * 4
    this.data[index] = color.r
    this.data[index + 1] = color.g
    this.data[index + 2] = color.b
    this.data[index + 3] = color.a
  }

  getPixel(x: number, y: number): RgbaColor | null {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return null
    }
    const index = (y * this.width + x) * 4
    return {
      r: this.data[index],
      g: this.data[index + 1],
      b: this.data[index + 2],
      a: this.data[index + 3],
    }
  }

  clone(): PixelBuffer {
    const clone = new PixelBuffer(this.width, this.height)
    clone.data.set(this.data)
    return clone
  }
}
