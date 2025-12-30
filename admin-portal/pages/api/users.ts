import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db';
import { User } from '../../types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const users = await db.user.findMany({
        include: {
          organization: true,
        },
      });
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch users' });
    }
  } else if (req.method === 'POST') {
    try {
      const { email, name, role, organizationId } = req.body;
      
      const user = await db.user.create({
        data: {
          email,
          name,
          role: role || 'USER',
          organizationId,
        },
      });
      
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to create user' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
