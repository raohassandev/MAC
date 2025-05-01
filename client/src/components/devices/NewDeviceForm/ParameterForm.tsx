import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { useDeviceForm } from '../../context/DeviceFormContext';
import { FormField } from '../../shared/FormField';
import SelectControl from '../../shared/SelectControl';
import { ParameterConfig } from '../../../types/form.types';
import { validateParameterConfig } from '../../../utils/formValidation';

// Data types
const dataTypeOptions = [
  { value: 'INT-16', label: 'Int16 (1 register)' },
  { value: 'UINT-16', label: 'UInt16 (1 register)' },
  { value: 'INT-32', label: 'Int32 (2 registers)' },
  { value: 'UINT-32', label: 'UInt32 (2 registers)' },
  { value: 'FLOAT', label: 'Float (2 registers)' },
  { value: 'DOUBLE', label: 'Double (4 registers)' },
];

const getByteOrderOptions = (dataType: string) => {
  if (['INT-16', 'UINT-16'].includes(dataType)) {
    return [
      { value: 'AB', label: 'AB (Big Endian)' },
      { value: 'BA', label: 'BA (Little Endian)' },
    ];
  } else {
    return [
      { value: 'ABCD', label: 'ABCD (Big Endian)' },
      { value: 'DCBA', label: 'DCBA (Little Endian)' },
      { value: 'BADC', label: 'BADC (Mixed Endian)' },
      { value: 'CDAB', label: 'CDAB (Mixed Endian)' },
    ];
  }
};

