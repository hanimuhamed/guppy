import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../db/prisma'
import { AuthenticatedRequest } from '../middlewares/auth'
import { validateUsername } from '../utils/validation'

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'super-secret-jwt-key', {
    expiresIn: '7d'
  })
}

// Helper to fetch user info from Google using access_token
const getGoogleUser = async (accessToken: string) => {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
  if (!response.ok) {
    throw new Error('Failed to fetch Google user profile')
  }
  return response.json()
}

export const signup = async (req: Request, res: Response) => {
  try {
    const { token, username, favoriteColor } = req.body

    if (!token || !username) {
      return res.status(400).json({ error: 'Google token and username are required' })
    }

    const validationError = validateUsername(username)
    if (validationError) {
      return res.status(400).json({ error: validationError })
    }

    const payload = await getGoogleUser(token)
    
    if (!payload || !payload.email || !payload.sub) {
      return res.status(400).json({ error: 'Invalid Google token' })
    }

    const email = payload.email
    const googleId = payload.sub

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { googleId },
          { username: { equals: username, mode: 'insensitive' } }
        ]
      }
    })

    if (existingUser) {
      if (existingUser.username.toLowerCase() === username.toLowerCase()) {
        return res.status(400).json({ error: 'Username already exists' })
      }
      return res.status(400).json({ error: 'Account already exists. Please log in.' })
    }

    const user = await prisma.user.create({
      data: {
        username,
        email,
        googleId,
        favoriteColor: favoriteColor || '#FF5C5C',
      }
    })

    const jwtToken = generateToken(user.id)
    res.json({ token: jwtToken, user })
  } catch (err: any) {
    console.error('Signup error:', err)
    res.status(500).json({ error: 'Internal server error or invalid token' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({ error: 'Google token is required' })
    }

    const payload = await getGoogleUser(token)
    
    if (!payload || !payload.email) {
      return res.status(400).json({ error: 'Invalid Google token' })
    }

    const email = payload.email

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(404).json({ error: 'Account not found. Please sign up first.' })
    }

    const jwtToken = generateToken(user.id)
    res.json({ token: jwtToken, user })
  } catch (err: any) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Internal server error or invalid token' })
  }
}

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  res.json(req.user)
}

export const updateMe = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { username, favoriteColor } = req.body

  try {
    if (username && username !== req.user.username) {
      const validationError = validateUsername(username)
      if (validationError) {
        return res.status(400).json({ error: validationError })
      }

      const existingUser = await prisma.user.findFirst({
        where: { username: { equals: username, mode: 'insensitive' } }
      })
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' })
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        username: username || req.user.username,
        favoriteColor: favoriteColor || req.user.favoriteColor
      }
    })

    res.json(updatedUser)
  } catch (err: any) {
    console.error('Update profile error:', err)
    res.status(500).json({ error: 'Failed to update profile' })
  }
}

export const deleteMe = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    // Prisma will cascade delete UserProgress if configured correctly in schema
    // Otherwise we need to explicitly delete it first
    await prisma.userProgress.deleteMany({
      where: { userId: req.user.id }
    })
    
    await prisma.user.delete({
      where: { id: req.user.id }
    })

    res.json({ success: true, message: 'Account deleted successfully' })
  } catch (err: any) {
    console.error('Delete account error:', err)
    res.status(500).json({ error: 'Failed to delete account' })
  }
}
