import { Router } from 'express'
import { getProgress, saveProgress } from '../controllers/progress'
import { authenticate } from '../middlewares/auth'

export const router = Router()

router.use(authenticate)

router.get('/', getProgress)
router.post('/', saveProgress)
