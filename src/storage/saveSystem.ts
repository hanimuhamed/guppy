const STORAGE_KEY = 'getsetpixel:save-v1'

export type SaveState = {
  currentWorld: number
  activeLevelId: string | null
  levelCode: Record<string, string>
  completedLevels: string[]
  unlockedLevels: string[]
  levelDimensions: Record<string, { width: number; height: number }>
}

const defaultState: SaveState = {
  currentWorld: 1,
  activeLevelId: null,
  levelCode: {},
  completedLevels: [],
  unlockedLevels: [],
  levelDimensions: {},
}

export const loadSaveState = (): SaveState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return defaultState
    }
    const parsed = JSON.parse(raw) as SaveState
    return {
      currentWorld: Number.isInteger(parsed.currentWorld) && parsed.currentWorld >= 1 && parsed.currentWorld <= 10
        ? parsed.currentWorld
        : 1,
      activeLevelId: parsed.activeLevelId ?? null,
      levelCode: parsed.levelCode ?? {},
      completedLevels: parsed.completedLevels ?? [],
      unlockedLevels: parsed.unlockedLevels ?? [],
      levelDimensions: parsed.levelDimensions ?? {},
    }
  } catch {
    return defaultState
  }
}

export const saveState = (state: SaveState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export const clearSaveState = () => {
  localStorage.removeItem(STORAGE_KEY)
}
