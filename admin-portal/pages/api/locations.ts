import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Get all locations
    try {
      const { deviceId, animalId, fenceId, limit, offset, startDate, endDate } = req.query;

      // Build query filters
      const whereClause: any = {};
      
      if (deviceId) {
        whereClause.deviceId = String(deviceId);
      }
      
      if (animalId) {
        whereClause.animalId = String(animalId);
      }
      
      if (fenceId) {
        whereClause.fenceId = String(fenceId);
      }
      
      if (startDate || endDate) {
        whereClause.timestamp = {};
        if (startDate) {
          whereClause.timestamp.gte = new Date(String(startDate));
        }
        if (endDate) {
          whereClause.timestamp.lte = new Date(String(endDate));
        }
      }

      const locations = await prisma.location.findMany({
        where: whereClause,
        orderBy: {
          timestamp: 'desc'
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
          }
        }
      });

      res.status(200).json(locations);
    } catch (error) {
      console.error('Error fetching locations:', error);
      res.status(500).json({ message: 'Error fetching locations' });
    }
  } else if (req.method === 'POST') {
    // Create a new location
    try {
      const { deviceId, latitude, longitude, accuracy, speed, course, altitude, animalId, fenceId } = req.body;

      if (!deviceId || latitude === undefined || longitude === undefined) {
        return res.status(400).json({ message: 'deviceId, latitude, and longitude are required' });
      }

      // Validate coordinates
      if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        return res.status(400).json({ message: 'Invalid coordinates' });
      }

      // Check if device exists
      const device = await prisma.device.findUnique({
        where: { id: deviceId }
      });

      if (!device) {
        return res.status(404).json({ message: 'Device not found' });
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

      // Check if fence exists if provided
      if (fenceId) {
        const fence = await prisma.fence.findUnique({
          where: { id: fenceId }
        });
        if (!fence) {
          return res.status(404).json({ message: 'Fence not found' });
        }
      }

      // Create the location
      const location = await prisma.location.create({
        data: {
          deviceId,
          latitude,
          longitude,
          accuracy: accuracy || null,
          speed: speed || null,
          course: course || null,
          altitude: altitude || null,
          animalId: animalId || null,
          fenceId: fenceId || null,
        },
        include: {
          animal: true,
          device: true,
          fence: true,
        }
      });

      // Update the animal's last location if animalId was provided
      if (animalId) {
        await prisma.animal.update({
          where: { id: animalId },
          data: { lastLocationId: location.id }
        });
      }

      // Update the device's last location
      await prisma.device.update({
        where: { id: deviceId },
        data: { lastLocationId: location.id }
      });

      // Check if this location crosses any fences and create alerts if needed
      if (animalId) {
        await checkFenceCrossings(location, animalId);
      }

      res.status(201).json(location);
    } catch (error) {
      console.error('Error creating location:', error);
      res.status(500).json({ message: 'Error creating location' });
    }
  } else if (req.method === 'DELETE') {
    // Delete locations (with optional filters)
    try {
      const { deviceId, animalId, beforeDate } = req.query;

      // Build where clause for deletion
      const whereClause: any = {};
      
      if (deviceId) {
        whereClause.deviceId = String(deviceId);
      }
      
      if (animalId) {
        whereClause.animalId = String(animalId);
      }
      
      if (beforeDate) {
        whereClause.timestamp = {
          lt: new Date(String(beforeDate))
        };
      }

      if (Object.keys(whereClause).length === 0) {
        return res.status(400).json({ 
          message: 'Must specify at least one filter (deviceId, animalId, or beforeDate) to delete locations' 
        });
      }

      const result = await prisma.location.deleteMany({
        where: whereClause
      });

      res.status(200).json({ 
        message: `${result.count} locations deleted successfully`,
        deletedCount: result.count
      });
    } catch (error) {
      console.error('Error deleting locations:', error);
      res.status(500).json({ message: 'Error deleting locations' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

// Helper function to check for fence crossings
async function checkFenceCrossings(location: any, animalId: string) {
  try {
    // Get all active fences
    const fences = await prisma.fence.findMany({
      where: {
        isActive: true
      }
    });

    // For each fence, check if the animal crossed it
    for (const fence of fences) {
      // Parse coordinates from JSON
      const fenceCoords = typeof fence.coordinates === 'string' ? 
        JSON.parse(fence.coordinates) : fence.coordinates;

      // Simple geofence crossing detection
      // In a real implementation, this would use more sophisticated geospatial algorithms
      const isInsideFence = isPointInPolygon(
        { lat: location.latitude, lng: location.longitude }, 
        fenceCoords
      );

      // Check the animal's last known location to see if it crossed the fence
      const lastLocation = await prisma.location.findFirst({
        where: {
          animalId: animalId,
        },
        orderBy: {
          timestamp: 'desc'
        },
        skip: 1 // Skip the current location to get the previous one
      });

      if (lastLocation) {
        const wasInsideLast = isPointInPolygon(
          { lat: lastLocation.latitude, lng: lastLocation.longitude }, 
          fenceCoords
        );
        
        // If the animal just crossed the fence, create an alert
        if (wasInsideLast !== isInsideFence) {
          const alertType = isInsideFence ? 'ENTRY' : 'EXIT';
          
          await prisma.alert.create({
            data: {
              alertType,
              severity: 'MEDIUM',
              message: `Animal ${animalId} ${alertType.toLowerCase()} fence ${fence.name}`,
              animalId,
              deviceId: location.deviceId,
              fenceId: fence.id,
              locationId: location.id,
              isResolved: false,
            }
          });
        }
      }
    }
  } catch (error) {
    console.error('Error checking fence crossings:', error);
  }
}

// Helper function to check if a point is inside a polygon
function isPointInPolygon(point: { lat: number, lng: number }, polygon: any[]) {
  // This is a simplified implementation
  // In a real system, you'd use a proper geospatial library
  const { lat, lng } = point;
  
  // Simple distance-based check for demonstration purposes
  // A real implementation would use point-in-polygon algorithms
  if (polygon.length === 0) return false;
  
  // For circular fences (first point is center, second is on circumference)
  if (polygon.length === 2) {
    const center = polygon[0];
    const edgePoint = polygon[1];

    const radius = haversineDistanceMeters(
      { lat: center.lat, lng: center.lng },
      { lat: edgePoint.lat, lng: edgePoint.lng }
    );
    const distance = haversineDistanceMeters(
      { lat: center.lat, lng: center.lng },
      { lat, lng }
    );

    return distance <= radius;
  }
  
  // For polygon fences
  const earthRadiusMeters = 6371000;
  const referenceLat = toRadians(lat);
  const pointXY = {
    x: earthRadiusMeters * toRadians(lng) * Math.cos(referenceLat),
    y: earthRadiusMeters * toRadians(lat),
  };

  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = earthRadiusMeters * toRadians(polygon[i].lng) * Math.cos(referenceLat);
    const yi = earthRadiusMeters * toRadians(polygon[i].lat);
    const xj = earthRadiusMeters * toRadians(polygon[j].lng) * Math.cos(referenceLat);
    const yj = earthRadiusMeters * toRadians(polygon[j].lat);

    const intersect = ((yi > pointXY.y) !== (yj > pointXY.y))
      && (pointXY.x < (xj - xi) * (pointXY.y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  
  return inside;
}

function haversineDistanceMeters(
  start: { lat: number; lng: number },
  end: { lat: number; lng: number }
) {
  const earthRadiusMeters = 6371000;
  const deltaLat = toRadians(end.lat - start.lat);
  const deltaLng = toRadians(end.lng - start.lng);
  const startLat = toRadians(start.lat);
  const endLat = toRadians(end.lat);

  const a = Math.sin(deltaLat / 2) ** 2
    + Math.cos(startLat) * Math.cos(endLat) * Math.sin(deltaLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusMeters * c;
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}
