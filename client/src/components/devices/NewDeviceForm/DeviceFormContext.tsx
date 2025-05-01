import React, { createContext, useReducer, useContext } from 'react';
import { ParameterConfig, RegisterRange } from '../../../types/form.types';
import {
  DeviceFormValidation,
  createValidationResult,
  validateDeviceForm,
} from '../../../utils/formValidation';

// Define the shape of our context state
export interface DeviceFormState {
  deviceBasics: {
    name: string;
    make: string;
    model: string;
    description: string;
    enabled: boolean;
    tags: string[];
  };
  connectionSettings: {
    type: 'tcp' | 'rtu';
    ip: string;
    port: string;
    slaveId: string;
    serialPort: string;
    baudRate: string;
    dataBits: string;
    stopBits: string;
    parity: string;
  };
  registerRanges: RegisterRange[];
  parameters: ParameterConfig[];
  uiState: {
    currentTab: string;
    isEditingRange: boolean;
    editingRangeIndex: number | null;
    currentRangeForDataParser: number | null;
    showDataParserModal: boolean;
    loading: boolean;
    error: string | null;
    showValidationSummary: boolean;
    formTouched: boolean;
  };
  validationState: DeviceFormValidation;
}

// Define the initial state
export const initialState: DeviceFormState = {
  deviceBasics: {
    name: '',
    make: '',
    model: '',
    description: '',
    enabled: true,
    tags: [],
  },
  connectionSettings: {
    type: 'tcp',
    ip: '',
    port: '502',
    slaveId: '1',
    serialPort: '',
    baudRate: '9600',
    dataBits: '8',
    stopBits: '1',
    parity: 'none',
  },
  registerRanges: [],
  parameters: [],
  uiState: {
    currentTab: 'connection',
    isEditingRange: false,
    editingRangeIndex: null,
    currentRangeForDataParser: null,
    showDataParserModal: false,
    loading: false,
    error: null,
    showValidationSummary: false,
    formTouched: false,
  },
  validationState: createValidationResult(),
};

// Define action types for strong typing
export type DeviceFormAction =
  | { type: 'UPDATE_DEVICE_BASIC'; field: string; value: string | boolean }
  | { type: 'UPDATE_CONNECTION_TYPE'; value: 'tcp' | 'rtu' }
  | { type: 'UPDATE_CONNECTION_SETTING'; field: string; value: string }
  | { type: 'ADD_REGISTER_RANGE'; range: RegisterRange }
  | { type: 'UPDATE_REGISTER_RANGE'; index: number; range: RegisterRange }
  | { type: 'DELETE_REGISTER_RANGE'; index: number }
  | { type: 'SET_EDITING_RANGE'; isEditing: boolean; index: number | null }
  | { type: 'ADD_PARAMETER'; parameter: ParameterConfig }
  | { type: 'DELETE_PARAMETER'; index: number }
  | { type: 'SET_CURRENT_TAB'; tab: string }
  | { type: 'SET_CURRENT_RANGE_FOR_DATA_PARSER'; index: number | null }
  | { type: 'TOGGLE_DATA_PARSER_MODAL'; show: boolean }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'SET_VALIDATION_ERRORS'; validation: DeviceFormValidation }
  | { type: 'CLEAR_VALIDATION_ERRORS' }
  | { type: 'TOGGLE_VALIDATION_SUMMARY'; show: boolean }
  | { type: 'SET_FORM_TOUCHED'; touched: boolean }
  | { type: 'VALIDATE_FORM' }
  | { type: 'RESET_FORM' };

// Helper to check if a field has a value
const hasValue = (value: any): boolean => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim() !== '';
  return true;
};

// Helper to validate field value and clear errors
const validateAndClearFieldError = (
  state: DeviceFormState,
  section: keyof Omit<DeviceFormValidation, 'isValid'>,
  field: string,
  value: any
): DeviceFormValidation => {
  const validationState = { ...state.validationState };

  // If field has a value, remove any existing error for this field
  if (hasValue(value)) {
    validationState[section] = validationState[section].filter(
      (err) => err.field !== field
    );
  }

  // Recalculate overall validation state
  validationState.isValid =
    validationState.basicInfo.length === 0 &&
    validationState.connection.length === 0 &&
    validationState.registers.length === 0 &&
    validationState.parameters.length === 0 &&
    validationState.general.length === 0;

  return validationState;
};

