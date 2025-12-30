import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Get all devices
    try {
      const { organizationId, userId, animalId, deviceType, status, limit, offset } = req.query;

      // Build query filters
      const whereClause: any = {};
      
      if (organizationId) {
        whereClause.organizationId = String(organizationId);
      }
      
      if (userId) {
        whereClause.userId = String(userId);
      }
      
      if (animalId) {
        whereClause.id = { 
          in: (await prisma.animal.findMany({
            where: { id: String(animalId) },
            select: { deviceId: true }
          })).map(a => a.deviceId)
        };
      }
      
      if (deviceType) {
        whereClause.deviceType = String(deviceType);
      }
      
      if (status) {
        whereClause.status = String(status);
      }

      const devices = await prisma.device.findMany({
        where: whereClause,
        orderBy: {
          createdAt: 'desc'
        },
        skip: offset ? parseInt(String(offset)) : 0,
        take: limit ? parseInt(String(limit)) : 100, // Default to 100 records
        include: {
          pairedAnimal: {
            select: {
              id: true,
              name: true,
              animalType: true
            }
          },
          lastLocation: {
            select: {
              id: true,
              latitude: true,
              longitude: true,
              timestamp: true,
              accuracy: true
            }
          },
          organization: {
            select: {
              id: true,
              name: true
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      res.status(200).json(devices);
    } catch (error) {
      console.error('Error fetching devices:', error);
      res.status(500).json({ message: 'Error fetching devices' });
    }
  } else if (req.method === 'POST') {
    // Create a new device
    try {
      const { deviceId, name, deviceType, status, batteryLevel, firmwareVersion, organizationId, userId } = req.body;

      if (!deviceId || !name || !deviceType) {
        return res.status(400).json({ message: 'deviceId, name, and deviceType are required' });
      }

      // Check if device already exists
      const existingDevice = await prisma.device.findUnique({
        where: { deviceId }
      });

      if (existingDevice) {
        return res.status(409).json({ message: 'Device with this ID already exists' });
      }

      // Check if organization exists if provided
      if (organizationId) {
        const organization = await prisma.organization.findUnique({
          where: { id: organizationId }
        });
        if (!organization) {
          return res.status(404).json({ message: 'Organization not found' });
        }
      }

      // Check if user exists if provided
      if (userId) {
        const user = await prisma.user.findUnique({
          where: { id: userId }
        });
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
      }

      // Create the device
      const device = await prisma.device.create({
        data: {
          deviceId,
          name,
          deviceType,
          status: status || 'DISCONNECTED',
          batteryLevel: batteryLevel || null,
          firmwareVersion: firmwareVersion || null,
          organizationId: organizationId || null,
          userId: userId || null,
        },
        include: {
          pairedAnimal: {
            select: {
              id: true,
              name: true,
              animalType: true
            }
          },
          lastLocation: {
            select: {
              id: true,
              latitude: true,
              longitude: true,
              timestamp: true,
              accuracy: true
            }
          },
          organization: {
            select: {
              id: true,
              name: true
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      res.status(201).json(device);
    } catch (error) {
      console.error('Error creating device:', error);
      res.status(500).json({ message: 'Error creating device' });
    }
  } else if (req.method === 'PUT') {
    // Update a device
    try {
      const { id } = req.query;
      const { name, deviceType, status, batteryLevel, firmwareVersion, organizationId, userId } = req.body;

      if (!id) {
        return res.status(400).json({ message: 'Device ID is required' });
      }

      // Check if organization exists if provided
      if (organizationId) {
        const organization = await prisma.organization.findUnique({
          where: { id: organizationId }
        });
        if (!organization) {
          return res.status(404).json({ message: 'Organization not found' });
        }
      }

      // Check if user exists if provided
      if (userId) {
        const user = await prisma.user.findUnique({
          where: { id: userId }
        });
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
      }

      const device = await prisma.device.update({
        where: { id: String(id) },
        data: {
          name: name || undefined,
          deviceType: deviceType || undefined,
          status: status || undefined,
          batteryLevel: batteryLevel !== undefined ? batteryLevel : undefined,
          firmwareVersion: firmwareVersion || undefined,
          organizationId: organizationId !== undefined ? organizationId : undefined,
          userId: userId !== undefined ? userId : undefined,
        },
        include: {
          pairedAnimal: {
            select: {
              id: true,
              name: true,
              animalType: true
            }
          },
          lastLocation: {
            select: {
              id: true,
              latitude: true,
              longitude: true,
              timestamp: true,
              accuracy: true
            }
          },
          organization: {
            select: {
              id: true,
              name: true
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      res.status(200).json(device);
    } catch (error) {
      console.error('Error updating device:', error);
      res.status(500).json({ message: 'Error updating device' });
    }
  } else if (req.method === 'DELETE') {
    // Delete a device
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ message: 'Device ID is required' });
      }

      await prisma.device.delete({
        where: { id: String(id) }
      });

      res.status(200).json({ message: 'Device deleted successfully' });
    } catch (error) {
      console.error('Error deleting device:', error);
      res.status(500).json({ message: 'Error deleting device' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
