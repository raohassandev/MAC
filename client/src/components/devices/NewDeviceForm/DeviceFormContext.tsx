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
  | { type: 'TOGGLE_VALIDATION_SUMMARY'; show: boolean }
  | { type: 'SET_FORM_TOUCHED'; touched: boolean }
  | { type: 'VALIDATE_FORM' }
  | { type: 'RESET_FORM' };

// Create the reducer function
export const deviceFormReducer = (
  state: DeviceFormState,
  action: DeviceFormAction
): DeviceFormState => {
  switch (action.type) {
    case 'UPDATE_DEVICE_BASIC':
      return {
        ...state,
        deviceBasics: {
          ...state.deviceBasics,
          [action.field]: action.value,
        },
        uiState: {
          ...state.uiState,
          formTouched: true,
        },
      };

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

    case 'UPDATE_CONNECTION_SETTING':
      return {
        ...state,
        connectionSettings: {
          ...state.connectionSettings,
          [action.field]: action.value,
        },
        uiState: {
          ...state.uiState,
          formTouched: true,
        },
      };

    case 'ADD_REGISTER_RANGE':
      return {
        ...state,
        registerRanges: [...state.registerRanges, action.range],
        uiState: {
          ...state.uiState,
          formTouched: true,
        },
      };

    case 'UPDATE_REGISTER_RANGE':
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

      return {
        ...state,
        registerRanges: updatedRanges,
        parameters: updatedParameters,
        uiState: {
          ...state.uiState,
          formTouched: true,
        },
      };

    case 'DELETE_REGISTER_RANGE':
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

    case 'SET_EDITING_RANGE':
      return {
        ...state,
        uiState: {
          ...state.uiState,
          isEditingRange: action.isEditing,
          editingRangeIndex: action.index,
        },
      };

    case 'ADD_PARAMETER':
      return {
        ...state,
        parameters: [...state.parameters, action.parameter],
        uiState: {
          ...state.uiState,
          formTouched: true,
        },
      };

    case 'DELETE_PARAMETER':
      return {
        ...state,
        parameters: state.parameters.filter((_, i) => i !== action.index),
        uiState: {
          ...state.uiState,
          formTouched: true,
        },
      };

    case 'SET_CURRENT_TAB':
      return {
        ...state,
        uiState: {
          ...state.uiState,
          currentTab: action.tab,
        },
      };

    case 'SET_CURRENT_RANGE_FOR_DATA_PARSER':
      return {
        ...state,
        uiState: {
          ...state.uiState,
          currentRangeForDataParser: action.index,
        },
      };

    case 'TOGGLE_DATA_PARSER_MODAL':
      return {
        ...state,
        uiState: {
          ...state.uiState,
          showDataParserModal: action.show,
        },
      };

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

    case 'VALIDATE_FORM':
      const validation = validateDeviceForm(
        state.deviceBasics,
        state.connectionSettings.type,
        state.registerRanges,
        state.parameters
      );

      return {
        ...state,
        validationState: validation,
        uiState: {
          ...state.uiState,
          showValidationSummary: !validation.isValid,
        },
      };

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
