import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../db/prisma'
import { AuthenticatedRequest } from '../middlewares/auth'

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'super-secret-jwt-key', {
    expiresIn: '7d'
  })
}

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, password, favoriteColor, leastFavoriteColor } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' })
    }

    const existingUser = await prisma.user.findUnique({
      where: { username }
    })

    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        username,
        passwordHash,
        favoriteColor: favoriteColor || '#FF5C5C',
        leastFavoriteColor: leastFavoriteColor || '#272a31'
      }
    })

    const token = generateToken(user.id)
    
    // Omit passwordHash
    const { passwordHash: _, ...safeUser } = user

    res.json({ token, user: safeUser })
  } catch (err: any) {
    console.error('Signup error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body

    const user = await prisma.user.findUnique({
      where: { username }
    })

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash)
    
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const token = generateToken(user.id)
    const { passwordHash: _, ...safeUser } = user

    res.json({ token, user: safeUser })
  } catch (err: any) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  const { passwordHash: _, ...safeUser } = req.user
  res.json(safeUser)
}
