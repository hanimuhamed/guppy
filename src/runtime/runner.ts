import { PixelBuffer } from '../engine/pixelBuffer'

const WORKER_TIMEOUT_MS = 3000

type WorkerResponse =
  | { id: number; ok: true; buffer?: Uint8ClampedArray }
  | { id: number; ok: false; error: string }

let worker: Worker | null = null
let nextId = 1
let workerReady: Promise<void> | null = null
const pending = new Map<
  number,
  { resolve: (data: Uint8ClampedArray) => void; reject: (error: Error) => void; timeout: number }
>()

const ensureWorker = () => {
  if (worker) {
    return worker
  }
  worker = new Worker(new URL('./pyWorker.ts', import.meta.url), { type: 'module' })
  worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
    const { id } = event.data
    const entry = pending.get(id)
    if (!entry) {
      return
    }
    clearTimeout(entry.timeout)
    pending.delete(id)
    if (!event.data.ok) {
      const errorMessage = 'error' in event.data ? event.data.error : 'Worker error'
      entry.reject(new Error(errorMessage))
      return
    }
    if ('buffer' in event.data && event.data.buffer) {
      entry.resolve(event.data.buffer)
      return
    }
    entry.resolve(new Uint8ClampedArray())
  }
  worker.onerror = (error) => {
    pending.forEach((entry) => {
      clearTimeout(entry.timeout)
      entry.reject(new Error(error.message))
    })
    pending.clear()
  }
  return worker
}

const resetWorker = () => {
  if (worker) {
    worker.terminate()
    worker = null
  }
  workerReady = null
}

const initWorker = async () => {
  if (workerReady) {
    return workerReady
  }
  const currentWorker = ensureWorker()
  const id = nextId
  nextId += 1

  workerReady = new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      pending.delete(id)
      resetWorker()
      reject(new Error('Pyodide failed to initialize.'))
    }, WORKER_TIMEOUT_MS)

    pending.set(id, {
      resolve: () => resolve(),
      reject,
      timeout,
    })
    currentWorker.postMessage({ type: 'init', id })
  })

  return workerReady
}

export const warmupPyWorker = async () => {
  try {
    await initWorker()
  } catch {
    // Ignore warmup errors; surfaced on first run.
  }
}



export const runLevelCode = async (code: string, width: number, height: number) => {
  const currentWorker = ensureWorker()
  await initWorker()
  const id = nextId
  nextId += 1
  console.count("runProgram");
  const buffer = await new Promise<Uint8ClampedArray>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      pending.delete(id)
      resetWorker()
      reject(new Error(`Execution timed out after ${WORKER_TIMEOUT_MS / 1000}s. Check for infinite loops.`))
    }, WORKER_TIMEOUT_MS)

    pending.set(id, { resolve, reject, timeout })
    currentWorker.postMessage({ type: 'run', id, code, width, height })
  })

  const output = new PixelBuffer(width, height)
  if (buffer.length) {
    output.data.set(buffer)
  }
  return output
}
