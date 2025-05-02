// ConfirmationDialog.tsx
import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={() => onCancel()}>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 bg-gray-600 bg-opacity-50' />
        <Dialog.Content className='fixed inset-0 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-lg w-full max-w-md'>
            <div className='flex justify-between items-center p-4 border-b'>
              <Dialog.Title className='text-xl font-semibold'>
                {title}
              </Dialog.Title>
              <Dialog.Close className='text-gray-500 hover:text-gray-700'>
                <X size={20} />
              </Dialog.Close>
            </div>

            <div className='p-6'>
              <p className='text-gray-700'>{message}</p>
            </div>

            <div className='flex justify-end p-4 border-t gap-2'>
              <button
                onClick={onCancel}
                className='px-4 py-2 border border-gray-300 rounded hover:bg-gray-50'
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
              >
                {confirmText}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ConfirmationDialog;
