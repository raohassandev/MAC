import React, { useState, useEffect } from 'react';
import { X, Trash, FileText, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import * as Dialog from '@radix-ui/react-dialog';
// import * as Table from '@radix-ui/theme/react-table';
import { Button, Table } from '@radix-ui/themes';
import { useDeviceForm } from '../DeviceFormContext';
import { FormField } from '../shared/FormField';
import { ParameterConfig } from '../../../../types/form.types';
import {
  createValidationResult,
  validateParameterConfig,
} from '../../../../utils/formValidation';

// Data types and byte order options from ParameterForm
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

const DataParserModal: React.FC = () => {
  const { state, dispatch } = useDeviceForm();
  const { registerRanges, parameters, uiState, validationState } = state;
  const { currentRangeForDataParser, showDataParserModal } = uiState;

  // Local state for the new parameter
  const [newParameter, setNewParameter] = useState<ParameterConfig>({
    name: '',
    dataType: 'UINT-16',
    scalingFactor: 1,
    decimalPoint: 0,
    byteOrder: 'AB',
    registerRange: '',
    registerIndex: 0,
  });

  // Update the parameter form when the selected range changes
  useEffect(() => {
    if (
      currentRangeForDataParser !== null &&
      registerRanges[currentRangeForDataParser]
    ) {
      setNewParameter((prev) => ({
        ...prev,
        registerRange: registerRanges[currentRangeForDataParser].rangeName,
      }));
    }
  }, [currentRangeForDataParser, registerRanges]);

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

    // Validate as user types
    const tempValidation = createValidationResult(); // Create an empty validation object
    validateParameterConfig(
      { ...newParameter, [field]: value },
      parameters,
      registerRanges,
      tempValidation
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
  };

  const handleAddParameter = () => {
    // Validate parameter configuration
    const tempValidation = createValidationResult(); // Create an empty validation object
    validateParameterConfig(
      newParameter,
      parameters,
      registerRanges,
      tempValidation
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

  const handleDeleteParameter = (paramIndex: number) => {
    dispatch({ type: 'DELETE_PARAMETER', index: paramIndex });
    toast.info('Parameter configuration removed');
  };

  const handleClose = () => {
    dispatch({ type: 'TOGGLE_DATA_PARSER_MODAL', show: false });
    dispatch({ type: 'SET_CURRENT_RANGE_FOR_DATA_PARSER', index: null });
  };

  // Filter parameters for the current range
  const rangeParameters =
    currentRangeForDataParser !== null &&
    registerRanges[currentRangeForDataParser]
      ? parameters.filter(
          (p) =>
            p.registerRange ===
            registerRanges[currentRangeForDataParser].rangeName
        )
      : [];

  // If not open or no range selected, don't render
  if (!showDataParserModal || currentRangeForDataParser === null) return null;

  const selectedRange = registerRanges[currentRangeForDataParser];

  return (
    <Dialog.Root open={showDataParserModal} onOpenChange={() => handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 bg-gray-600 bg-opacity-50' />
        <Dialog.Content className='fixed inset-0 flex items-center justify-center z-[60]'>
          <div className='bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto'>
            <div className='flex justify-between items-center p-4 border-b'>
              <Dialog.Title className='text-xl font-semibold'>
                Configure Buffer Data Parser
              </Dialog.Title>
              <Dialog.Close className='text-gray-500 hover:text-gray-700'>
                <X size={20} />
              </Dialog.Close>
            </div>

            <div className='p-4'>
              <div className='bg-blue-50 p-3 rounded-md mb-4 text-sm text-blue-800'>
                <p className='font-medium'>
                  Configure how to parse data for {selectedRange?.rangeName}
                </p>
                <p>
                  Define parameter names, data types, and scaling factors for
                  each register in this range.
                </p>
              </div>

              {/* Validation warnings */}
              {validationState.parameters.length > 0 && (
                <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md'>
                  <h4 className='text-sm font-medium text-red-800'>
                    Parameter Configuration Issues:
                  </h4>
                  <ul className='mt-1 text-sm text-red-700 list-disc list-inside'>
                    {validationState.parameters.map((error, index) => (
                      <li key={index}>{error.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Parameter Configuration Form */}
              <div className='mb-6 border rounded-lg p-4 bg-gray-50'>
                <h4 className='font-medium text-gray-800 mb-3'>
                  Add New Parameter
                </h4>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3'>
                  <div>
                    <FormField
                      label='Parameter Name'
                      required
                      error={getFieldError('name')}
                    >
                      <input
                        type='text'
                        value={newParameter.name}
                        onChange={(e) =>
                          handleInputChange('name', e.target.value)
                        }
                        className={`p-1.5 border rounded w-full text-sm ${
                          getFieldError('name') ? 'border-red-500' : ''
                        }`}
                        placeholder='Parameter name'
                        required
                      />
                    </FormField>
                  </div>

                  <div>
                    <FormField
                      label='Data Type'
                      required
                      error={getFieldError('dataType')}
                    >
                      <select
                        value={newParameter.dataType}
                        onChange={(e) =>
                          handleInputChange('dataType', e.target.value)
                        }
                        className={`w-full flex items-center justify-between p-1.5 border rounded bg-white text-sm ${
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
                        className={`p-1.5 border rounded w-full text-sm ${
                          getFieldError('scalingFactor') ? 'border-red-500' : ''
                        }`}
                        step='0.001'
                        min='0.001'
                      />
                    </FormField>
                  </div>

                  <div>
                    <FormField
                      label='Decimal Points'
                      error={getFieldError('decimalPoint')}
                    >
                      <input
                        type='number'
                        value={newParameter.decimalPoint}
                        onChange={(e) =>
                          handleInputChange(
                            'decimalPoint',
                            parseInt(e.target.value) || 0
                          )
                        }
                        className={`p-1.5 border rounded w-full text-sm ${
                          getFieldError('decimalPoint') ? 'border-red-500' : ''
                        }`}
                        min='0'
                        max='10'
                      />
                    </FormField>
                  </div>

                  <div>
                    <FormField
                      label='Byte Order'
                      error={getFieldError('byteOrder')}
                    >
                      <select
                        value={newParameter.byteOrder}
                        onChange={(e) =>
                          handleInputChange('byteOrder', e.target.value)
                        }
                        className={`w-full flex items-center justify-between p-1.5 border rounded bg-white text-sm ${
                          getFieldError('byteOrder') ? 'border-red-500' : ''
                        }`}
                      >
                        {getByteOrderOptions(newParameter.dataType).map(
                          (option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          )
                        )}
                      </select>
                    </FormField>
                  </div>

                  <div>
                    <FormField
                      label='Register Index'
                      error={getFieldError('registerIndex')}
                    >
                      <input
                        type='number'
                        value={newParameter.registerIndex}
                        onChange={(e) =>
                          handleInputChange(
                            'registerIndex',
                            parseInt(e.target.value) || 0
                          )
                        }
                        className={`p-1.5 border rounded w-full text-sm ${
                          getFieldError('registerIndex') ? 'border-red-500' : ''
                        }`}
                        min='0'
                        max={selectedRange?.length - 1 || 0}
                      />
                      <span className='text-xs text-gray-500 mt-1 block'>
                        Index within range (0-{selectedRange?.length - 1 || 0})
                      </span>
                    </FormField>
                  </div>
                </div>

                <button
                  onClick={handleAddParameter}
                  className='flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                  disabled={!newParameter.name}
                >
                  <Plus size={16} /> Add Parameter
                </button>
              </div>

              {/* Parameter Configuration Table */}
              {rangeParameters.length > 0 ? (
                <div className='mt-4'>
                  <Table.Root variant='surface' size='2'>
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeaderCell>
                          Parameter Name
                        </Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>
                          Data Type
                        </Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>
                          Scaling Factor
                        </Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>
                          Decimal Point
                        </Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>
                          Byte Order
                        </Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>
                          Register Index
                        </Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {rangeParameters.map((config, index) => (
                        <Table.Row key={index}>
                          <Table.Cell>{config.name}</Table.Cell>
                          <Table.Cell>{config.dataType}</Table.Cell>
                          <Table.Cell>{config.scalingFactor}</Table.Cell>
                          <Table.Cell>{config.decimalPoint}</Table.Cell>
                          <Table.Cell>{config.byteOrder}</Table.Cell>
                          <Table.Cell>{config.registerIndex}</Table.Cell>
                          <Table.Cell>
                            <Button
                              color='red'
                              variant='soft'
                              size='1'
                              onClick={() => {
                                // Find index in the full parameters array
                                const fullIndex = parameters.findIndex(
                                  (p) =>
                                    p.name === config.name &&
                                    p.registerRange === config.registerRange &&
                                    p.registerIndex === config.registerIndex
                                );
                                if (fullIndex !== -1) {
                                  handleDeleteParameter(fullIndex);
                                }
                              }}
                            >
                              <Trash size={16} />
                            </Button>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Root>
                </div>
              ) : (
                <div className='bg-gray-50 p-6 rounded text-center'>
                  <FileText size={24} className='mx-auto text-gray-400 mb-2' />
                  <p className='text-gray-500'>
                    No parameter configurations added for this register range
                    yet.
                  </p>
                  <p className='text-gray-400 text-sm mt-1'>
                    Add parameters using the form above.
                  </p>
                </div>
              )}

              <div className='mt-6 flex justify-end space-x-3'>
                <button
                  onClick={handleClose}
                  className='px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50'
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
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

export default DataParserModal;
