import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { loginSchema, registerSchema } from '../schemas'

export const runtime = 'edge'

const app = new Hono()
  .post(
    '/login',
    zValidator('json', loginSchema),
    (c) => {
      const { email, password } = c.req.valid('json')
      return c.json({ email, password })
    }
  )
  .post(
    '/register',
    zValidator('json', registerSchema),
    (c) => {
      const { email, password, username } = c.req.valid('json')
      return c.json({ email, password, username })
    }
  )

export default app
