// TypeAdapter.ts
import { RegisterRange as FormRegisterRange, ParameterConfig as FormParameterConfig } from '@/types/form.types';
// import { RegisterRange as DeviceRegisterRange, ParameterConfig as DeviceParameterConfig, DataType } from '../../types/device.types';

import {
  RegisterRange as DeviceRegisterRange,
  ParameterConfig as DeviceParameterConfig,
  DataType,
} from '@/types/device.types';

/**
 * Adapter to convert string dataType to enum DataType
 */
export function convertDataTypeToEnum(dataTypeStr: string): DataType {
  const dataTypeMap: Record<string, DataType> = {
    'INT-16': DataType.INT16,
    'UINT-16': DataType.UINT16,
    'INT-32': DataType.INT32,
    'UINT-32': DataType.UINT32,
    'FLOAT': DataType.FLOAT,
    'DOUBLE': DataType.DOUBLE,
    // Add other mappings as needed
  };
  
  return dataTypeMap[dataTypeStr] || DataType.UINT16; // Default to UINT16 if not found
}

/**
 * Converts a form parameter config to a device parameter config
 */
export function convertToDeviceParameterConfig(formParam: FormParameterConfig): DeviceParameterConfig {
  return {
    ...formParam,
    dataType: convertDataTypeToEnum(formParam.dataType)
  };
}

/**
 * Converts a form register range to a device register range
 */
export function convertToDeviceRegisterRange(formRange: FormRegisterRange): DeviceRegisterRange {
  return {
    ...formRange,
    dataParser: formRange.dataParser ? 
      formRange.dataParser.map(convertToDeviceParameterConfig) : 
      undefined
  };
}

/**
 * Converts the entire form data to device-compatible data for submission
 */
export function convertFormToDeviceData(
  deviceBasics: any,
  connectionSettings: any,
  registerRanges: FormRegisterRange[],
  parameters: FormParameterConfig[]
): any {
  return {
    ...deviceBasics,
    port: parseInt(connectionSettings.port),
    slaveId: parseInt(connectionSettings.slaveId),
    baudRate: parseInt(connectionSettings.baudRate),
    dataBits: parseInt(connectionSettings.dataBits),
    stopBits: parseInt(connectionSettings.stopBits),
    connectionType: connectionSettings.type,
    ip: connectionSettings.ip,
    serialPort: connectionSettings.serialPort,
    parity: connectionSettings.parity,
    registerRanges: registerRanges.map(convertToDeviceRegisterRange),
    parameterConfigs: parameters.map(convertToDeviceParameterConfig),
  };
}