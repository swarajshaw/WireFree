// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  organizationId?: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  FARMER = 'FARMER',
  USER = 'USER',
}

// Organization Types
export interface Organization {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Animal Types
export interface Animal {
  id: string;
  name: string;
  animalType: AnimalType;
  breed?: string;
  age?: number;
  weight?: number;
  gender?: Gender;
  color?: string;
  healthStatus?: string;
  lastLocationId?: string;
  deviceId?: string;
  organizationId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum AnimalType {
  CATTLE = 'CATTLE',
  SHEEP = 'SHEEP',
  GOAT = 'GOAT',
  HORSE = 'HORSE',
  PIG = 'PIG',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

// Device Types
export interface Device {
  id: string;
  deviceId: string; // The actual device identifier (e.g., AirTag serial)
  name: string;
  deviceType: DeviceType;
  status: DeviceStatus;
  batteryLevel?: number;
  firmwareVersion?: string;
  lastSeen?: Date;
  lastLocationId?: string;
  pairedAnimalId?: string;
  organizationId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum DeviceType {
  AIRTAG = 'AIRTAG',
  TILE = 'TILE',
  CUSTOM_COLLAR = 'CUSTOM_COLLAR',
  BEACON = 'BEACON',
  GPS_COLLAR = 'GPS_COLLAR',
}

export enum DeviceStatus {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  LOW_BATTERY = 'LOW_BATTERY',
  OFFLINE = 'OFFLINE',
  MALFUNCTIONING = 'MALFUNCTIONING',
  IN_RANGE = 'IN_RANGE',
  OUT_OF_RANGE = 'OUT_OF_RANGE',
}

// Fence Types
export interface Fence {
  id: string;
  name: string;
  fenceType: FenceType;
  coordinates: any; // Array of {lat: float, lng: float}
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  organizationId?: string;
}

export enum FenceType {
  GEOFENCE = 'GEOFENCE',
  POLYGON = 'POLYGON',
  CIRCLE = 'CIRCLE',
  CORRIDOR = 'CORRIDOR',
}

// Location Types
export interface Location {
  id: string;
  deviceId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  course?: number;
  altitude?: number;
  timestamp: Date;
  organizationId?: string;
  animalId?: string;
  deviceIdRef?: string;
  fenceId?: string;
}

// Alert Types
export interface Alert {
  id: string;
  alertType: AlertType;
  severity: AlertSeverity;
  message: string;
  isResolved: boolean;
  resolvedAt?: Date;
  resolvedById?: string;
  createdAt: Date;
  updatedAt: Date;
  organizationId?: string;
  animalId?: string;
  deviceId?: string;
  fenceId?: string;
  locationId?: string;
}

export enum AlertType {
  FENCE_BREACH = 'FENCE_BREACH',
  PROXIMITY = 'PROXIMITY',
  EXIT = 'EXIT',
  ENTRY = 'ENTRY',
  BATTERY_LOW = 'BATTERY_LOW',
  DEVICE_OFFLINE = 'DEVICE_OFFLINE',
  SPEED_ANOMALY = 'SPEED_ANOMALY',
  STATIONARY = 'STATIONARY',
  OUT_OF_RANGE = 'OUT_OF_RANGE',
  LOCATION_ACCURACY_LOW = 'LOCATION_ACCURACY_LOW',
}

export enum AlertSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

// Analytics Types
export interface Analytics {
  id: string;
  metricType: MetricType;
  metricValue: number;
  unit: string;
  timestamp: Date;
  organizationId?: string;
  animalId?: string;
  deviceId?: string;
  fenceId?: string;
}

export enum MetricType {
  DISTANCE_TRAVELED = 'DISTANCE_TRAVELED',
  AVERAGE_SPEED = 'AVERAGE_SPEED',
  TIME_IN_FENCE = 'TIME_IN_FENCE',
  MOVEMENT_PATTERN = 'MOVEMENT_PATTERN',
  BATTERY_LEVEL = 'BATTERY_LEVEL',
  SIGNAL_STRENGTH = 'SIGNAL_STRENGTH',
  HEALTH_INDICATOR = 'HEALTH_INDICATOR',
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
