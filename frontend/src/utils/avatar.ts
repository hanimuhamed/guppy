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
 * The top 4 rows are generated deterministically, and the bottom 3 rows
 * mirror the top 3 rows (top half mirrored into bottom half).
 * Uses favoriteColor and leastFavoriteColor.
 */
export function generateAvatarPixels(username: string, favoriteColor: string, leastFavoriteColor: string): string[][] {
  const seed = hashString(username + favoriteColor + leastFavoriteColor)
  
  // Custom pseudo-random number generator based on the seed
  let currentSeed = seed
  const random = () => {
    const x = Math.sin(currentSeed++) * 10000
    return x - Math.floor(x)
  }

  const grid: string[][] = Array(7).fill(null).map(() => Array(7).fill(leastFavoriteColor))
  
  // Generate top 4 rows
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 7; x++) {
      if (random() > 0.5) {
        grid[y][x] = favoriteColor
      } else {
        grid[y][x] = leastFavoriteColor
      }
    }
  }

  // Mirror top 3 rows into bottom 3 rows
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 7; x++) {
      grid[6 - y][x] = grid[y][x]
    }
  }

  return grid
}
