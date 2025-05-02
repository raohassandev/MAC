// RegisterRangeList.tsx
import React, { useState } from 'react';
import { Server, Settings, Trash, FileCode } from 'lucide-react';
import { toast } from 'react-toastify';

import ConfirmationDialog from '../shared/ConfirmationDialog';
import { useDeviceForm } from '../DeviceFormContext';

const RegisterRangeList: React.FC = () => {
  const { state, dispatch } = useDeviceForm();
  const { registerRanges } = state;

  // Local state to manage which range index to show parser for
  const [parserRangeIndex, setParserRangeIndex] = useState<number | null>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [rangeToDelete, setRangeToDelete] = useState<number | null>(null);

  const handleEditRegisterRange = (index: number) => {
    dispatch({
      type: 'SET_EDITING_RANGE',
      isEditing: true,
      index,
    });

    // Scroll to the form
    const formElement = document.getElementById('registerRangeForm');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDeleteClick = (index: number) => {
    setRangeToDelete(index);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (rangeToDelete === null) return;

    dispatch({ type: 'DELETE_REGISTER_RANGE', index: rangeToDelete });
    toast.info('Register range removed');
    setShowDeleteConfirm(false);
    setRangeToDelete(null);
  };

  // Direct handler for the parser button
  const handleOpenDataParser = (index: number) => {
    console.log('Opening parser for range index:', index);

    // Set local state first
    setParserRangeIndex(index);

    // Then dispatch actions to context
    dispatch({ type: 'SET_CURRENT_RANGE_FOR_DATA_PARSER', index });
    dispatch({ type: 'TOGGLE_DATA_PARSER_MODAL', show: true });
  };

  if (registerRanges.length === 0) {
    return (
      <div className='bg-gray-50 p-6 rounded text-center'>
        <Server size={24} className='mx-auto text-gray-400 mb-2' />
        <p className='text-gray-500'>
          No register ranges added yet. Add a register range for this device
          above.
        </p>
        <p className='text-gray-400 text-sm mt-1'>
          Each Modbus device has different register mappings. Check your device
          manual for details.
        </p>
      </div>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Range Name
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Start Register
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Length
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Function Code
            </th>
            <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Actions
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {registerRanges.map((range, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                {range.rangeName}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                {range.startRegister}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                {range.length}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                {getFunctionCodeLabel(range.functionCode)}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                <div className='flex items-center justify-end space-x-2'>
                  {/* Enhanced Parser button with more visible styles */}
                  <button
                    onClick={() => handleOpenDataParser(index)}
                    className='bg-green-50 hover:bg-green-100 text-green-600 p-2 rounded'
                    aria-label='Data Parser'
                    title='Configure Buffer Data Parser'
                    type='button'
                  >
                    <FileCode size={16} />
                  </button>
                  <button
                    onClick={() => handleEditRegisterRange(index)}
                    className='bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded'
                    aria-label='Edit range'
                    type='button'
                  >
                    <Settings size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(index)}
                    className='bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded'
                    aria-label='Delete range'
                    type='button'
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation Dialog for Delete */}
      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        title='Confirm Delete'
        message={
          rangeToDelete !== null && registerRanges[rangeToDelete]
            ? `Are you sure you want to delete the register range "${registerRanges[rangeToDelete].rangeName}"? Any parameter configurations associated with this range will also be removed.`
            : 'Are you sure you want to delete this register range?'
        }
        confirmText='Delete'
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
};

// Helper function to get function code label
const getFunctionCodeLabel = (code: number): string => {
  switch (code) {
    case 1:
      return '1 - Read Coils';
    case 2:
      return '2 - Read Discrete Inputs';
    case 3:
      return '3 - Read Holding Registers';
    case 4:
      return '4 - Read Input Registers';
    case 5:
      return '5 - Write Single Coil';
    case 6:
      return '6 - Write Single Register';
    case 15:
      return '15 - Write Multiple Coils';
    case 16:
      return '16 - Write Multiple Registers';
    case 22:
      return '22 - Mask Write Register';
    case 23:
      return '23 - Read/Write Multiple Registers';
    default:
      return `${code}`;
  }
};

export default RegisterRangeList;
