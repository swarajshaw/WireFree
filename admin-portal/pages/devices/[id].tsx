import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function DeviceDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [device, setDevice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real implementation, this would fetch from an API
    // For now, we'll use mock data
    const mockDevice = {
      id: '1',
      deviceId: 'A1B2C3D4-E5F6-7890-1234-567890ABCDEF',
      name: 'Cow #127 AirTag',
      deviceType: 'AIRTAG',
      status: 'CONNECTED',
      batteryLevel: 85,
      firmwareVersion: '1.0.2',
      lastSeen: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      lastLocation: {
        latitude: 53.3498,
        longitude: -6.2603,
        timestamp: new Date(Date.now() - 1000 * 60 * 5)
      },
      pairedAnimalId: '1',
      organizationId: 'org-1',
      createdAt: new Date(Date.now() - 1000 * 60 * 24 * 7), // 7 days ago
      updatedAt: new Date()
    };
    
    setDevice(mockDevice);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading device details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{device?.name} - WireFree Admin Portal</title>
        <meta name="description" content={`Details for ${device?.name}`} />
      </Head>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{device?.name}</h1>
          <button 
            onClick={() => router.push('/devices')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Back to Devices
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Device Information</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-500">Device ID</span>
                  <span className="text-gray-900">{device?.deviceId}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-500">Type</span>
                  <span className="text-gray-900">{device?.deviceType}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-500">Status</span>
                  <span className={`${
                    device?.status === 'CONNECTED' ? 'text-green-600' : 
                    device?.status === 'LOW_BATTERY' ? 'text-yellow-600' : 
                    'text-red-600'
                  } font-medium`}>
                    {device?.status}
                  </span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-500">Battery Level</span>
                  <span className="text-gray-900">{device?.batteryLevel}%</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-500">Firmware Version</span>
                  <span className="text-gray-900">{device?.firmwareVersion}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-500">Paired Animal</span>
                  <span className="text-gray-900">#{device?.pairedAnimalId}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-500">Organization</span>
                  <span className="text-gray-900">#{device?.organizationId}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-500">Last Seen</span>
                  <span className="text-gray-900">
                    {device?.lastSeen ? new Date(device.lastSeen).toLocaleString() : 'Never'}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Location</h2>
              
              <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
                {device?.lastLocation ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-500">Timestamp</span>
                      <span className="text-gray-900">
                        {new Date(device.lastLocation.timestamp).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-500">Latitude</span>
                      <span className="text-gray-900">{device.lastLocation.latitude}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-500">Longitude</span>
                      <span className="text-gray-900">{device.lastLocation.longitude}</span>
                    </div>
                    
                    <div className="mt-4">
                      <div className="bg-blue-100 rounded-lg p-4 text-center">
                        <p className="text-blue-800">Map visualization would appear here</p>
                        <p className="text-sm text-blue-600 mt-2">
                          Current location: {device.lastLocation.latitude}, {device.lastLocation.longitude}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No location data available</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Location Update</td>
                  <td className="px-6 py-4">Position updated: {device?.lastLocation?.latitude}, {device?.lastLocation?.longitude}</td>
                  <td className="px-6 py-4 whitespace-nowrap">5 minutes ago</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Success
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Battery Status</td>
                  <td className="px-6 py-4">Battery at 85%</td>
                  <td className="px-6 py-4 whitespace-nowrap">10 minutes ago</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Normal
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Connection</td>
                  <td className="px-6 py-4">Connected to tracking network</td>
                  <td className="px-6 py-4 whitespace-nowrap">1 hour ago</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Connected
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
