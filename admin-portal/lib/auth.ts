import type { NextApiRequest } from 'next'
import jwt from 'jsonwebtoken'

export type AuthUser = {
  id: string
  email: string
  role?: string
}

export function getAuthUser(req: NextApiRequest): AuthUser | null {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.slice('Bearer '.length).trim()
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET
  if (!secret) {
    return null
  }

  try {
    const payload = jwt.verify(token, secret) as jwt.JwtPayload
    if (!payload?.sub || typeof payload.sub !== 'string') {
      return null
    }
    return {
      id: payload.sub,
      email: typeof payload.email === 'string' ? payload.email : '',
      role: typeof payload.role === 'string' ? payload.role : undefined,
    }
  } catch {
    return null
  }
}
