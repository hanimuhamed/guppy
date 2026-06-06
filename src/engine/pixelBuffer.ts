import {
  createPixelData,
  getPixelData,
  deletePixelData,
} from './pixelStore.ts'

export type RgbaColor = {
  r: number
  g: number
  b: number
  a: number
}

// const clamp8 = (value: number) => Math.min(255, Math.max(0, Math.round(value)))

export class PixelBuffer {
  readonly width: number
  readonly height: number
  readonly pixelId: number

  constructor(
    width: number,
    height: number,
    fill?: RgbaColor,
  ) {
    console.count('PixelBuffer created')

    this.width = width
    this.height = height

    const { id, data } = createPixelData(width, height)

    this.pixelId = id

    const color = fill ?? {
      r: 255,
      g: 255,
      b: 255,
      a: 255,
    }

    for (let i = 0; i < data.length; i += 4) {
      data[i] = color.r
      data[i + 1] = color.g
      data[i + 2] = color.b
      data[i + 3] = color.a
    }
  }

  get data() {
    return getPixelData(this.pixelId)
  }

  dispose() {
    deletePixelData(this.pixelId)
  }

  setPixel(x: number, y: number, color: RgbaColor) {
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      return
    }

    const xi = Math.floor(x)
    const yi = Math.floor(y)

    if (
      xi < 0 ||
      yi < 0 ||
      xi >= this.width ||
      yi >= this.height
    ) {
      return
    }

    const index = (yi * this.width + xi) * 4

    const data = this.data

    data[index] = color.r
    data[index + 1] = color.g
    data[index + 2] = color.b
    data[index + 3] = color.a
  }

  getPixel(x: number, y: number): RgbaColor | null {
    if (
      x < 0 ||
      y < 0 ||
      x >= this.width ||
      y >= this.height
    ) {
      return null
    }

    const data = this.data

    const index = (y * this.width + x) * 4

    return {
      r: data[index],
      g: data[index + 1],
      b: data[index + 2],
      a: data[index + 3],
    }
  }

  clone(): PixelBuffer {
    const clone = new PixelBuffer(
      this.width,
      this.height,
    )

    clone.data.set(this.data)

    return clone
  }
}