import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'react-toastify';

import { DeviceFormProvider, useDeviceForm } from './DeviceFormContext';
import ErrorDisplay from './shared/ErrorDisplay';
import FormTabs from './FormTabs';
import FormFooter from './FormFooter';
import { convertFormToDeviceData } from '../../../utils/TypeAdapter';

interface NewDeviceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (device: any) => void;
}

// Main container component that uses context
const NewDeviceFormContent: React.FC<NewDeviceFormProps> = ({
  onClose,
  onSubmit,
}) => {
  const { state, dispatch } = useDeviceForm();

  // Clear specific errors and validation issues on load
  useEffect(() => {
    dispatch({ type: 'CLEAR_VALIDATION_ERRORS' });
  }, []);

  // Auto-clear specific validation errors when relevant fields are filled
  useEffect(() => {
    if (
      state.deviceBasics.name &&
      state.connectionSettings.ip &&
      state.connectionSettings.port &&
      state.connectionSettings.slaveId
    ) {
      // If basic required fields are filled, clear basic validation errors
      dispatch({ type: 'CLEAR_VALIDATION_ERRORS' });
    }
  }, [
    state.deviceBasics.name,
    state.connectionSettings.ip,
    state.connectionSettings.port,
    state.connectionSettings.slaveId,
  ]);

  // Clear register-related errors when registers are added
  useEffect(() => {
    if (state.registerRanges.length > 0) {
      dispatch({
        type: 'SET_VALIDATION_ERRORS',
        validation: {
          ...state.validationState,
          general: state.validationState.general.filter(
            (err) => !err.message.includes('register range must be defined')
          ),
        },
      });
    }
  }, [state.registerRanges.length]);

  const handleSubmit = () => {
    // Re-validate the form for submission
    dispatch({ type: 'VALIDATE_FORM' });

    // Check if there are still validation errors
    if (!state.validationState.isValid) {
      // Show validation summary
      dispatch({ type: 'TOGGLE_VALIDATION_SUMMARY', show: true });

      // Navigate to the tab with errors
      if (
        state.validationState.basicInfo.length > 0 ||
        state.validationState.connection.length > 0
      ) {
        dispatch({ type: 'SET_CURRENT_TAB', tab: 'connection' });
      } else if (state.validationState.registers.length > 0) {
        dispatch({ type: 'SET_CURRENT_TAB', tab: 'registers' });
      } else if (state.validationState.parameters.length > 0) {
        dispatch({ type: 'SET_CURRENT_TAB', tab: 'data' });
      }
      return;
    }

    // Prepare the device data for submission
    const deviceForSubmission = convertFormToDeviceData(
      state.deviceBasics,
      state.connectionSettings,
      state.registerRanges,
      state.parameters
    );

    onSubmit(deviceForSubmission);
    toast.success('Device added successfully');
    handleClose(); // Close the form after successful submission
  };

  const handleClose = () => {
    // Reset form state before closing
    dispatch({ type: 'RESET_FORM' });
    onClose();
  };

  // Watch for validation state changes and update fields when errors are fixed
  // This helps ensure that once a field is valid, the error is removed
  const checkFieldValidation = (field: string, value: any) => {
    if (value) {
      // Field has a value, so clear any validation errors for it
      dispatch({
        type: 'SET_VALIDATION_ERRORS',
        validation: {
          ...state.validationState,
          basicInfo: state.validationState.basicInfo.filter(
            (err) => err.field !== field
          ),
          connection: state.validationState.connection.filter(
            (err) => err.field !== field
          ),
        },
      });
    }
  };

  return (
    <Dialog.Content className='fixed inset-0 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
        <div className='flex justify-between items-center p-4 border-b'>
          <Dialog.Title className='text-xl font-semibold'>
            Add New Modbus Device
          </Dialog.Title>
          <Dialog.Close
            className='text-gray-500 hover:text-gray-700 cursor-pointer'
            onClick={(e) => {
              e.preventDefault();
              handleClose();
            }}
          >
            <X size={20} />
          </Dialog.Close>
        </div>

        {/* Display errors if any */}
        {state.uiState.error && (
          <ErrorDisplay
            message={state.uiState.error}
            onClose={() => dispatch({ type: 'SET_ERROR', error: null })}
          />
        )}

        {/* Display validation summary */}
        <ErrorDisplay
          validation={state.validationState}
          show={state.uiState.showValidationSummary}
          onClose={() => {
            dispatch({ type: 'TOGGLE_VALIDATION_SUMMARY', show: false });
            // Also clear some validation errors that might be stale
            if (
              state.deviceBasics.name &&
              state.connectionSettings.ip &&
              state.connectionSettings.port &&
              state.connectionSettings.slaveId
            ) {
              dispatch({ type: 'CLEAR_VALIDATION_ERRORS' });
            }
          }}
        />

        {/* Main Form Content */}
        <div className='p-4'>
          {/* Basic Device Information */}
          <div className='mb-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Device Name *
                </label>
                <input
                  placeholder='Enter device name'
                  name='name'
                  value={state.deviceBasics.name}
                  onChange={(e) => {
                    dispatch({
                      type: 'UPDATE_DEVICE_BASIC',
                      field: 'name',
                      value: e.target.value,
                    });
                    // Check if field is now valid
                    checkFieldValidation('name', e.target.value);
                  }}
                  className={`p-2 border rounded w-full ${
                    state.validationState.basicInfo.some(
                      (err) => err.field === 'name'
                    )
                      ? 'border-red-500'
                      : ''
                  }`}
                  required
                />
                {state.validationState.basicInfo.some(
                  (err) => err.field === 'name'
                ) && (
                  <p className='mt-1 text-sm text-red-600'>
                    {
                      state.validationState.basicInfo.find(
                        (err) => err.field === 'name'
                      )?.message
                    }
                  </p>
                )}
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Make/Manufacturer
                </label>
                <input
                  placeholder='E.g., Schneider, ABB'
                  name='make'
                  value={state.deviceBasics.make}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_DEVICE_BASIC',
                      field: 'make',
                      value: e.target.value,
                    })
                  }
                  className={`p-2 border rounded w-full ${
                    state.validationState.basicInfo.some(
                      (err) => err.field === 'make'
                    )
                      ? 'border-red-500'
                      : ''
                  }`}
                />
                {state.validationState.basicInfo.some(
                  (err) => err.field === 'make'
                ) && (
                  <p className='mt-1 text-sm text-red-600'>
                    {
                      state.validationState.basicInfo.find(
                        (err) => err.field === 'make'
                      )?.message
                    }
                  </p>
                )}
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Model
                </label>
                <input
                  placeholder='Device model'
                  name='model'
                  value={state.deviceBasics.model}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_DEVICE_BASIC',
                      field: 'model',
                      value: e.target.value,
                    })
                  }
                  className={`p-2 border rounded w-full ${
                    state.validationState.basicInfo.some(
                      (err) => err.field === 'model'
                    )
                      ? 'border-red-500'
                      : ''
                  }`}
                />
                {state.validationState.basicInfo.some(
                  (err) => err.field === 'model'
                ) && (
                  <p className='mt-1 text-sm text-red-600'>
                    {
                      state.validationState.basicInfo.find(
                        (err) => err.field === 'model'
                      )?.message
                    }
                  </p>
                )}
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Description
                </label>
                <textarea
                  placeholder='Brief description'
                  name='description'
                  value={state.deviceBasics.description}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_DEVICE_BASIC',
                      field: 'description',
                      value: e.target.value,
                    })
                  }
                  className={`p-2 border rounded w-full h-10 resize-none ${
                    state.validationState.basicInfo.some(
                      (err) => err.field === 'description'
                    )
                      ? 'border-red-500'
                      : ''
                  }`}
                  maxLength={500}
                />
                {state.validationState.basicInfo.some(
                  (err) => err.field === 'description'
                ) && (
                  <p className='mt-1 text-sm text-red-600'>
                    {
                      state.validationState.basicInfo.find(
                        (err) => err.field === 'description'
                      )?.message
                    }
                  </p>
                )}
                <p className='text-xs text-gray-500 mt-1'>
                  {state.deviceBasics.description.length}/500 characters
                </p>
              </div>
              <div className='md:col-span-2'>
                <label className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    name='enabled'
                    checked={state.deviceBasics.enabled}
                    onChange={(e) =>
                      dispatch({
                        type: 'UPDATE_DEVICE_BASIC',
                        field: 'enabled',
                        value: e.target.checked,
                      })
                    }
                    className='h-4 w-4 text-blue-600'
                  />
                  <span className='text-sm text-gray-700'>Device Enabled</span>
                </label>
              </div>
            </div>
          </div>

          {/* Tabs for the remaining form sections */}
          <FormTabs />
        </div>

        {/* Form Footer with Submit/Cancel Buttons */}
        <FormFooter onCancel={handleClose} onSubmit={handleSubmit} />
      </div>
    </Dialog.Content>
  );
};

// Wrapper component that provides the context
const NewDeviceFormContainer: React.FC<NewDeviceFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={() => onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 bg-gray-600 bg-opacity-50' />
        <DeviceFormProvider>
          <NewDeviceFormContent
            onClose={onClose}
            onSubmit={onSubmit}
            isOpen={isOpen}
          />
        </DeviceFormProvider>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default NewDeviceFormContainer;
