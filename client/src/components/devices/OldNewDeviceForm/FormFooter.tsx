import React from 'react';
import { Save, AlertCircle } from 'lucide-react';
import { useDeviceForm } from './DeviceFormContext';

interface FormFooterProps {
  onCancel: () => void;
  onSubmit: () => void;
}

const FormFooter: React.FC<FormFooterProps> = ({ onCancel, onSubmit }) => {
  const { state, dispatch } = useDeviceForm();
  const { uiState, validationState } = state;

  return (
    <div className='flex justify-between p-4 border-t gap-2'>
      <div>
        {uiState.formTouched && !validationState.isValid && (
          <button
            onClick={() =>
              dispatch({
                type: 'TOGGLE_VALIDATION_SUMMARY',
                show: !uiState.showValidationSummary,
              })
            }
            className='px-4 py-2 border border-amber-300 bg-amber-50 text-amber-800 rounded hover:bg-amber-100 flex items-center gap-2'
          >
            <AlertCircle size={16} />
            {uiState.showValidationSummary
              ? 'Hide Validation Issues'
              : 'Show Validation Issues'}
          </button>
        )}
      </div>
      <div className='flex gap-2'>
        <button
          onClick={onCancel}
          className='px-4 py-2 border border-gray-300 rounded hover:bg-gray-50'
          type='button'
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2'
          disabled={uiState.loading}
          type='button'
        >
          {uiState.loading ? (
            <>
              <svg
                className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <Save size={16} />
              Add Device
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default FormFooter;
