// client/src/types/device.types.ts

export interface DeviceRegister {
  id?: string;
  name: string;
  address: number;
  length: number;
  functionCode?: number;
  type?: 'holding' | 'input' | 'coil' | 'discrete';
  scaleFactor?: number;
  decimalPoint?: number;
  byteOrder?: string;
  unit?: string;
}

export interface Device {
  _id: string;
  name: string;
  ip?: string;
  port?: number;
  slaveId: number;
  enabled: boolean;
  registers: DeviceRegister[];
  lastSeen?: Date | string;
  connectionType?: 'tcp' | 'rtu';
  serialPort?: string;
  baudRate?: number;
  dataBits?: number;
  stopBits?: number;
  parity?: 'none' | 'even' | 'odd';
  template?: string;
  location?: string;
  tags: string[];
  make?: string;
  model?: string;
  description?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface DeviceReading {
  name: string;
  address: number;
  value: number | string | null;
  unit: string;
  error?: string;
}

export interface DeviceReadingsResponse {
  deviceId: string;
  deviceName: string;
  timestamp: Date | string;
  readings: DeviceReading[];
}

export interface DeviceConnectionResult {
  success: boolean;
  message: string;
}

export interface DeviceTemplate {
  id: string;
  name: string;
  description: string;
  deviceType: string;
  registers: DeviceRegister[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface DeviceGroup {
  id: string;
  name: string;
  description?: string;
  devices: string[] | Device[];
  tags?: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type ConnectionType = 'tcp' | 'rtu';

export enum FunctionCode {
  ReadCoils = 1,
  ReadDiscreteInputs = 2,
  ReadHoldingRegisters = 3,
  ReadInputRegisters = 4,
  WriteSingleCoil = 5,
  WriteSingleRegister = 6,
  WriteMultipleCoils = 15,
  WriteMultipleRegisters = 16,
}

export enum RegisterType {
  Coil = 'coil',
  DiscreteInput = 'discrete',
  HoldingRegister = 'holding',
  InputRegister = 'input',
}

export interface DeviceFilter {
  status?: 'online' | 'offline' | null;
  search?: string;
  tag?: string;
  group?: string;
}

export interface DeviceStats {
  total: number;
  online: number;
  offline: number;
  lastAdded?: Device;
}

export enum DeviceStatus {
  Online = 'online',
  Offline = 'offline',
  Warning = 'warning',
  Error = 'error',
  Unknown = 'unknown',
}

export enum DeviceAction {
  View = 'view',
  Edit = 'edit',
  Delete = 'delete',
  Test = 'test',
  Read = 'read',
  Apply = 'apply',
}
