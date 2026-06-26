/**
 * Simple string hash function to generate a deterministic seed
 */
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}

/**
 * Generates a 7x7 pixel art avatar based on username.
 * The left 4 columns are generated deterministically, and the right 3 columns
 * mirror the left 3 columns (left half mirrored into right half).
 * Uses favoriteColor and defaults to transparent for empty space.
 */
export function generateAvatarPixels(username: string, favoriteColor: string): string[][] {
  const seed = hashString(username)
  
  // Custom pseudo-random number generator based on the seed
  let currentSeed = seed
  const random = () => {
    const x = Math.sin(currentSeed++) * 10000
    return x - Math.floor(x)
  }

  const grid: string[][] = Array(7).fill(null).map(() => Array(7).fill('transparent'))
  
  // Generate left 4 columns
  for (let y = 0; y < 7; y++) {
    for (let x = 0; x < 4; x++) {
      if (random() > 0.5) {
        grid[y][x] = favoriteColor
      } else {
        grid[y][x] = 'transparent'
      }
    }
  }

  // Mirror left 3 columns into right 3 columns
  for (let y = 0; y < 7; y++) {
    for (let x = 0; x < 3; x++) {
      grid[y][6 - x] = grid[y][x]
    }
  }

  return grid
}
