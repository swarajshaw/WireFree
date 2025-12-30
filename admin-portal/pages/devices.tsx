import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

// Define TypeScript interfaces
interface Device {
  id: string;
  deviceId: string; // The actual device identifier (e.g., AirTag serial)
  name: string;
  deviceType: string;
  status: string;
  batteryLevel: number;
  firmwareVersion?: string;
  lastSeen?: Date;
  lastLocation?: {
    latitude: number;
    longitude: number;
    timestamp: Date;
  };
  pairedAnimalId?: string;
  organizationId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function DevicesPage() {
  const router = useRouter();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        // In a real implementation, this would fetch from the API
        // For now, we'll use mock data
        const mockDevices: Device[] = [
          {
            id: "1",
            deviceId: "A1B2C3D4-E5F6-7890-1234-567890ABCDEF",
            name: "Cow #127 AirTag",
            deviceType: "AIRTAG",
            status: "CONNECTED",
            batteryLevel: 85,
            firmwareVersion: "1.0.2",
            lastSeen: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
            lastLocation: {
              latitude: 53.3498,
              longitude: -6.2603,
              timestamp: new Date(),
            },
            pairedAnimalId: "1",
            organizationId: "org-1",
            createdAt: new Date(Date.now() - 1000 * 60 * 24 * 7), // 7 days ago
            updatedAt: new Date(),
          },
          {
            id: "2",
            deviceId: "FEDCBA09-8765-4321-ABCD-EF0987654321",
            name: "Sheep #234 Tile",
            deviceType: "TILE",
            status: "DISCONNECTED",
            batteryLevel: 25,
            firmwareVersion: "1.1.0",
            lastSeen: new Date(Date.now() - 1000 * 60 * 2), // 2 hours ago
            lastLocation: {
              latitude: 53.3508,
              longitude: -6.2613,
              timestamp: new Date(Date.now() - 1000 * 60 * 2),
            },
            pairedAnimalId: "2",
            organizationId: "org-1",
            createdAt: new Date(Date.now() - 1000 * 60 * 48), // 2 days ago
            updatedAt: new Date(),
          },
          {
            id: "3",
            deviceId: "98765432-10FE-DCBA-9876-543210FEDCBA",
            name: "Bull #456 Collar",
            deviceType: "GPS_COLLAR",
            status: "LOW_BATTERY",
            batteryLevel: 12,
            firmwareVersion: "2.3.1",
            lastSeen: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
            lastLocation: {
              latitude: 53.3488,
              longitude: -6.2593,
              timestamp: new Date(),
            },
            pairedAnimalId: "3",
            organizationId: "org-1",
            createdAt: new Date(Date.now() - 1000 * 60 * 24 * 30), // 30 days ago
            updatedAt: new Date(),
          },
        ];

        setDevices(mockDevices);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching devices:", error);
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  const filteredDevices = devices.filter(
    (device) =>
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.deviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase().replace(/_/g, " ")) {
      case "connected":
        return "bg-green-100 text-green-800";
      case "disconnected":
        return "bg-red-100 text-red-800";
      case "low_battery":
      case "low battery":
        return "bg-yellow-100 text-yellow-800";
      case "offline":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Devices - WireFree Admin Portal</title>
        <meta
          name="description"
          content="Manage tracking devices for your livestock with WireFree virtual fencing platform"
        />
      </Head>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Devices</h1>
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
              placeholder="Search devices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => router.push("/devices/add")}
            className="ml-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Add Device
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">Loading devices...</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredDevices.map((device) => (
                <li key={device.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-blue-600 truncate">
                        {device.name}
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            device.status
                          )}`}
                        >
                          {device.status.replace("_", " ")}
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
                              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                          {device.deviceType} • ID:{" "}
                          {device.deviceId.substring(0, 8)}...
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
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                          Firmware: {device.firmwareVersion}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <div className="flex items-center">
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
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Battery: {device.batteryLevel}%
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
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
                        {device.lastSeen
                          ? new Date(device.lastSeen).toLocaleString()
                          : "Unknown"}
                      </div>
                      <div className="flex items-center justify-end">
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
                        Paired with:{" "}
                        {device.pairedAnimalId
                          ? `Animal #${device.pairedAnimalId}`
                          : "None"}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {filteredDevices.length === 0 && !loading && (
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
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No devices
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a new tracking device to your herd.
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push("/devices/add")}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Add Device
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
