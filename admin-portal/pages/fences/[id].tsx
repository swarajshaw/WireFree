import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Location } from '../../types';

export default function FenceDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [fence, setFence] = useState<any>(null);
  const [animalsInFence, setAnimalsInFence] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real implementation, this would fetch from an API
    // For now, we'll use mock data
    const mockFence = {
      id: '1',
      name: 'North Pasture',
      fenceType: 'POLYGON',
      coordinates: [
        { lat: 53.3498, lng: -6.2603 },
        { lat: 53.3508, lng: -6.2603 },
        { lat: 53.3508, lng: -6.2593 },
        { lat: 53.3498, lng: -6.2593 }
      ],
      isActive: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 24 * 7), // 7 days ago
      updatedAt: new Date(),
      organizationId: 'org-1'
    };
    
    // Mock animals in fence
    const mockAnimalsInFence: Location[] = [
      {
        id: 'loc-1',
        deviceId: 'device-1',
        latitude: 53.3499,
        longitude: -6.2600,
        accuracy: 3,
        speed: 0.5,
        course: 45,
        altitude: 120,
        timestamp: new Date(),
        animalId: '1',
        deviceIdRef: 'device-1',
        fenceId: '1',
        organizationId: 'org-1'
      },
      {
        id: 'loc-2',
        deviceId: 'device-2',
        latitude: 53.3502,
        longitude: -6.2598,
        accuracy: 2.5,
        speed: 0.3,
        course: 90,
        altitude: 118,
        timestamp: new Date(Date.now() - 1000 * 60),
        animalId: '2',
        deviceIdRef: 'device-2',
        fenceId: '1',
        organizationId: 'org-1'
      }
    ];
    
    setFence(mockFence);
    setAnimalsInFence(mockAnimalsInFence);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading fence details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{fence?.name} - WireFree Admin Portal</title>
        <meta name="description" content={`Details for fence ${fence?.name}`} />
      </Head>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{fence?.name}</h1>
          <button 
            onClick={() => router.push('/fences')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Back to Fences
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Fence Information</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-500">ID</span>
                  <span className="text-gray-900">{fence?.id}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-500">Type</span>
                  <span className="text-gray-900">{fence?.fenceType}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-500">Status</span>
                  <span className={`${fence?.isActive ? 'text-green-600' : 'text-red-600'} font-medium`}>
                    {fence?.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-500">Coordinates</span>
                  <span className="text-gray-900">{fence?.coordinates?.length}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-500">Created</span>
                  <span className="text-gray-900">{fence?.createdAt ? new Date(fence.createdAt).toLocaleDateString() : ''}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-500">Last Updated</span>
                  <span className="text-gray-900">{fence?.updatedAt ? new Date(fence.updatedAt).toLocaleDateString() : ''}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-500">Organization</span>
                  <span className="text-gray-900">#{fence?.organizationId}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Fence Boundaries</h2>
              
              <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
                <div className="space-y-2">
                  {fence?.coordinates?.map((coord: any, index: number) => (
                    <div key={index} className="flex justify-between bg-white p-2 rounded border">
                      <span className="font-medium text-gray-500">Point {index + 1}</span>
                      <span className="text-gray-900">
                        {coord.lat}, {coord.lng}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4">
                  <div className="bg-blue-100 rounded-lg p-4 text-center">
                    <p className="text-blue-800">Map visualization would appear here</p>
                    <p className="text-sm text-blue-600 mt-2">
                      Fence boundary: {fence?.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Animals in Fence</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Animal ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Seen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {animalsInFence.map((location) => (
                  <tr key={location.id}>
                    <td className="px-6 py-4 whitespace-nowrap">#{location.animalId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">Animal #{location.animalId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">CATTLE</td>
                    <td className="px-6 py-4 whitespace-nowrap">{location.timestamp.toLocaleTimeString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {location.latitude}, {location.longitude}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Alerts</h2>
          
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
                  <td className="px-6 py-4 whitespace-nowrap">Fence Breach</td>
                  <td className="px-6 py-4">Animal #127 has exited the fence boundary</td>
                  <td className="px-6 py-4 whitespace-nowrap">2 minutes ago</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Active
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Proximity Alert</td>
                  <td className="px-6 py-4">Animal #234 approaching fence boundary</td>
                  <td className="px-6 py-4 whitespace-nowrap">15 minutes ago</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Warning
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Entry</td>
                  <td className="px-6 py-4">Animal #567 has entered the fence</td>
                  <td className="px-6 py-4 whitespace-nowrap">1 hour ago</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Resolved
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
