import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../db/prisma'

export interface AuthenticatedRequest extends Request {
  user?: any
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'super-secret-jwt-key') as { userId: string }
    
    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    })
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}
