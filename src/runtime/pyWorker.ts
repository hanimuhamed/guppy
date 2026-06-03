//pyWorker.ts
import { loadPyodide, type PyodideInterface } from 'pyodide'

type InitRequest = { type: 'init'; id: number }
type RunRequest = {
  type: 'run'
  id: number
  code: string
  width: number
  height: number
}

type WorkerRequest = InitRequest | RunRequest

type InitResponse = { id: number; ok: true }
type RunResponse =
  | { id: number; ok: true; buffer: Uint8ClampedArray }
  | { id: number; ok: false; error: string }

//type WorkerResponse = InitResponse | RunResponse

const clamp8 = (value: number) => Math.min(255, Math.max(0, Math.round(value)))

const parseColorInput = (input: unknown) => {
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
    const color = input as { r?: number; g?: number; b?: number; a?: number }
    if (typeof color.r === 'number' && typeof color.g === 'number' && typeof color.b === 'number') {
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

let pyodidePromise: Promise<PyodideInterface> | null = null

const workerSelf = self as unknown as {
  location: { origin: string }
  postMessage: (message: unknown, transfer?: Transferable[]) => void
}

const getPyodide = () => {
  if (!pyodidePromise) {
    const origin = workerSelf.location.origin
    const indexURL = new URL('/pyodide/', origin).toString()
    pyodidePromise = loadPyodide({ indexURL })
  }
  return pyodidePromise
}

const formatPythonError = (message: string) => {
  const lines = message.split('\n').map((line) => line.trim()).filter(Boolean)
  const lastLine = lines[lines.length - 1] ?? message
  // Prefer the last traceback line, which contains the actual error.
  return lastLine
}



self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const message = event.data
  if (message.type === 'init') {
    try {
      await getPyodide()
      const response: InitResponse = { id: message.id, ok: true }
      workerSelf.postMessage(response)
    } catch (error) {
      const response: RunResponse = {
        id: message.id,
        ok: false,
        error: formatPythonError(error instanceof Error ? error.message : String(error)),
      }
      workerSelf.postMessage(response)
    }
    return
  }

  const { id, code, width, height } = message
  try {
    const pyodide = await getPyodide()
    const buffer = new Uint8ClampedArray(width * height * 4)
    for (let i = 0; i < buffer.length; i += 4) {
      buffer[i] = 255
      buffer[i + 1] = 255
      buffer[i + 2] = 255
      buffer[i + 3] = 255
    }

    pyodide.globals.set('WIDTH', width)
    pyodide.globals.set('HEIGHT', height)
    pyodide.globals.set('setPixel', (x: number, y: number, colorInput: unknown) => {
      const color = parseColorInput(colorInput)
      if (!color) {
        return
      }
      const xi = Math.floor(x)
      const yi = Math.floor(y)
      if (xi < 0 || yi < 0 || xi >= width || yi >= height) {
        return
      }
      const idx = (yi * width + xi) * 4
      buffer[idx] = color.r
      buffer[idx + 1] = color.g
      buffer[idx + 2] = color.b
      buffer[idx + 3] = color.a
    })
    /*console.log(pyodide.runPython(`
import gc
len(globals())
`))*/
    console.count("worker run");
    await pyodide.runPythonAsync(code)
    const solve = pyodide.globals.get('solve')
    if (!solve) {
      throw new Error('Define solve(width, height) to generate pixels.')
    }
    try {
      const result = solve(width, height)
      if (result && typeof result === 'object' && 'destroy' in result) {
        ;(result as { destroy: () => void }).destroy()
      }
    } finally {
      if (typeof solve === 'object' && 'destroy' in solve) {
        ;(solve as { destroy: () => void }).destroy()
      }
    }

    const response: RunResponse = { id, ok: true, buffer }
    workerSelf.postMessage(response, [buffer.buffer])
  } catch (error) {
    const response: RunResponse = {
      id,
      ok: false,
      error: formatPythonError(error instanceof Error ? error.message : String(error)),
    }
    workerSelf.postMessage(response)
  }
}
