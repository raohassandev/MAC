// FunctionCodeSelector.tsx
import React from 'react';
import SelectControl from './SelectControl';

const functionCodeOptions = [
  { value: '1', label: '1 - Read Coils' },
  { value: '2', label: '2 - Read Discrete Inputs' },
  { value: '3', label: '3 - Read Holding Registers' },
  { value: '4', label: '4 - Read Input Registers' },
  { value: '5', label: '5 - Write Single Coil' },
  { value: '6', label: '6 - Write Single Register' },
  { value: '15', label: '15 - Write Multiple Coils' },
  { value: '16', label: '16 - Write Multiple Registers' },
  { value: '22', label: '22 - Mask Write Register' },
  { value: '23', label: '23 - Read/Write Multiple Registers' },
];

interface FunctionCodeSelectorProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
  required?: boolean;
}

const FunctionCodeSelector: React.FC<FunctionCodeSelectorProps> = ({
  value,
  onChange,
  error,
  required = false,
}) => {
  return (
    <SelectControl
      label='Function Code'
      options={functionCodeOptions}
      value={value.toString()}
      onChange={(val) => onChange(parseInt(val))}
      error={error}
      required={required}
      name='functionCode'
    />
  );
};

export default FunctionCodeSelector;
