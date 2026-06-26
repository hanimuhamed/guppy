import { Router } from 'express'
import { signup, login, getMe } from '../controllers/auth'
import { authenticate } from '../middlewares/auth'

export const router = Router()

router.post('/signup', signup)
router.post('/login', login)
router.get('/me', authenticate, getMe)
