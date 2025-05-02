// client/src/components/devices/NewDeviceForm/validation.ts
import { DeviceFormState } from './DeviceFormContext';

// Validation errors organized by form section
export interface ValidationErrors {
  basicInfo: Record<string, string>;
  connection: Record<string, string>;
  registers: Record<string, string>;
  parameters: Record<string, string>;
  general: string[];
  isValid: boolean;
}

// Validates the device basics section
export const validateDeviceBasics = (
  deviceBasics: DeviceFormState['deviceBasics']
): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Required field validation
  if (!deviceBasics.name?.trim()) {
    errors.name = 'Device name is required';
  } else if (deviceBasics.name.length < 3) {
    errors.name = 'Device name must be at least 3 characters';
  }

  // Make is required
  if (!deviceBasics.make?.trim()) {
    errors.make = 'Manufacturer/Make is required';
  }

  // Model is required
  if (!deviceBasics.model?.trim()) {
    errors.model = 'Model is required';
  }

  return errors;
};

// Validates connection settings
export const validateConnectionSettings = (
  connectionSettings: DeviceFormState['connectionSettings']
): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  // Validate based on connection type
  if (connectionSettings.type === 'tcp') {
    // TCP validation
    if (!connectionSettings.ip?.trim()) {
      errors.ip = 'IP address is required';
    } else {
      // Simple IP validation (could be more comprehensive)
      const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (!ipPattern.test(connectionSettings.ip)) {
        errors.ip = 'Please enter a valid IP address (e.g., 192.168.1.100)';
      }
    }

    if (!connectionSettings.port) {
      errors.port = 'Port is required';
    } else {
      const port = parseInt(connectionSettings.port, 10);
      if (isNaN(port) || port < 1 || port > 65535) {
        errors.port = 'Port must be a number between 1 and 65535';
      }
    }
  } else if (connectionSettings.type === 'rtu') {
    // RTU validation
    if (!connectionSettings.serialPort?.trim()) {
      errors.serialPort = 'Serial port is required';
    }
    
    // Baud rate validation
    if (!connectionSettings.baudRate) {
      errors.baudRate = 'Baud rate is required';
    } else {
      const baudRate = parseInt(connectionSettings.baudRate, 10);
      if (isNaN(baudRate) || !isValidBaudRate(baudRate)) {
        errors.baudRate = 'Please select a valid baud rate';
      }
    }

    // Data bits validation
    if (!connectionSettings.dataBits) {
      errors.dataBits = 'Data bits is required';
    } else {
      const dataBits = parseInt(connectionSettings.dataBits, 10);
      if (isNaN(dataBits) || dataBits < 5 || dataBits > 8) {
        errors.dataBits = 'Data bits must be between 5 and 8';
      }
    }

    // Stop bits validation
    if (!connectionSettings.stopBits) {
      errors.stopBits = 'Stop bits is required';
    } else {
      const validStopBits = ['1', '1.5', '2'];
      if (!validStopBits.includes(connectionSettings.stopBits)) {
        errors.stopBits = 'Please select a valid stop bits value';
      }
    }

    // Parity validation
    if (!connectionSettings.parity) {
      errors.parity = 'Parity is required';
    } else {
      const validParity = ['none', 'even', 'odd'];
      if (!validParity.includes(connectionSettings.parity)) {
        errors.parity = 'Please select a valid parity option';
      }
    }
  }

  // Slave ID validation (required for both types)
  if (!connectionSettings.slaveId) {
    errors.slaveId = 'Slave ID is required';
  } else {
    const slaveId = parseInt(connectionSettings.slaveId, 10);
    if (isNaN(slaveId) || slaveId < 1 || slaveId > 255) {
      errors.slaveId = 'Slave ID must be a number between 1 and 255';
    }
  }

  return errors;
};

