import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import db from '../../../lib/db'

function signToken(payload: Record<string, unknown>) {
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET
  if (!secret) {
    throw new Error('JWT secret is not configured')
  }
  return jwt.sign(payload, secret, { expiresIn: '7d' })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { email, name, password } = req.body

  if (!email || !name || !password) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    })

    res.status(201).json({
      token: signToken({ sub: user.id, email: user.email, role: user.role }),
      refreshToken: signToken({ sub: user.id, type: 'refresh' }),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
