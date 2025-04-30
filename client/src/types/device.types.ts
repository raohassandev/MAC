// device.types.ts

export interface DeviceRegister {
  id?: string;
  address: number;
  length: number;
  functionCode: number;
  name: string;
  description?: string;
  type?: 'holding' | 'input' | 'coil' | 'discrete';
  scaleFactor?: number;
  unit?: string;
}

export interface Device {
  _id: string;
  name: string;
  ip?: string;
  port?: number;
  slaveId: number;
  enabled: boolean;
  registers?: DeviceRegister[];
  lastSeen?: Date | string;
  connectionType?: 'tcp' | 'rtu';
  serialPort?: string;
  baudRate?: number;
  dataBits?: number;
  stopBits?: number;
  parity?: 'none' | 'even' | 'odd';
  template?: string;
  location?: string;
  tags: string[]; // Ensure tags property is required and defined
  make?: string;
  model?: string;
  description?: string;
}

export interface DeviceReading {
  name: string;
  address: number;
  value: number | null;
  unit: string;
  error?: string;
}

export interface DeviceReadingsResponse {
  deviceId: string;
  deviceName: string;
  timestamp: Date;
  readings: DeviceReading[];
}
// device.types.ts

export interface DeviceRegister {
  id?: string;
  address: number;
  length: number;
  functionCode: number;
  name: string;
  description?: string;
  type?: 'holding' | 'input' | 'coil' | 'discrete';
  scaleFactor?: number;
  unit?: string;
}

export interface Device {
  _id: string;
  name: string;
  ip?: string;
  port?: number;
  slaveId: number;
  enabled: boolean;
  registers?: DeviceRegister[];
  lastSeen?: Date | string;
  connectionType?: 'tcp' | 'rtu';
  serialPort?: string;
  baudRate?: number;
  dataBits?: number;
  stopBits?: number;
  parity?: 'none' | 'even' | 'odd';
  template?: string;
  location?: string;
  tags: string[];  // Ensure tags property is required and defined
  make?: string;
  model?: string;
  description?: string;
}

export interface DeviceReading {
  name: string;
  address: number;
  value: number | null;
  unit: string;
  error?: string;
}

export interface DeviceReadingsResponse {
  deviceId: string;
  deviceName: string;
  timestamp: Date;
  readings: DeviceReading[];
}