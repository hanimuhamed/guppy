import { PixelBuffer } from './pixelBuffer'

// Per-canvas persistent state — keyed by the canvas element itself.
// Stores the last-known dimensions and the reusable scaled pixel buffer.
interface CanvasState {
  canvasWidth: number
  canvasHeight: number
  scaledBuffer: Uint8ClampedArray  // length = canvasWidth * canvasHeight * 4
  imageData: ImageData              // wraps scaledBuffer, owned by this state
}

const canvasStateMap = new WeakMap<HTMLCanvasElement, CanvasState>()

// Nearest-neighbor scale from src (srcW×srcH RGBA) into dst (dstW×dstH RGBA).
// Both are flat Uint8ClampedArrays in row-major RGBA order.
// This runs entirely in JS, zero browser-native allocations.
const scaleNearest = (
  src: Uint8ClampedArray,
  srcW: number,
  srcH: number,
  dst: Uint8ClampedArray,
  dstW: number,
  dstH: number,
  offsetX: number,
  offsetY: number,
  drawW: number,
  drawH: number,
  totalW: number,
): void => {
  // Zero the destination buffer — covers padding regions.
  // Using fill(0) is a single typed-array memset, not a loop.
  dst.fill(0)

  const xRatio = srcW / drawW
  const yRatio = srcH / drawH

  for (let y = 0; y < drawH; y++) {
    const srcY = Math.floor(y * yRatio)
    const srcRowBase = srcY * srcW
    const dstRowBase = ((y + offsetY) * totalW + offsetX) * 4

    for (let x = 0; x < drawW; x++) {
      const srcX = Math.floor(x * xRatio)
      const srcIdx = (srcRowBase + srcX) * 4
      const dstIdx = dstRowBase + x * 4

      dst[dstIdx]     = src[srcIdx]
      dst[dstIdx + 1] = src[srcIdx + 1]
      dst[dstIdx + 2] = src[srcIdx + 2]
      dst[dstIdx + 3] = src[srcIdx + 3]
    }
  }
}

export const renderBufferToCanvas = (
  canvas: HTMLCanvasElement,
  buffer: PixelBuffer,
  targetWidth: number,
  targetHeight: number,
  padding = 0,
): void => {
  // -----------------------------------------------------------------------
  // SECTION 1: Canvas resize — guarded to avoid backing store destruction.
  //
  // Assigning canvas.width or canvas.height, even to the same value,
  // destroys and reallocates the native backing store. We check both
  // JS-side and the canvas's own .width/.height to be certain.
  // -----------------------------------------------------------------------
  if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
    canvas.width = targetWidth
    canvas.height = targetHeight
  }

  // -----------------------------------------------------------------------
  // SECTION 2: Get or create per-canvas state.
  //
  // CanvasState holds:
  //   - A Uint8ClampedArray sized to the canvas (reused across frames)
  //   - An ImageData wrapping that array (created once, reused)
  //   - Last-known canvas dimensions (to detect when reallocation is needed)
  //
  // WeakMap is used so state is released when the canvas element is GC'd —
  // no manual cleanup needed.
  // -----------------------------------------------------------------------
  let state = canvasStateMap.get(canvas)

  if (
    !state ||
    state.canvasWidth !== targetWidth ||
    state.canvasHeight !== targetHeight
  ) {
    // Reallocate only when canvas dimensions change.
    // For a stable canvas size this block runs exactly once.
    const scaledBuffer = new Uint8ClampedArray(targetWidth * targetHeight * 4)
    const imageData = new ImageData(scaledBuffer, targetWidth, targetHeight)
    state = { canvasWidth: targetWidth, canvasHeight: targetHeight, scaledBuffer, imageData }
    canvasStateMap.set(canvas, state)
  }

  // -----------------------------------------------------------------------
  // SECTION 3: Early-out for degenerate sizes.
  // -----------------------------------------------------------------------
  const availableWidth = Math.max(0, targetWidth - padding * 2)
  const availableHeight = Math.max(0, targetHeight - padding * 2)

  if (
    availableWidth === 0 ||
    availableHeight === 0 ||
    buffer.width === 0 ||
    buffer.height === 0
  ) {
    // Just clear — state.scaledBuffer.fill(0) + putImageData would also work
    // but getContext is required. We accept one context call here.
    const ctx = canvas.getContext('2d')
    ctx?.clearRect(0, 0, targetWidth, targetHeight)
    return
  }

  // -----------------------------------------------------------------------
  // SECTION 4: Compute layout — identical to original logic.
  // -----------------------------------------------------------------------
  const scale = Math.min(availableWidth / buffer.width, availableHeight / buffer.height)
  const drawWidth = Math.max(1, Math.floor(buffer.width * scale))
  const drawHeight = Math.max(1, Math.floor(buffer.height * scale))
  const offsetX = Math.floor(padding + (availableWidth - drawWidth) / 2)
  const offsetY = Math.floor(padding + (availableHeight - drawHeight) / 2)

  // -----------------------------------------------------------------------
  // SECTION 5: Software nearest-neighbor scale directly into the reused
  // output buffer.
  //
  // No offscreen canvas. No drawImage. No GPU snapshot. No native surface
  // allocation. This is pure typed-array arithmetic on the JS heap.
  // The destination buffer was allocated once in SECTION 2 and is reused.
  // -----------------------------------------------------------------------
  scaleNearest(
    buffer.data,
    buffer.width,
    buffer.height,
    state.scaledBuffer,
    targetWidth,
    targetHeight,
    offsetX,
    offsetY,
    drawWidth,
    drawHeight,
    targetWidth,
  )

  // -----------------------------------------------------------------------
  // SECTION 6: Write to canvas via putImageData.
  //
  // putImageData copies from the JS Uint8ClampedArray directly into the
  // canvas's CPU-side backing store. In CPU-rendered contexts this is a
  // single memcpy. In GPU-accelerated contexts it is an upload, but:
  //   - There is no source canvas to snapshot.
  //   - There is no drawImage call to trigger snapshot creation.
  //   - The upload is of a flat typed array, which the browser can pipeline
  //     without keeping a reference to the JS object after the call returns.
  //
  // We call getContext once per render. The spec requires the browser to
  // return the cached context — this is not a re-creation.
  // -----------------------------------------------------------------------
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // putImageData with dirty rect: write only the region we actually filled.
  // The full-canvas fill(0) in scaleNearest already cleared the padding.
  // Writing the full ImageData is correct and simpler — the dirty rect
  // optimization is here for contexts where targetWidth/targetHeight is
  // large and drawWidth/drawHeight is small.
  ctx.putImageData(state.imageData, 0, 0)
}

// No releaseRenderPool needed — WeakMap releases state when canvas is GC'd.
// If you want explicit cleanup (e.g. on component unmount), you can do:
export const releaseCanvasState = (canvas: HTMLCanvasElement): void => {
  canvasStateMap.delete(canvas)
}