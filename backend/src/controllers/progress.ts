import { Response } from 'express'
import { prisma } from '../db/prisma'
import { AuthenticatedRequest } from '../middlewares/auth'

export const getProgress = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id
    
    const progressRecords = await prisma.userProgress.findMany({
      where: { userId }
    })

    const completedLevels: string[] = []
    const levelCode: Record<string, string> = {}
    const levelDimensions: Record<string, { width: number, height: number }> = {}

    for (const record of progressRecords) {
      if (record.completed) {
        completedLevels.push(record.levelId)
      }
      if (record.code) {
        levelCode[record.levelId] = record.code
      }
      levelDimensions[record.levelId] = { width: record.width, height: record.height }
    }

    res.json({
      completedLevels,
      levelCode,
      levelDimensions
    })
  } catch (err: any) {
    console.error('Get progress error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const saveProgress = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id
    const { levelId, code, dimensions, completed } = req.body

    if (!levelId) {
      return res.status(400).json({ error: 'levelId is required' })
    }

    // Upsert progress
    await prisma.userProgress.upsert({
      where: {
        userId_levelId: {
          userId,
          levelId
        }
      },
      update: {
        code: code !== undefined ? code : undefined,
        width: dimensions?.width,
        height: dimensions?.height,
        completed: completed !== undefined ? completed : undefined
      },
      create: {
        userId,
        levelId,
        code: code || '',
        width: dimensions?.width || 5,
        height: dimensions?.height || 5,
        completed: completed || false
      }
    })

    // Optionally create a submission record if we consider this a final submit attempt
    // Currently, Guppy frontend hits "saveProgress" even on partial writes/dimensions change.
    // We only record a submission if it was specifically a 'completed = true' request,
    // or we can just let it update the progress. We'll skip submission history for now 
    // unless explicitly needed by a separate endpoint.

    res.json({ success: true })
  } catch (err: any) {
    console.error('Save progress error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
