// client/src/types/device.types.ts

// Basic Device interface
export interface Device {
  _id: string;
  name: string;
  ip?: string;
  port?: number;
  slaveId: number;
  serialPort?: string;
  baudRate?: number;
  dataBits?: number;
  stopBits?: number;
  parity?: string;
  connectionType: 'tcp' | 'rtu';
  enabled: boolean;
  lastSeen?: Date | string;
  make?: string;
  model?: string;
  description?: string;
  tags?: string[];
  registerRanges?: RegisterRange[];
  parameterConfigs?: ParameterConfig[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Register range type
export interface RegisterRange {
  rangeName: string;
  startRegister: number;
  length: number;
  functionCode: number;
  dataParser?: ParameterConfig[]; // Optional array of parameter configurations
}

// Valid data types for parameter configuration
export enum DataType {
  INT16 = 'INT-16',
  UINT16 = 'UINT-16',
  INT32 = 'INT-32',
  UINT32 = 'UINT-32',
  FLOAT = 'FLOAT',
  DOUBLE = 'DOUBLE',
}

// Valid byte orders for single register data types
export type SingleRegisterByteOrder = 'AB' | 'BA';

// Valid byte orders for multi-register data types
export type MultiRegisterByteOrder = 'ABCD' | 'DCBA' | 'BADC' | 'CDAB';

// Combined byte order type
export type ByteOrder = SingleRegisterByteOrder | MultiRegisterByteOrder;

// Parameter configuration interface
export interface ParameterConfig {
  name: string;
  dataType: string; // Changed from DataType enum to string to match form.types
  scalingFactor: number;
  decimalPoint: number;
  byteOrder: string; // Changed from ByteOrder to string to match form.types
  registerRange?: string; // Optional for standalone parameters
  registerIndex: number;
}

// Device reading interface
export interface DeviceReading {
  _id: string;
  deviceId: string;
  timestamp: Date | string;
  parameters: {
    [key: string]: number | boolean | string;
  };
  rawData?: Buffer | string;
}

// Connection types
export type ConnectionType = 'tcp' | 'rtu';

// Valid function codes for Modbus
export enum FunctionCode {
  ReadCoils = 1,
  ReadDiscreteInputs = 2,
  ReadHoldingRegisters = 3,
  ReadInputRegisters = 4,
  WriteSingleCoil = 5,
  WriteSingleRegister = 6,
  WriteMultipleCoils = 15,
  WriteMultipleRegisters = 16,
  MaskWriteRegister = 22,
  ReadWriteMultipleRegisters = 23,
}

// Valid parity options
export type Parity = 'none' | 'even' | 'odd';

// Device filter interface
export interface DeviceFilter {
  search?: string;
  status?: 'online' | 'offline';
  type?: string;
  tags?: string[];
  groups?: string[];
}
