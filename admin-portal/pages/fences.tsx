import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function FencesPage() {
  const router = useRouter();
  const [fences, setFences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // In a real implementation, this would fetch from an API
    // For now, we'll use mock data
    const mockFences = [
      {
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
      },
      {
        id: '2',
        name: 'South Meadow',
        fenceType: 'CIRCLE',
        coordinates: [
          { lat: 53.3488, lng: -6.2583 }, // Center
          { lat: 53.3488, lng: -6.2573 }  // Point on circumference
        ],
        isActive: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 24 * 3), // 3 days ago
        updatedAt: new Date(),
        organizationId: 'org-1'
      },
      {
        id: '3',
        name: 'East Corridor',
        fenceType: 'CORRIDOR',
        coordinates: [
          { lat: 53.3478, lng: -6.2573 },
          { lat: 53.3468, lng: -6.2563 },
          { lat: 53.3458, lng: -6.2553 }
        ],
        isActive: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 48), // 2 days ago
        updatedAt: new Date(),
        organizationId: 'org-1'
      }
    ];
    
    setFences(mockFences);
    setLoading(false);
  }, []);

  const filteredFences = fences.filter(fence => 
    fence.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fence.fenceType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activateFence = (id: string) => {
    setFences(prevFences => 
      prevFences.map(fence => 
        fence.id === id ? { ...fence, isActive: true } : fence
      )
    );
  };

  const deactivateFence = (id: string) => {
    setFences(prevFences => 
      prevFences.map(fence => 
        fence.id === id ? { ...fence, isActive: false } : fence
      )
    );
  };

  const deleteFence = (id: string) => {
    setFences(prevFences => prevFences.filter(fence => fence.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Fences - WireFree Admin Portal</title>
        <meta name="description" content="Manage virtual fences for your livestock" />
      </Head>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Fences</h1>
          <button 
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Dashboard
          </button>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search fences..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button 
            onClick={() => router.push('/fences/create')}
            className="ml-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Create Fence
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading fences...</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredFences.map((fence) => (
                <li key={fence.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-blue-600 truncate">
                        {fence.name}
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          fence.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {fence.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <div className="mr-6 flex items-center text-sm text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                          {fence.fenceType}
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Created: {new Date(fence.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" />
                        </svg>
                        {fence.coordinates.length} points
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        onClick={() => router.push(`/fences/${fence.id}`)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        View Details
                      </button>
                      {fence.isActive ? (
                        <button
                          onClick={() => deactivateFence(fence.id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => activateFence(fence.id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        >
                          Activate
                        </button>
                      )}
                      <button
                        onClick={() => deleteFence(fence.id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {filteredFences.length === 0 && !loading && (
          <div className="text-center py-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No fences</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new virtual fence.</p>
            <div className="mt-6">
              <button
                onClick={() => router.push('/fences/create')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Create Fence
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
