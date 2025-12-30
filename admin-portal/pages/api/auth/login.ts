import type { NextApiRequest, NextApiResponse } from 'next'
import db from '../../../lib/db'
import { randomBytes } from 'crypto'

type AuthResponse = {
  token: string
  refreshToken: string
  user: {
    id: string
    email: string
    name: string | null
  }
}

function makeToken() {
  return randomBytes(32).toString('hex')
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { email, password } = req.body as {
    email?: string
    password?: string
  }

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' })
    return
  }

  const user = await db.user.findUnique({ where: { email } })
  if (!user || !user.password || user.password !== password) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }

  res.status(200).json({
    token: makeToken(),
    refreshToken: makeToken(),
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  })
}
