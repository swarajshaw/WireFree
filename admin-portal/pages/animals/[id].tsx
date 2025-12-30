import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AnimalDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [animal, setAnimal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real implementation, this would fetch from an API
    // For now, we'll use mock data
    const mockAnimal = {
      id: '1',
      name: 'Bessie',
      animalType: 'CATTLE',
      breed: 'Holstein',
      age: 5,
      weight: 650.0,
      gender: 'FEMALE',
      color: 'Black and White',
      healthStatus: 'Healthy',
      lastLocation: {
        latitude: 53.3498,
        longitude: -6.2603,
        timestamp: new Date()
      },
      deviceId: 'device-1',
      organizationId: 'org-1',
      createdAt: new Date(Date.now() - 1000 * 60 * 24 * 7), // 7 days ago
      updatedAt: new Date()
    };
    
    setAnimal(mockAnimal);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading animal details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{animal?.name} - WireFree Admin Portal</title>
        <meta name="description" content={`Details for ${animal?.name}`} />
      </Head>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{animal?.name}</h1>
          <button 
            onClick={() => router.push('/animals')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Back to Animals
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Animal Information</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-500">Type</span>
                  <span className="text-gray-900">{animal?.animalType}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-500">Breed</span>
                  <span className="text-gray-900">{animal?.breed}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-500">Age</span>
                  <span className="text-gray-900">{animal?.age} years</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-500">Weight</span>
                  <span className="text-gray-900">{animal?.weight} kg</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-500">Gender</span>
                  <span className="text-gray-900">{animal?.gender}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-500">Color</span>
                  <span className="text-gray-900">{animal?.color}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-500">Health Status</span>
                  <span className={`${
                    animal?.healthStatus === 'Healthy' ? 'text-green-600' : 'text-yellow-600'
                  } font-medium`}>
                    {animal?.healthStatus}
                  </span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-500">Device ID</span>
                  <span className="text-gray-900">{animal?.deviceId}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Location History</h2>
              
              <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
                {animal?.lastLocation ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-500">Last Seen</span>
                      <span className="text-gray-900">
                        {new Date(animal.lastLocation.timestamp).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-500">Latitude</span>
                      <span className="text-gray-900">{animal.lastLocation.latitude}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-500">Longitude</span>
                      <span className="text-gray-900">{animal.lastLocation.longitude}</span>
                    </div>
                    
                    <div className="mt-4">
                      <div className="bg-blue-100 rounded-lg p-4 text-center">
                        <p className="text-blue-800">Map visualization would appear here</p>
                        <p className="text-sm text-blue-600 mt-2">
                          Last location: {animal.lastLocation.latitude}, {animal.lastLocation.longitude}
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
                  <td className="px-6 py-4">Exited North Pasture fence</td>
                  <td className="px-6 py-4 whitespace-nowrap">2 minutes ago</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Active
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Proximity</td>
                  <td className="px-6 py-4">Approaching South Gate</td>
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
