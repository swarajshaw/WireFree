import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Get all animals
    try {
      const { organizationId, userId, deviceId, limit, offset, animalType } = req.query;

      // Build query filters
      const whereClause: any = {};
      
      if (organizationId) {
        whereClause.organizationId = String(organizationId);
      }
      
      if (userId) {
        whereClause.userId = String(userId);
      }
      
      if (deviceId) {
        whereClause.deviceId = String(deviceId);
      }
      
      if (animalType) {
        whereClause.animalType = String(animalType);
      }

      const animals = await prisma.animal.findMany({
        where: whereClause,
        orderBy: {
          createdAt: 'desc'
        },
        skip: offset ? parseInt(String(offset)) : 0,
        take: limit ? parseInt(String(limit)) : 100, // Default to 100 records
        include: {
          device: {
            select: {
              id: true,
              name: true,
              deviceId: true,
              status: true
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
          }
        }
      });

      res.status(200).json(animals);
    } catch (error) {
      console.error('Error fetching animals:', error);
      res.status(500).json({ message: 'Error fetching animals' });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === 'POST') {
    // Create a new animal
    try {
      const { name, animalType, breed, age, weight, gender, color, healthStatus, deviceId, organizationId, userId } = req.body;

      if (!name || !animalType) {
        return res.status(400).json({ message: 'name and animalType are required' });
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

      // Check if device exists if provided
      if (deviceId) {
        const device = await prisma.device.findUnique({
          where: { id: deviceId }
        });
        if (!device) {
          return res.status(404).json({ message: 'Device not found' });
        }
      }

      // Create the animal
      const animal = await prisma.animal.create({
        data: {
          name,
          animalType,
          breed: breed || null,
          age: age || null,
          weight: weight || null,
          gender: gender || null,
          color: color || null,
          healthStatus: healthStatus || null,
          deviceId: deviceId || null,
          organizationId: organizationId || null,
          userId: userId || null,
        },
        include: {
          device: {
            select: {
              id: true,
              name: true,
              deviceId: true,
              status: true
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
          }
        }
      });

      res.status(201).json(animal);
    } catch (error) {
      console.error('Error creating animal:', error);
      res.status(500).json({ message: 'Error creating animal' });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === 'PUT') {
    // Update an animal
    try {
      const { id } = req.query;
      const { name, animalType, breed, age, weight, gender, color, healthStatus, deviceId } = req.body;

      if (!id) {
        return res.status(400).json({ message: 'Animal ID is required' });
      }

      // Check if device exists if provided
      if (deviceId) {
        const device = await prisma.device.findUnique({
          where: { id: deviceId }
        });
        if (!device) {
          return res.status(404).json({ message: 'Device not found' });
        }
      }

      // Update the animal
      const animal = await prisma.animal.update({
        where: { id: String(id) },
        data: {
          name: name || undefined,
          animalType: animalType || undefined,
          breed: breed !== undefined ? breed : undefined,
          age: age !== undefined ? age : undefined,
          weight: weight !== undefined ? weight : undefined,
          gender: gender || undefined,
          color: color || undefined,
          healthStatus: healthStatus || undefined,
          deviceId: deviceId !== undefined ? deviceId : undefined,
        },
        include: {
          device: {
            select: {
              id: true,
              name: true,
              deviceId: true,
              status: true
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
          }
        }
      });

      res.status(200).json(animal);
    } catch (error) {
      console.error('Error updating animal:', error);
      res.status(500).json({ message: 'Error updating animal' });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === 'DELETE') {
    // Delete an animal
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ message: 'Animal ID is required' });
      }

      // Get the animal to check if it has a device assigned
      const existingAnimal = await prisma.animal.findUnique({
        where: { id: String(id) },
        select: {
          deviceId: true
        }
      });

      if (!existingAnimal) {
        return res.status(404).json({ message: 'Animal not found' });
      }

      // If the animal had a device, we don't need to update the device since
      // the Animal model holds the deviceId reference, not the other way around

      await prisma.animal.delete({
        where: { id: String(id) }
      });

      res.status(200).json({ message: 'Animal deleted successfully' });
    } catch (error) {
      console.error('Error deleting animal:', error);
      res.status(500).json({ message: 'Error deleting animal' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
