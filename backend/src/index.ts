import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { router as authRouter } from './routes/auth'
import { router as progressRouter } from './routes/progress'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/progress', progressRouter)
app.use('/api/users', authRouter) // getMe is essentially auth profile

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' })
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
