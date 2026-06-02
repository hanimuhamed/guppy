const STORAGE_KEY = 'getsetpixel:save-v1'

export type SaveState = {
  activeLevelId: string | null
  levelCode: Record<string, string>
  completedLevels: string[]
  unlockedLevels: string[]
  levelDimensions: Record<string, { width: number; height: number }>
}

const defaultState: SaveState = {
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
