import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Fetch all active fences for the map
      const fences = await prisma.fence.findMany({
        where: {
          isActive: true,
        },
      });

      // Fetch recent animal locations
      const locations = await prisma.location.findMany({
        orderBy: {
          timestamp: 'desc',
        },
        take: 100, // Limit to last 100 locations
      });

      // Fetch all devices
      const devices = await prisma.device.findMany({
        include: {
          pairedAnimal: true,
        },
      });

      res.status(200).json({
        success: true,
        data: {
          fences,
          locations,
          devices,
        },
      });
    } catch (error) {
      console.error('Error fetching map data:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch map data',
      });
    }
  } else if (req.method === 'POST') {
    try {
      // Create a new fence
      const { name, coordinates, fenceType, organizationId } = req.body;

      const newFence = await prisma.fence.create({
        data: {
          name,
          coordinates: coordinates,
          fenceType,
          organizationId,
          isActive: true,
        },
      });

      res.status(201).json({
        success: true,
        data: newFence,
      });
    } catch (error) {
      console.error('Error creating fence:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create fence',
      });
    }
  } else {
    res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }
}
