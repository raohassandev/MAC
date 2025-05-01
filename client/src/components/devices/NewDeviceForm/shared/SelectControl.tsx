// SelectControl.tsx
import React from 'react';
import { ChevronDown } from 'lucide-react';
import * as Select from '@radix-ui/react-select';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectControlProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
  name?: string;
}

const SelectControl: React.FC<SelectControlProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  required = false,
  error,
  name,
}) => {
  return (
    <div>
      {label && (
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          {label} {required && <span className='text-red-500'>*</span>}
        </label>
      )}

      <Select.Root name={name} value={value} onValueChange={onChange}>
        <Select.Trigger
          className={`w-full flex items-center justify-between p-2 border rounded bg-white ${
            error ? 'border-red-500' : ''
          }`}
        >
          <Select.Value placeholder={placeholder} />
          <Select.Icon>
            <ChevronDown size={16} />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content className='bg-white border rounded shadow-lg z-[999]'>
            <Select.Viewport className='p-1'>
              <Select.Group>
                {options.map((option) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                    className='flex items-center p-2 cursor-pointer hover:bg-blue-50 rounded outline-none'
                  >
                    <Select.ItemText>{option.label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
    </div>
  );
};

export default SelectControl;
