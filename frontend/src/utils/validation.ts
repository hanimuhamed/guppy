import { Filter } from 'bad-words'

const filter = new Filter()

const RESERVED_USERNAMES = [
  'admin', 'administrator', 'root', 'system', 'guest', 'ghost', 'support',
  'api', 'www', 'null', 'undefined', 'owner', 'staff', 'moderator', 'mod',
  'developer', 'dev', 'guppy', 'test', 'profile', 'account', 'user',
]

export const validateUsername = (username: string): string | null => {
  if (!username) return 'Username is required'
  
  if (username.length < 3 || username.length > 20) {
    return 'Username must be between 3 and 20 characters'
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'Username can only contain letters, numbers, and underscores'
  }

  if (RESERVED_USERNAMES.includes(username.toLowerCase())) {
    return 'This username is reserved and cannot be used'
  }

  if (filter.isProfane(username)) {
    return 'Please choose a more appropriate username'
  }

  return null
}
