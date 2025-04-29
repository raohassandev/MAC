export interface Register {
  name: string;
  address: number;
  length: number;
  scaleFactor?: number;
  decimalPoint?: number;
  byteOrder?: string;
  unit?: string;
}

export interface Device {
  _id: string;
  name: string;
  ip: string;
  port: number;
  slaveId: number;
  enabled: boolean;
  registers: Register[];
  lastSeen?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface DeviceReading {
  name: string;
  address: number;
  value: number | null;
  unit?: string;
  error?: string;
}