const ParameterForm: React.FC = () => {
  const { state, dispatch } = useDeviceForm();
  const { registerRanges, parameters, validationState } = state;

  // Local state for the parameter form
  const [newParameter, setNewParameter] = useState<ParameterConfig>({
    name: '',
    dataType: 'UINT-16',
    scalingFactor: 1,
    decimalPoint: 0,
    byteOrder: 'AB',
    registerRange: '',
    registerIndex: 0,
  });

  // Update byte order if data type changes
  useEffect(() => {
    if (
      (['INT-16', 'UINT-16'].includes(newParameter.dataType) &&
        !['AB', 'BA'].includes(newParameter.byteOrder)) ||
      (!['INT-16', 'UINT-16'].includes(newParameter.dataType) &&
        ['AB', 'BA'].includes(newParameter.byteOrder))
    ) {
      // If data type changes from 16-bit to larger or vice versa, update the byte order to a valid one
      const defaultOrder = ['INT-16', 'UINT-16'].includes(newParameter.dataType)
        ? 'AB'
        : 'ABCD';
      setNewParameter((prev) => ({ ...prev, byteOrder: defaultOrder }));
    }
  }, [newParameter.dataType]);

  // Helper function to get field error
  const getFieldError = (field: string): string | undefined => {
    const error = validationState.parameters.find((err) => err.field === field);
    return error?.message;
  };

  const handleInputChange = (field: string, value: string | number) => {
    setNewParameter({
      ...newParameter,
      [field]: value,
    });

    // Validate as user types if a range is selected
    if (newParameter.registerRange) {
      const tempValidation = validateParameterConfig(
        { ...newParameter, [field]: value },
        parameters,
        registerRanges
      );

      if (!tempValidation.isValid) {
        // We only want to update with errors for this specific field
        const fieldErrors = tempValidation.parameters.filter(
          (err) => err.field === field
        );
        if (fieldErrors.length > 0) {
          dispatch({
            type: 'SET_VALIDATION_ERRORS',
            validation: {
              ...validationState,
              parameters: [
                ...validationState.parameters.filter(
                  (err) => err.field !== field
                ),
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
            parameters: validationState.parameters.filter(
              (err) => err.field !== field
            ),
          },
        });
      }
    }
  };

  const handleAddParameter = () => {
    // Validate parameter configuration
    const tempValidation = validateParameterConfig(
      newParameter,
      parameters,
      registerRanges
    );

    if (!tempValidation.isValid) {
      dispatch({
        type: 'SET_VALIDATION_ERRORS',
        validation: {
          ...validationState,
          parameters: tempValidation.parameters,
        },
      });
      dispatch({ type: 'TOGGLE_VALIDATION_SUMMARY', show: true });
      return;
    }

    // Add the parameter
    dispatch({ type: 'ADD_PARAMETER', parameter: { ...newParameter } });

    // Calculate next index based on data type size
    const dataTypeSize = getDataTypeSize(newParameter.dataType);
    const nextIndex = newParameter.registerIndex + dataTypeSize;

    // Reset name field but keep other values for faster entry
    setNewParameter({
      ...newParameter,
      name: '',
      registerIndex: nextIndex,
    });

    toast.success('Parameter configuration added');
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border mb-6'>
      <div>
        <FormField
          label='Parameter Name'
          required
          error={getFieldError('name')}
        >
          <input
            type='text'
            value={newParameter.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`p-2 border rounded w-full ${
              getFieldError('name') ? 'border-red-500' : ''
            }`}
            placeholder='Parameter name'
          />
        </FormField>
      </div>

      <div>
        <FormField
          label='Register Range'
          required
          error={getFieldError('registerRange')}
        >
          <select
            value={newParameter.registerRange}
            onChange={(e) => handleInputChange('registerRange', e.target.value)}
            className={`p-2 border rounded w-full ${
              getFieldError('registerRange') ? 'border-red-500' : ''
            }`}
          >
            <option value=''>Select a register range</option>
            {registerRanges.map((range, index) => (
              <option key={index} value={range.rangeName}>
                {range.rangeName} ({range.length} regs)
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div>
        <FormField
          label='Register Index'
          required
          error={getFieldError('registerIndex')}
        >
          <input
            type='number'
            value={newParameter.registerIndex}
            onChange={(e) =>
              handleInputChange('registerIndex', parseInt(e.target.value))
            }
            className={`p-2 border rounded w-full ${
              getFieldError('registerIndex') ? 'border-red-500' : ''
            }`}
            min='0'
            placeholder='0'
          />
          <p className='text-xs text-gray-500 mt-1'>
            Index within the selected register range (starting from 0)
          </p>
        </FormField>
      </div>

      <div>
        <FormField label='Data Type' required error={getFieldError('dataType')}>
          <select
            value={newParameter.dataType}
            onChange={(e) => handleInputChange('dataType', e.target.value)}
            className={`p-2 border rounded w-full ${
              getFieldError('dataType') ? 'border-red-500' : ''
            }`}
          >
            {dataTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div>
        <FormField label='Byte Order' error={getFieldError('byteOrder')}>
          <select
            value={newParameter.byteOrder}
            onChange={(e) => handleInputChange('byteOrder', e.target.value)}
            className={`p-2 border rounded w-full ${
              getFieldError('byteOrder') ? 'border-red-500' : ''
            }`}
          >
            {getByteOrderOptions(newParameter.dataType).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div>
        <FormField
          label='Scaling Factor'
          error={getFieldError('scalingFactor')}
        >
          <input
            type='number'
            value={newParameter.scalingFactor}
            onChange={(e) =>
              handleInputChange(
                'scalingFactor',
                parseFloat(e.target.value) || 1
              )
            }
            className={`p-2 border rounded w-full ${
              getFieldError('scalingFactor') ? 'border-red-500' : ''
            }`}
            step='0.001'
            min='0.001'
            placeholder='1'
          />
          <p className='text-xs text-gray-500 mt-1'>
            The raw value will be multiplied by this factor
          </p>
        </FormField>
      </div>

      <div>
        <FormField label='Decimal Points' error={getFieldError('decimalPoint')}>
          <input
            type='number'
            value={newParameter.decimalPoint}
            onChange={(e) =>
              handleInputChange('decimalPoint', parseInt(e.target.value) || 0)
            }
            className={`p-2 border rounded w-full ${
              getFieldError('decimalPoint') ? 'border-red-500' : ''
            }`}
            min='0'
            max='10'
            placeholder='0'
          />
        </FormField>
      </div>

      <div className='md:col-span-3 flex justify-end mt-4'>
        <button
          onClick={handleAddParameter}
          className='flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
          disabled={!newParameter.name || !newParameter.registerRange}
        >
          <Plus size={16} /> Add Parameter
        </button>
      </div>
    </div>
  );
};

// Helper function to determine the register size used by a data type
const getDataTypeSize = (dataType: string): number => {
  switch (dataType) {
    case 'INT-16':
    case 'UINT-16':
      return 1;
    case 'INT-32':
    case 'UINT-32':
    case 'FLOAT':
      return 2;
    case 'DOUBLE':
      return 4;
    default:
      return 1;
  }
};

export default ParameterForm;
