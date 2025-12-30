import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Get all alerts
    try {
      const { alertType, severity, isResolved, animalId, deviceId, fenceId, locationId, organizationId, limit, offset, startDate, endDate } = req.query;

      // Build query filters
      const whereClause: any = {};
      
      if (alertType) {
        whereClause.alertType = String(alertType);
      }
      
      if (severity) {
        whereClause.severity = String(severity);
      }
      
      if (isResolved !== undefined) {
        whereClause.isResolved = String(isResolved).toLowerCase() === 'true';
      }
      
      if (animalId) {
        whereClause.animalId = String(animalId);
      }
      
      if (deviceId) {
        whereClause.deviceId = String(deviceId);
      }
      
      if (fenceId) {
        whereClause.fenceId = String(fenceId);
      }
      
      if (locationId) {
        whereClause.locationId = String(locationId);
      }
      
      if (organizationId) {
        whereClause.organizationId = String(organizationId);
      }
      
      if (startDate || endDate) {
        whereClause.createdAt = {};
        if (startDate) {
          whereClause.createdAt.gte = new Date(String(startDate));
        }
        if (endDate) {
          whereClause.createdAt.lte = new Date(String(endDate));
        }
      }

      const alerts = await prisma.alert.findMany({
        where: whereClause,
        orderBy: {
          createdAt: 'desc'
        },
        skip: offset ? parseInt(String(offset)) : 0,
        take: limit ? parseInt(String(limit)) : 100, // Default to 100 records
        include: {
          animal: {
            select: {
              id: true,
              name: true,
              animalType: true
            }
          },
          device: {
            select: {
              id: true,
              name: true,
              deviceId: true
            }
          },
          fence: {
            select: {
              id: true,
              name: true,
              fenceType: true
            }
          },
          location: {
            select: {
              id: true,
              latitude: true,
              longitude: true,
              timestamp: true
            }
          },
          resolvedBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      res.status(200).json(alerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      res.status(500).json({ message: 'Error fetching alerts' });
    }
  } else if (req.method === 'POST') {
    // Create a new alert
    try {
      const { alertType, severity, message, animalId, deviceId, fenceId, locationId, organizationId } = req.body;

      if (!alertType || !message) {
        return res.status(400).json({ message: 'alertType and message are required' });
      }

      // Validate alert type
      const validAlertTypes = [
        'FENCE_BREACH', 'PROXIMITY', 'EXIT', 'ENTRY', 'BATTERY_LOW', 
        'DEVICE_OFFLINE', 'SPEED_ANOMALY', 'STATIONARY', 'OUT_OF_RANGE', 
        'LOCATION_ACCURACY_LOW'
      ];
      
      if (!validAlertTypes.includes(alertType)) {
        return res.status(400).json({ message: `Invalid alert type. Valid types: ${validAlertTypes.join(', ')}` });
      }

      // Validate severity
      const validSeverities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
      if (severity && !validSeverities.includes(severity)) {
        return res.status(400).json({ message: `Invalid severity. Valid severities: ${validSeverities.join(', ')}` });
      }

      // Check if animal exists if provided
      if (animalId) {
        const animal = await prisma.animal.findUnique({
          where: { id: animalId }
        });
        if (!animal) {
          return res.status(404).json({ message: 'Animal not found' });
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

      // Check if fence exists if provided
      if (fenceId) {
        const fence = await prisma.fence.findUnique({
          where: { id: fenceId }
        });
        if (!fence) {
          return res.status(404).json({ message: 'Fence not found' });
        }
      }

      // Check if location exists if provided
      if (locationId) {
        const location = await prisma.location.findUnique({
          where: { id: locationId }
        });
        if (!location) {
          return res.status(404).json({ message: 'Location not found' });
        }
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

      // Create the alert
      const alert = await prisma.alert.create({
        data: {
          alertType,
          severity: severity || 'MEDIUM',
          message,
          isResolved: false,
          animalId: animalId || null,
          deviceId: deviceId || null,
          fenceId: fenceId || null,
          locationId: locationId || null,
          organizationId: organizationId || null,
        },
        include: {
          animal: {
            select: {
              id: true,
              name: true,
              animalType: true
            }
          },
          device: {
            select: {
              id: true,
              name: true,
              deviceId: true
            }
          },
          fence: {
            select: {
              id: true,
              name: true,
              fenceType: true
            }
          },
          location: {
            select: {
              id: true,
              latitude: true,
              longitude: true,
              timestamp: true
            }
          },
          resolvedBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      res.status(201).json(alert);
    } catch (error) {
      console.error('Error creating alert:', error);
      res.status(500).json({ message: 'Error creating alert' });
    }
  } else if (req.method === 'PUT') {
    // Update an alert (typically to resolve it)
    try {
      const { id } = req.query;
      const { isResolved, resolvedById, message } = req.body;

      if (!id) {
        return res.status(400).json({ message: 'Alert ID is required' });
      }

      // Check if user exists if provided for resolution
      if (resolvedById && isResolved) {
        const user = await prisma.user.findUnique({
          where: { id: resolvedById }
        });
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
      }

      const alert = await prisma.alert.update({
        where: { id: String(id) },
        data: {
          isResolved: isResolved !== undefined ? isResolved : undefined,
          resolvedById: resolvedById || undefined,
          message: message || undefined,
          resolvedAt: isResolved ? new Date() : undefined,
        },
        include: {
          animal: {
            select: {
              id: true,
              name: true,
              animalType: true
            }
          },
          device: {
            select: {
              id: true,
              name: true,
              deviceId: true
            }
          },
          fence: {
            select: {
              id: true,
              name: true,
              fenceType: true
            }
          },
          location: {
            select: {
              id: true,
              latitude: true,
              longitude: true,
              timestamp: true
            }
          },
          resolvedBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      res.status(200).json(alert);
    } catch (error) {
      console.error('Error updating alert:', error);
      res.status(500).json({ message: 'Error updating alert' });
    }
  } else if (req.method === 'DELETE') {
    // Delete an alert
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ message: 'Alert ID is required' });
      }

      await prisma.alert.delete({
        where: { id: String(id) }
      });

      res.status(200).json({ message: 'Alert deleted successfully' });
    } catch (error) {
      console.error('Error deleting alert:', error);
      res.status(500).json({ message: 'Error deleting alert' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
