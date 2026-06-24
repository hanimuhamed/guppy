// pixelStore.ts

const store = new Map<number, Uint8ClampedArray>()

let nextId = 1

export const createPixelData = (
  width: number,
  height: number,
): { id: number; data: Uint8ClampedArray } => {
  const id = nextId++
  const data = new Uint8ClampedArray(width * height * 4)

  store.set(id, data)
  // console.count("pixel data created")
  return { id, data }
}

export const getPixelData = (id: number) => {
  const data = store.get(id)

  if (!data) {
    throw new Error(`Pixel data ${id} not found`)
  }

  return data
}

export const deletePixelData = (id: number) => {
  store.delete(id)
  // console.count("pixel data deleted")
}