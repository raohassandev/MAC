// client/src/types/device.types.ts

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
  tags?: string[];
  make?: string;
  model?: string;
  description?: string;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  parameters: TemplateParameter[];
}

export interface TemplateParameter {
  id: string;
  name: string;
  registerIndex: number;
  dataType: 'int16' | 'uint16' | 'int32' | 'uint32' | 'float32' | 'float64';
  scaleFactor?: number;
  unit?: string;
  byteOrder?: 'AB' | 'BA' | 'ABCD' | 'CDAB' | 'BADC' | 'DCBA';
}
