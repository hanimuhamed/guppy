import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../db/prisma'
import { AuthenticatedRequest } from '../middlewares/auth'

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
          { username }
        ]
      }
    })

    if (existingUser) {
      if (existingUser.username === username) {
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
