import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

type Animal = {
  id: string;
  name: string;
  animalType: string;
  breed?: string;
  age?: number;
  weight?: number;
  gender?: string;
  color?: string;
  healthStatus?: string;
  lastLocation?: {
    latitude: number;
    longitude: number;
    timestamp: Date;
  };
  deviceId?: string;
};

export default function AnimalsPage() {
  const router = useRouter();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        // In a real implementation, this would fetch from the API
        // For now, we'll use mock data
        const mockAnimals = [
          {
            id: "1",
            name: "Bessie",
            animalType: "CATTLE",
            breed: "Holstein",
            age: 5,
            weight: 650.0,
            gender: "FEMALE",
            color: "Black and White",
            healthStatus: "Healthy",
            lastLocation: {
              latitude: 53.3498,
              longitude: -6.2603,
              timestamp: new Date(),
            },
            deviceId: "device-1",
          },
          {
            id: "2",
            name: "Daisy",
            animalType: "CATTLE",
            breed: "Jersey",
            age: 3,
            weight: 450.0,
            gender: "FEMALE",
            color: "Brown",
            healthStatus: "Healthy",
            lastLocation: {
              latitude: 53.3508,
              longitude: -6.2613,
              timestamp: new Date(),
            },
            deviceId: "device-2",
          },
          {
            id: "3",
            name: "Bullwinkle",
            animalType: "CATTLE",
            breed: "Angus",
            age: 7,
            weight: 850.0,
            gender: "MALE",
            color: "Black",
            healthStatus: "Needs Attention",
            lastLocation: {
              latitude: 53.3488,
              longitude: -6.2593,
              timestamp: new Date(),
            },
            deviceId: "device-3",
          },
        ];

        setAnimals(mockAnimals);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching animals:", error);
        setLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  const filteredAnimals = animals.filter(
    (animal) =>
      animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.animalType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Animals - WireFree Admin Portal</title>
        <meta
          name="description"
          content="Manage your livestock with WireFree virtual fencing platform"
        />
      </Head>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Animals</h1>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Dashboard
          </button>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search animals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => router.push("/animals/new")}
            className="ml-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Add Animal
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">Loading animals...</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredAnimals.map((animal) => (
                <li key={animal.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-blue-600 truncate">
                        {animal.name}
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            animal.healthStatus === "Healthy"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {animal.healthStatus}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <div className="mr-6 flex items-center text-sm text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 0 00-6.364 0z"
                            />
                          </svg>
                          {animal.animalType} • {animal.breed}
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Last seen:{" "}
                          {animal.lastLocation?.timestamp.toLocaleDateString()}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Device: {animal.deviceId}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {filteredAnimals.length === 0 && !loading && (
          <div className="text-center py-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No animals
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a new animal to your herd.
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push("/animals/new")}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Add Animal
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
