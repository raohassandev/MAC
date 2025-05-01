// TypeAdapter.ts
import {
  RegisterRange as FormRegisterRange,
  ParameterConfig as FormParameterConfig,
} from '../types/form.types';
import {
  RegisterRange as DeviceRegisterRange,
  ParameterConfig as DeviceParameterConfig,
  DataType,
} from '../types/device.types';

/**
 * Adapter to convert string dataType to enum DataType
 */
export function convertDataTypeToEnum(dataTypeStr: string): string {
  // Just return the string directly since we've changed the type to match
  return dataTypeStr;

  // Original implementation with enums:
  // const dataTypeMap: Record<string, DataType> = {
  //   'INT-16': DataType.INT16,
  //   'UINT-16': DataType.UINT16,
  //   'INT-32': DataType.INT32,
  //   'UINT-32': DataType.UINT32,
  //   'FLOAT': DataType.FLOAT,
  //   'DOUBLE': DataType.DOUBLE,
  // };
  // return dataTypeMap[dataTypeStr] || DataType.UINT16;
}

/**
 * Converts a form parameter config to a device parameter config
 */
export function convertToDeviceParameterConfig(
  formParam: FormParameterConfig
): DeviceParameterConfig {
  // Simply return the original parameter as the types now match
  return formParam;
}

/**
 * Converts a form register range to a device register range
 */
export function convertToDeviceRegisterRange(
  formRange: FormRegisterRange
): DeviceRegisterRange {
  // Simply return the original range as the types now match
  return formRange;
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
    registerRanges: registerRanges,
    parameterConfigs: parameters,
  };
}
