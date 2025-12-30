import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';

// Define types for Google Maps API
type GoogleMap = google.maps.Map;
type GoogleMarker = google.maps.Marker;
type GoogleCircle = google.maps.Circle;
type GooglePolygon = google.maps.Polygon;
type GoogleDrawingManager = google.maps.drawing.DrawingManager;

interface MapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  fences?: any[];
  locations?: any[];
  devices?: any[];
  onFenceCreated?: (fence: any) => void;
}

const InteractiveMapView: React.FC<MapProps> = ({ 
  center = { lat: 53.3498, lng: -6.2603 }, 
  zoom = 13, 
  fences = [], 
  locations = [], 
  devices = [],
  onFenceCreated 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Load Google Maps API dynamically
  useEffect(() => {
    const loadGoogleMaps = async () => {
      if (!mapRef.current) return;
      
      // Check if Google Maps API is already loaded
      if (typeof window !== 'undefined' && window.google && window.google.maps) {
        initMap();
        return;
      }
      
      // Create callback function to initialize the map
      (window as any).initInteractiveMap = initMap;
      
      // Dynamically load Google Maps API script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=geometry,drawing&callback=initInteractiveMap`;
      script.async = true;
      script.defer = true;
      
      document.head.appendChild(script);
    };
    
    const initMap = () => {
      if (!mapRef.current) return;
      
      const map = new (window as any).google.maps.Map(mapRef.current, {
        center: center,
        zoom: zoom,
        mapTypeId: 'satellite',
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        mapTypeControl: true,
      });
      
      // Add markers for locations
      locations.forEach(location => {
        new (window as any).google.maps.Marker({
          position: { lat: location.latitude, lng: location.longitude },
          map: map,
          title: `Animal: ${location.animalId}`,
          icon: {
            path: (window as any).google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#FF0000',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
          },
        });
      });
      
      // Add markers for devices
      devices.forEach(device => {
        if (device.lastLocation) {
          new (window as any).google.maps.Marker({
            position: { 
              lat: device.lastLocation.latitude, 
              lng: device.lastLocation.longitude 
            },
            map: map,
            title: `Device: ${device.deviceId}`,
            icon: {
              path: (window as any).google.maps.SymbolPath.CIRCLE,
              scale: 6,
              fillColor: '#00FF00',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 1,
            },
          });
        }
      });
      
      // Draw fences
      fences.forEach(fence => {
        if (fence.fenceType === 'CIRCLE') {
          const center = fence.coordinates[0];
          const radiusPoint = fence.coordinates[1];
          const radius = (window as any).google.maps.geometry.spherical.computeDistanceBetween(
            new (window as any).google.maps.LatLng(center.lat, center.lng),
            new (window as any).google.maps.LatLng(radiusPoint.lat, radiusPoint.lng)
          );
          
          new (window as any).google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: center,
            radius: radius,
          });
        } else if (fence.fenceType === 'POLYGON') {
          new (window as any).google.maps.Polygon({
            paths: fence.coordinates,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
          });
        }
      });
      
      // Add drawing manager for creating new fences
      if (onFenceCreated) {
        const drawingManager = new (window as any).google.maps.drawing.DrawingManager({
          drawingControl: true,
          drawingControlOptions: {
            position: (window as any).google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
              (window as any).google.maps.drawing.OverlayType.POLYGON,
              (window as any).google.maps.drawing.OverlayType.CIRCLE,
            ],
          },
          polygonOptions: {
            editable: true,
            draggable: true,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
          },
          circleOptions: {
            editable: true,
            draggable: true,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
          },
        });
        
        drawingManager.setMap(map);
        
        (window as any).google.maps.event.addListener(drawingManager, 'overlaycomplete', (event: any) => {
          const newFence = {
            id: Math.random().toString(36).substring(7),
            name: `Fence ${fences.length + 1}`,
            coordinates: [] as { lat: number; lng: number }[],
            fenceType: event.type.toUpperCase(),
            isActive: true,
          };
          
          if (event.type === (window as any).google.maps.drawing.OverlayType.POLYGON) {
            const vertices = (event.overlay as any).getPath();
            for (let i = 0; i < vertices.getLength(); i++) {
              const xy = vertices.getAt(i);
              newFence.coordinates.push({ lat: xy.lat(), lng: xy.lng() });
            }
          } else if (event.type === (window as any).google.maps.drawing.OverlayType.CIRCLE) {
            const circle = event.overlay as any;
            const center = circle.getCenter();
            const radius = circle.getRadius();
            
            // For a circle, we store center and a point on the circumference
            const circumferencePoint = (window as any).google.maps.geometry.spherical.computeOffset(
              center, 
              radius, 
              0 // Angle in degrees
            );
            
            newFence.coordinates = [
              { lat: center.lat(), lng: center.lng() },
              { lat: circumferencePoint.lat(), lng: circumferencePoint.lng() }
            ];
          }
          
          onFenceCreated(newFence);
        });
      }
      
      setMapLoaded(true);
    };
    
    loadGoogleMaps();
    
    // Cleanup function
    return () => {
      if (mapRef.current) {
        // Remove the map when component unmounts
        const mapContainer = mapRef.current;
        if (mapContainer) {
          // Clear all child elements (this removes the map)
          while (mapContainer.firstChild) {
            mapContainer.removeChild(mapContainer.firstChild);
          }
        }
      }
    };
  }, [center, zoom, fences, locations, devices, onFenceCreated]);

  return (
    <div>
      <Head>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=geometry,drawing`}
          async={false} // We're handling loading in useEffect
        />
      </Head>
      <div 
        ref={mapRef} 
        style={{ width: '100%', height: '100vh' }}
        className="rounded-lg overflow-hidden shadow-lg"
      >
        {!mapLoaded && (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <p>Loading map...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveMapView;