// Create the reducer function
export const deviceFormReducer = (
  state: DeviceFormState,
  action: DeviceFormAction
): DeviceFormState => {
  switch (action.type) {
    case 'UPDATE_DEVICE_BASIC': {
      // Clear validation errors for this field if it has a value
      const validationState = validateAndClearFieldError(
        state,
        'basicInfo',
        action.field,
        action.value
      );

      return {
        ...state,
        deviceBasics: {
          ...state.deviceBasics,
          [action.field]: action.value,
        },
        validationState,
        uiState: {
          ...state.uiState,
          formTouched: true,
        },
      };
    }

    case 'UPDATE_CONNECTION_TYPE':
      return {
        ...state,
        connectionSettings: {
          ...state.connectionSettings,
          type: action.value,
        },
        uiState: {
          ...state.uiState,
          formTouched: true,
        },
      };

    case 'UPDATE_CONNECTION_SETTING': {
      // Clear validation errors for this field if it has a value
      const validationState = validateAndClearFieldError(
        state,
        'connection',
        action.field,
        action.value
      );

      // Special case for register range validation - if we validate on field change
      // If we have at least one register range, clear that general error
      if (
        action.field === 'registerRanges' &&
        state.registerRanges.length > 0
      ) {
        validationState.general = validationState.general.filter(
          (err) => !err.message.includes('register range must be defined')
        );
      }

      return {
        ...state,
        connectionSettings: {
          ...state.connectionSettings,
          [action.field]: action.value,
        },
        validationState,
        uiState: {
          ...state.uiState,
          formTouched: true,
        },
      };
    }

    case 'ADD_REGISTER_RANGE': {
      // When adding a register range, clear any "must define at least one register range" errors
      const updatedGeneral = state.validationState.general.filter(
        (err) => !err.message.includes('register range must be defined')
      );

      return {
        ...state,
        registerRanges: [...state.registerRanges, action.range],
        validationState: {
          ...state.validationState,
          general: updatedGeneral,
          isValid:
            state.validationState.isValid ||
            (state.validationState.general.length === 1 &&
              updatedGeneral.length === 0),
        },
        uiState: {
          ...state.uiState,
          formTouched: true,
        },
      };
    }

    case 'UPDATE_REGISTER_RANGE': {
      const updatedRanges = [...state.registerRanges];
      updatedRanges[action.index] = action.range;

      // Update any parameters that reference the old range name
      const oldRangeName = state.registerRanges[action.index].rangeName;
      const newRangeName = action.range.rangeName;

      let updatedParameters = [...state.parameters];
      if (oldRangeName !== newRangeName) {
        updatedParameters = state.parameters.map((param) =>
          param.registerRange === oldRangeName
            ? { ...param, registerRange: newRangeName }
            : param
        );
      }

      // Clear any register range validation errors for this specific range
      const validationState = { ...state.validationState };
      validationState.registers = validationState.registers.filter(
        (err) => !err.field.includes(oldRangeName)
      );

      return {
        ...state,
        registerRanges: updatedRanges,
        parameters: updatedParameters,
        validationState,
        uiState: {
          ...state.uiState,
          formTouched: true,
        },
      };
    }

    case 'DELETE_REGISTER_RANGE': {
      const rangeName = state.registerRanges[action.index].rangeName;

      // Remove any parameters associated with this range
      const filteredParameters = state.parameters.filter(
        (param) => param.registerRange !== rangeName
      );

      return {
        ...state,
        registerRanges: state.registerRanges.filter(
          (_, i) => i !== action.index
        ),
        parameters: filteredParameters,
        uiState: {
          ...state.uiState,
          formTouched: true,
        },
      };
    }

    case 'SET_EDITING_RANGE':
      return {
        ...state,
        uiState: {
          ...state.uiState,
          isEditingRange: action.isEditing,
          editingRangeIndex: action.index,
        },
      };

    case 'ADD_PARAMETER': {
      // Clear validation errors for this parameter
      const validationState = { ...state.validationState };
      validationState.parameters = validationState.parameters.filter(
        (err) => err.field !== action.parameter.name
      );

      return {
        ...state,
        parameters: [...state.parameters, action.parameter],
        validationState,
        uiState: {
          ...state.uiState,
          formTouched: true,
        },
      };
    }

    case 'DELETE_PARAMETER':
      return {
        ...state,
        parameters: state.parameters.filter((_, i) => i !== action.index),
        uiState: {
          ...state.uiState,
          formTouched: true,
        },
      };

    case 'SET_CURRENT_TAB': {
      // Clear any tab-specific errors when changing tabs
      let validationState = { ...state.validationState };
      if (action.tab === 'registers') {
        // Clear register-related errors
        validationState.general = validationState.general.filter(
          (err) => !err.message.includes('register range must be defined')
        );
      }

      return {
        ...state,
        validationState,
        uiState: {
          ...state.uiState,
          currentTab: action.tab,
          // Hide validation summary when switching tabs unless there are real errors
          showValidationSummary:
            state.uiState.showValidationSummary && !validationState.isValid,
        },
      };
    }

    case 'SET_CURRENT_RANGE_FOR_DATA_PARSER':
      return {
        ...state,
        uiState: {
          ...state.uiState,
          currentRangeForDataParser: action.index,
        },
      };

    case 'TOGGLE_DATA_PARSER_MODAL': {
      // Store previous modal state to detect transitions
      const wasOpen = state.uiState.showDataParserModal;
      const willBeOpen = action.show;

      return {
        ...state,
        // When closing the modal, clear parameter validation errors
        validationState:
          willBeOpen === false
            ? {
                ...state.validationState,
                parameters: [],
              }
            : state.validationState,
        uiState: {
          ...state.uiState,
          showDataParserModal: willBeOpen,
          // If we're closing the modal, also reset the currentRangeForDataParser
          currentRangeForDataParser: willBeOpen
            ? state.uiState.currentRangeForDataParser
            : null,
        },
      };
    }

    case 'SET_LOADING':
      return {
        ...state,
        uiState: {
          ...state.uiState,
          loading: action.loading,
        },
      };

    case 'SET_ERROR':
      return {
        ...state,
        uiState: {
          ...state.uiState,
          error: action.error,
        },
      };

    case 'SET_VALIDATION_ERRORS':
      return {
        ...state,
        validationState: action.validation,
      };

    case 'CLEAR_VALIDATION_ERRORS':
      return {
        ...state,
        validationState: createValidationResult(),
        uiState: {
          ...state.uiState,
          showValidationSummary: false,
        },
      };

    case 'TOGGLE_VALIDATION_SUMMARY':
      return {
        ...state,
        uiState: {
          ...state.uiState,
          showValidationSummary: action.show,
        },
      };

    case 'SET_FORM_TOUCHED':
      return {
        ...state,
        uiState: {
          ...state.uiState,
          formTouched: action.touched,
        },
      };

    case 'VALIDATE_FORM': {
      let validation = validateDeviceForm(
        state.deviceBasics,
        state.connectionSettings.type,
        state.registerRanges,
        state.parameters
      );

      // Special case: If we're on the registers tab and just added a register range,
      // don't show the "must define register range" error
      if (
        state.uiState.currentTab === 'registers' &&
        state.registerRanges.length > 0
      ) {
        validation.general = validation.general.filter(
          (err) => !err.message.includes('register range must be defined')
        );

        // Recalculate isValid
        validation.isValid =
          validation.basicInfo.length === 0 &&
          validation.connection.length === 0 &&
          validation.registers.length === 0 &&
          validation.parameters.length === 0 &&
          validation.general.length === 0;
      }

      return {
        ...state,
        validationState: validation,
        uiState: {
          ...state.uiState,
          showValidationSummary: !validation.isValid,
        },
      };
    }

    case 'RESET_FORM':
      return initialState;

    default:
      return state;
  }
};

// Create the context
export const DeviceFormContext = createContext<{
  state: DeviceFormState;
  dispatch: React.Dispatch<DeviceFormAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Create a provider component
export const DeviceFormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(deviceFormReducer, initialState);

  return (
    <DeviceFormContext.Provider value={{ state, dispatch }}>
      {children}
    </DeviceFormContext.Provider>
  );
};

// Custom hook for using the context
export const useDeviceForm = () => useContext(DeviceFormContext);
