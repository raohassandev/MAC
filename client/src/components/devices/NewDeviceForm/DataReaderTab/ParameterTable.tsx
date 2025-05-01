import React from 'react';
import { Trash, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import { useDeviceForm } from '../../context/DeviceFormContext';
import ConfirmationDialog from '../../shared/ConfirmationDialog';

const ParameterTable: React.FC = () => {
  const { state, dispatch } = useDeviceForm();
  const { parameters } = state;

  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [paramToDelete, setParamToDelete] = React.useState<number | null>(null);

  const handleDeleteClick = (index: number) => {
    setParamToDelete(index);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (paramToDelete === null) return;

    dispatch({ type: 'DELETE_PARAMETER', index: paramToDelete });
    toast.info('Parameter configuration removed');
    setShowDeleteConfirm(false);
    setParamToDelete(null);
  };

  if (parameters.length === 0) {
    return (
      <div className='text-center p-8 bg-gray-50 rounded-lg border border-gray-200'>
        <FileText size={36} className='mx-auto text-gray-400 mb-2' />
        <p className='text-gray-600'>No parameters configured yet</p>
        <p className='text-sm text-gray-500 mt-1'>
          Use the form above to add parameter configurations for your register
          ranges
        </p>
      </div>
    );
  }

  return (
    <div className='mt-6'>
      <h3 className='text-md font-medium text-gray-700 mb-3'>
        Configured Parameters
      </h3>

      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Name
              </th>
              <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Register Range
              </th>
              <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Register Index
              </th>
              <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Data Type
              </th>
              <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Byte Order
              </th>
              <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Scaling
              </th>
              <th className='px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {parameters.map((param, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-700'>
                  {param.name}
                </td>
                <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-700'>
                  {param.registerRange}
                </td>
                <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-700'>
                  {param.registerIndex}
                </td>
                <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-700'>
                  {param.dataType}
                </td>
                <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-700'>
                  {param.byteOrder}
                </td>
                <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-700'>
                  ×{param.scalingFactor} ({param.decimalPoint} dp)
                </td>
                <td className='px-4 py-2 whitespace-nowrap text-sm text-right'>
                  <button
                    onClick={() => handleDeleteClick(index)}
                    className='text-red-600 hover:text-red-900'
                    title='Delete parameter'
                  >
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Dialog for Delete */}
      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        title='Confirm Delete'
        message={
          paramToDelete !== null && parameters[paramToDelete]
            ? `Are you sure you want to delete the parameter "${parameters[paramToDelete].name}"?`
            : 'Are you sure you want to delete this parameter?'
        }
        confirmText='Delete'
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
};

export default ParameterTable;
