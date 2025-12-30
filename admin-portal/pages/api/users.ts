import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db';
import { getAuthUser } from '../../lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = getAuthUser(req);
  if (!user) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }
  if (user.role !== 'ADMIN') {
    res.status(403).json({ success: false, error: 'Forbidden' });
    return;
  }

  if (req.method === 'GET') {
    try {
      const users = await db.user.findMany({
        include: {
          orgMemberships: true,
          ownedOrg: true,
        },
      });
      res.status(200).json({ success: true, data: users });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to fetch users' });
    }
  } else if (req.method === 'POST') {
    try {
      const { email, name, role, password } = req.body;
      
      const user = await db.user.create({
        data: {
          email,
          name,
          role: role || 'USER',
          password: password || null,
        },
      });
      
      res.status(201).json({ success: true, data: user });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to create user' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
