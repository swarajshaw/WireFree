import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('account');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Settings - WireFree Admin Portal</title>
        <meta name="description" content="WireFree admin portal settings" />
      </Head>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <button 
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Dashboard
          </button>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Sidebar navigation */}
          <nav className="flex-shrink-0 mb-6 md:mb-0 md:w-1/4">
            <div className="bg-white rounded-lg shadow p-4">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveTab('account')}
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      activeTab === 'account' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                    }`}
                  >
                    Account
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('organization')}
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      activeTab === 'organization' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                    }`}
                  >
                    Organization
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('privacy')}
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      activeTab === 'privacy' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                    }`}
                  >
                    Privacy & Permissions
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      activeTab === 'notifications' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                    }`}
                  >
                    Notifications
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('devices')}
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      activeTab === 'devices' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                    }`}
                  >
                    Device Settings
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('about')}
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      activeTab === 'about' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                    }`}
                  >
                    About
                  </button>
                </li>
              </ul>
            </div>
          </nav>

          {/* Main content */}
          <div className="flex-1 md:ml-6">
            <div className="bg-white rounded-lg shadow p-6">
              {activeTab === 'account' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        defaultValue="John Doe"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        defaultValue="john.doe@example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <select
                        defaultValue="FARMER"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="ADMIN">Administrator</option>
                        <option value="FARMER">Farmer</option>
                        <option value="USER">User</option>
                      </select>
                    </div>
                    
                    <div className="pt-4">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'organization' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Organization Settings</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                      <input
                        type="text"
                        defaultValue="My Farm"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        defaultValue="A family-owned cattle farm specializing in sustainable farming practices."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Farm Size</label>
                      <input
                        type="number"
                        defaultValue="50"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <span className="text-sm text-gray-500">Acres</span>
                    </div>
                    
                    <div className="pt-4">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'privacy' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Privacy & Permissions</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Location Tracking</p>
                        <p className="text-sm text-gray-500">Allow the app to track your device location</p>
                      </div>
                      <ToggleSwitch enabled={true} setEnabled={() => {}} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Bluetooth Access</p>
                        <p className="text-sm text-gray-500">Allow the app to access Bluetooth for device tracking</p>
                      </div>
                      <ToggleSwitch enabled={true} setEnabled={() => {}} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Data Sharing</p>
                        <p className="text-sm text-gray-500">Share anonymized usage data with WireFree</p>
                      </div>
                      <ToggleSwitch enabled={false} setEnabled={() => {}} />
                    </div>
                    
                    <div className="pt-4">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                        Save Privacy Settings
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Fence Breach Alerts</p>
                        <p className="text-sm text-gray-500">Receive notifications when animals cross fence boundaries</p>
                      </div>
                      <ToggleSwitch enabled={true} setEnabled={() => {}} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Low Battery Warnings</p>
                        <p className="text-sm text-gray-500">Receive notifications when device battery is low</p>
                      </div>
                      <ToggleSwitch enabled={true} setEnabled={() => {}} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Device Offline Alerts</p>
                        <p className="text-sm text-gray-500">Receive notifications when devices go offline</p>
                      </div>
                      <ToggleSwitch enabled={true} setEnabled={() => {}} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Daily Reports</p>
                        <p className="text-sm text-gray-500">Receive daily summary reports via email</p>
                      </div>
                      <ToggleSwitch enabled={false} setEnabled={() => {}} />
                    </div>
                    
                    <div className="pt-4">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                        Save Notification Settings
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'devices' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Device Settings</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location Update Interval</label>
                      <select
                        defaultValue="30"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="10">Every 10 seconds (High accuracy, high battery drain)</option>
                        <option value="30">Every 30 seconds (Balanced)</option>
                        <option value="60">Every 1 minute (Low battery drain)</option>
                        <option value="300">Every 5 minutes (Minimal battery drain)</option>
                      </select>
                      <p className="text-sm text-gray-500 mt-1">Controls how frequently location data is updated</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Low Battery Threshold</label>
                      <input
                        type="range"
                        min="5"
                        max="30"
                        defaultValue="20"
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>5%</span>
                        <span>20%</span>
                        <span>30%</span>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                        Save Device Settings
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'about' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">About WireFree</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">WireFree Virtual Fencing Platform</h3>
                        <p className="text-gray-600">Version 1.0.0</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="text-md font-medium text-gray-900 mb-2">Platform Information</h3>
                      <p className="text-gray-600">
                        WireFree is a revolutionary virtual fencing solution that leverages existing tracking devices like AirTags 
                        to create cost-effective virtual boundaries for cattle. Our platform eliminates the need for physical fencing 
                        by using advanced geolocation technology to monitor and manage livestock movement.
                      </p>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="text-md font-medium text-gray-900 mb-2">Support</h3>
                      <p className="text-gray-600">
                        For support, please contact our team at support@wirefree.com or visit our documentation at 
                        docs.wirefree.com.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Toggle Switch Component
function ToggleSwitch({ enabled, setEnabled }: { enabled: boolean, setEnabled: (enabled: boolean) => void }) {
  return (
    <button
      type="button"
      className={`${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
      onClick={() => setEnabled(!enabled)}
    >
      <span className="sr-only">Toggle</span>
      <span
        aria-hidden="true"
        className={`${
          enabled ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  );
}
