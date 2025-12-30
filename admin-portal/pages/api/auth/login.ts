import type { NextApiRequest, NextApiResponse } from 'next'
import db from '../../../lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

type AuthResponse = {
  token: string
  refreshToken: string
  user: {
    id: string
    email: string
    name: string | null
  }
}

function signToken(payload: Record<string, unknown>) {
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET
  if (!secret) {
    throw new Error('JWT secret is not configured')
  }
  return jwt.sign(payload, secret, { expiresIn: '7d' })
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
  if (!user || !user.password) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }

  const passwordOk = await bcrypt.compare(password, user.password)
  if (!passwordOk) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }

  res.status(200).json({
    token: signToken({ sub: user.id, email: user.email, role: user.role }),
    refreshToken: signToken({ sub: user.id, type: 'refresh' }),
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  })
}
