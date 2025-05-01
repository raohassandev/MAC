// RegisterRangeForm.tsx
import React, { useState, useEffect } from 'react';
import { Plus, Save, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useDeviceForm } from '../DeviceFormContext';
import { RegisterRange } from '@/types/form.types';
import { validateRegisterRange } from '@/utils/formValidation';
import { FormField } from '../shared/FormField';
import FunctionCodeSelector from '../shared/FunctionCodeSelector';

const RegisterRangeForm: React.FC = () => {
  const { state, dispatch } = useDeviceForm();
  const { registerRanges, validationState, uiState } = state;

  // Local state for the form
  const [newRange, setNewRange] = useState<RegisterRange>({
    rangeName: '',
    startRegister: 0,
    length: 1,
    functionCode: 3,
  });

  // Update form when editing an existing range
  useEffect(() => {
    if (uiState.isEditingRange && uiState.editingRangeIndex !== null) {
      const rangeToEdit = registerRanges[uiState.editingRangeIndex];
      setNewRange({ ...rangeToEdit });
    }
  }, [uiState.isEditingRange, uiState.editingRangeIndex, registerRanges]);

  // Helper function to get field error
  const getFieldError = (field: string): string | undefined => {
    const error = validationState.registers.find((err) => err.field === field);
    return error?.message;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = name === 'rangeName' ? value : parseInt(value);

    setNewRange({
      ...newRange,
      [name]: newValue,
    });

    // Validate as user types
    const tempValidation = validateRegisterRange(
      { ...newRange, [name]: newValue },
      registerRanges,
      uiState.isEditingRange,
      uiState.editingRangeIndex
    );

    if (!tempValidation.isValid) {
      // We only want to update with errors for this specific field
      const fieldErrors = tempValidation.registers.filter(
        (err) => err.field === name
      );
      if (fieldErrors.length > 0) {
        dispatch({
          type: 'SET_VALIDATION_ERRORS',
          validation: {
            ...validationState,
            registers: [
              ...validationState.registers.filter((err) => err.field !== name),
              ...fieldErrors,
            ],
          },
        });
      }
    } else {
      // Clear any errors for this field
      dispatch({
        type: 'SET_VALIDATION_ERRORS',
        validation: {
          ...validationState,
          registers: validationState.registers.filter(
            (err) => err.field !== name
          ),
        },
      });
    }
  };

  const handleFunctionCodeChange = (code: number) => {
    setNewRange({
      ...newRange,
      functionCode: code,
    });
  };

  const handleSubmit = () => {
    // Validate the register range
    const tempValidation = validateRegisterRange(
      newRange,
      registerRanges,
      uiState.isEditingRange,
      uiState.editingRangeIndex
    );

    if (!tempValidation.isValid) {
      dispatch({
        type: 'SET_VALIDATION_ERRORS',
        validation: {
          ...validationState,
          registers: tempValidation.registers,
        },
      });
      dispatch({ type: 'TOGGLE_VALIDATION_SUMMARY', show: true });
      return;
    }

    if (uiState.isEditingRange && uiState.editingRangeIndex !== null) {
      // Update existing register range
      dispatch({
        type: 'UPDATE_REGISTER_RANGE',
        index: uiState.editingRangeIndex,
        range: { ...newRange },
      });
      toast.success('Register range updated successfully');
    } else {
      // Add new register range
      dispatch({
        type: 'ADD_REGISTER_RANGE',
        range: { ...newRange },
      });
      toast.success('Register range added successfully');
    }

    // Reset form and edit state
    setNewRange({
      rangeName: '',
      startRegister: 0,
      length: 1,
      functionCode: 3,
    });
    dispatch({
      type: 'SET_EDITING_RANGE',
      isEditing: false,
      index: null,
    });
    dispatch({ type: 'SET_ERROR', error: null });
  };

  const handleCancel = () => {
    setNewRange({
      rangeName: '',
      startRegister: 0,
      length: 1,
      functionCode: 3,
    });
    dispatch({
      type: 'SET_EDITING_RANGE',
      isEditing: false,
      index: null,
    });
  };

  return (
    <div id='registerRangeForm' className='mb-6 border rounded-lg p-4'>
      <h3 className='font-medium text-gray-800 mb-3'>
        {uiState.isEditingRange ? 'Edit' : 'Add'} Register Range
      </h3>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
        <FormField
          label='Range Name'
          required
          error={getFieldError('rangeName')}
        >
          <input
            placeholder='e.g., Voltage Readings'
            type='text'
            name='rangeName'
            value={newRange.rangeName}
            onChange={handleInputChange}
            className={`p-2 border rounded w-full ${
              getFieldError('rangeName') ? 'border-red-500' : ''
            }`}
          />
        </FormField>

        <FormField
          label='Starting Register'
          required
          error={getFieldError('startRegister')}
        >
          <input
            placeholder='Start Address'
            type='number'
            name='startRegister'
            value={newRange.startRegister}
            onChange={handleInputChange}
            className={`p-2 border rounded w-full ${
              getFieldError('startRegister') ? 'border-red-500' : ''
            }`}
            min='0'
          />
        </FormField>

        <FormField
          label='Length (Number of Registers)'
          required
          error={getFieldError('length')}
        >
          <input
            placeholder='How many registers to read'
            type='number'
            name='length'
            value={newRange.length}
            onChange={handleInputChange}
            className={`p-2 border rounded w-full ${
              getFieldError('length') ? 'border-red-500' : ''
            }`}
            min='1'
            max='125'
          />
          <p className='text-xs text-gray-500 mt-1'>
            Maximum 125 registers per range (Modbus protocol limit)
          </p>
        </FormField>

        <FunctionCodeSelector
          value={newRange.functionCode}
          onChange={handleFunctionCodeChange}
          error={getFieldError('functionCode')}
          required
        />
      </div>

      <div className='flex items-center gap-2'>
        {uiState.isEditingRange && (
          <button
            onClick={handleCancel}
            className='flex items-center gap-2 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400'
          >
            <X size={16} /> Cancel
          </button>
        )}

        <button
          onClick={handleSubmit}
          className='flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
        >
          {uiState.isEditingRange ? (
            <>
              <Save size={16} /> Update Register Range
            </>
          ) : (
            <>
              <Plus size={16} /> Add Register Range
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RegisterRangeForm;