// Validates register ranges
export const validateRegisterRanges = (
  registerRanges: DeviceFormState['registerRanges']
): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  if (registerRanges.length === 0) {
    errors.general = 'At least one register range is required';
    return errors;
  }
  
  // Check for overlapping register ranges
  const ranges = [...registerRanges];
  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i];
    
    if (!range.rangeName?.trim()) {
      errors[`range_${i}_name`] = 'Range name is required';
    }
    
    if (!range.functionCode) {
      errors[`range_${i}_functionCode`] = 'Function code is required';
    }
    
    if (range.startRegister === undefined || range.startRegister === null) {
      errors[`range_${i}_startRegister`] = 'Start register is required';
    } else if (range.startRegister < 0) {
      errors[`range_${i}_startRegister`] = 'Start register must be a positive number';
    }
    
    if (range.length === undefined || range.length === null) {
      errors[`range_${i}_length`] = 'Length is required';
    } else if (range.length <= 0) {
      errors[`range_${i}_length`] = 'Length must be greater than 0';
    }
    
    // Check for overlaps with other ranges
    for (let j = 0; j < ranges.length; j++) {
      if (i !== j) { // Don't compare with self
        const otherRange = ranges[j];
        
        if (range.functionCode === otherRange.functionCode) {
          const rangeStart = range.startRegister;
          const rangeEnd = range.startRegister + range.length - 1;
          const otherStart = otherRange.startRegister;
          const otherEnd = otherRange.startRegister + otherRange.length - 1;
          
          // Check if ranges overlap
          if (
            (rangeStart <= otherEnd && rangeEnd >= otherStart) ||
            (otherStart <= rangeEnd && otherEnd >= rangeStart)
          ) {
            errors[`range_${i}_overlap`] = `This range overlaps with "${otherRange.name}"`;
            break;
          }
        }
      }
    }
  }
  
  return errors;
};

// Validate parameters
export const validateParameters = (
  parameters: DeviceFormState['parameters']
): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  // Parameters are optional, but if present, they must be valid
  if (parameters.length > 0) {
    parameters.forEach((param, index) => {
      if (!param.name?.trim()) {
        errors[`param_${index}_name`] = 'Parameter name is required';
      }
      
      if (!param.registerIndex && param.registerIndex !== 0) {
        errors[`param_${index}_registerIndex`] = 'Register index is required';
      } else if (param.registerIndex < 0) {
        errors[`param_${index}_registerIndex`] = 'Register index must be a positive number';
      }
      
      if (!param.dataType) {
        errors[`param_${index}_dataType`] = 'Data type is required';
      }
      
      // Check for duplicate parameter names
      const duplicate = parameters.findIndex(
        (p, i) => i !== index && p.name?.trim() === param.name?.trim()
      );
      
      if (duplicate !== -1) {
        errors[`param_${index}_duplicate`] = 'Parameter name must be unique';
      }
    });
  }
  
  return errors;
};

// Main validation function
export const validateDeviceForm = (
  formState: DeviceFormState
): ValidationErrors => {
  const basicInfoErrors = validateDeviceBasics(formState.deviceBasics);
  const connectionErrors = validateConnectionSettings(formState.connectionSettings);
  const registerErrors = validateRegisterRanges(formState.registerRanges);
  const parameterErrors = validateParameters(formState.parameters);
  
  // Collect general errors
  const generalErrors: string[] = [];
  
  // Check if there are required register ranges
  if (formState.registerRanges.length === 0) {
    generalErrors.push('At least one register range is required');
  }
  
  return {
    basicInfo: basicInfoErrors,
    connection: connectionErrors,
    registers: registerErrors,
    parameters: parameterErrors,
    general: generalErrors,
    isValid: 
      Object.keys(basicInfoErrors).length === 0 &&
      Object.keys(connectionErrors).length === 0 &&
      Object.keys(registerErrors).length === 0 &&
      Object.keys(parameterErrors).length === 0 &&
      generalErrors.length === 0
  };
};

// Helper function to validate baud rate
function isValidBaudRate(baudRate: number): boolean {
  const validBaudRates = [1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200];
  return validBaudRates.includes(baudRate);
}

// Function to convert validation errors to the format expected by the form state
export const convertValidationErrorsToState = (
  errors: ValidationErrors
): DeviceFormState['validationState'] => {
  const validationState: DeviceFormState['validationState'] = {
    isValid: errors.isValid,
    basicInfo: [],
    connection: [],
    registers: [],
    parameters: [],
    general: [],
  };

  // Convert basic info errors
  Object.entries(errors.basicInfo).forEach(([field, message]) => {
    validationState.basicInfo.push({ field, message });
  });

  // Convert connection errors
  Object.entries(errors.connection).forEach(([field, message]) => {
    validationState.connection.push({ field, message });
  });

  // Convert register errors
  Object.entries(errors.registers).forEach(([field, message]) => {
    validationState.registers.push({ field, message });
  });

  // Convert parameter errors
  Object.entries(errors.parameters).forEach(([field, message]) => {
    validationState.parameters.push({ field, message });
  });

  // Add general errors
  errors.general.forEach((message) => {
    validationState.general.push({ field: 'general', message });
  });

  return validationState;
};