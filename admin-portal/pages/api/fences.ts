import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/db';
import { getAuthUser } from '../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = getAuthUser(req);
  if (!user) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }

  if (req.method === 'GET') {
    try {
      const { organizationId } = req.query;

      const fences = await prisma.fence.findMany({
        where: {
          organizationId: organizationId as string,
          isActive: true,
        },
      });

      res.status(200).json({
        success: true,
        data: fences,
      });
    } catch (error) {
      console.error('Error fetching fences:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch fences',
      });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, coordinates, fenceType, organizationId } = req.body;

      const newFence = await prisma.fence.create({
        data: {
          name,
          coordinates,
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
  } else if (req.method === 'PUT') {
    try {
      const { id, name, coordinates, fenceType, isActive } = req.body;

      const updatedFence = await prisma.fence.update({
        where: { id },
        data: {
          name,
          coordinates,
          fenceType,
          isActive,
        },
      });

      res.status(200).json({
        success: true,
        data: updatedFence,
      });
    } catch (error) {
      console.error('Error updating fence:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update fence',
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      await prisma.fence.delete({
        where: { id: id as string },
      });

      res.status(200).json({
        success: true,
        message: 'Fence deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting fence:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete fence',
      });
    }
  } else {
    res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }
}
