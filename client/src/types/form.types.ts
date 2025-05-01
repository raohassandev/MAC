// client/src/types/form.types.ts

// Register range type for the form
export interface RegisterRange {
  rangeName: string;
  startRegister: number;
  length: number;
  functionCode: number;
  dataParser?: ParameterConfig[]; // Optional array of parameter configurations
}

// Parameter configuration interface
export interface ParameterConfig {
  name: string;
  dataType: string;
  scalingFactor: number;
  decimalPoint: number;
  byteOrder: string;
  registerRange?: string; // Optional for standalone parameters
  registerIndex: number;
}

// Device form data interface
export interface DeviceFormData {
  name: string;
  make: string;
  model: string;
  description: string;
  ip: string;
  port: string;
  slaveId: string;
  serialPort: string;
  baudRate: string;
  dataBits: string;
  stopBits: string;
  parity: string;
  enabled: boolean;
  tags: string[];
}

// Form field validation state interface
export interface FieldValidation {
  valid: boolean;
  message: string;
}

// Form validation state interface
export interface FormValidation {
  [key: string]: FieldValidation;
}
