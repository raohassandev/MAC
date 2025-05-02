// client/src/components/devices/NewDeviceForm/ParameterEditor.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Form } from '../../ui/Form';
import { ParameterConfig, RegisterRange } from '../../../types/form.types';

// Custom Select component
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  options: SelectOption[];
}

const Select: React.FC<SelectProps> = ({ id, value, onChange, options, error }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <select
      id={id}
      value={value}
      onChange={handleChange}
      className={`block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${
        error ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' : ''
      }`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

interface ParameterEditorProps {
  initialData?: ParameterConfig;
  onSave: (parameter: ParameterConfig) => void;
  onCancel: () => void;
  availableRanges: RegisterRange[];
}

const ParameterEditor: React.FC<ParameterEditorProps> = ({
  initialData,
  onSave,
  onCancel,
  availableRanges,
}) => {
  // Use a default value for registerRange to avoid undefined issues
  const defaultRegisterRange = availableRanges.length > 0 ? availableRanges[0].rangeName : '';
  
  const [parameter, setParameter] = useState<ParameterConfig>({
    name: '',
    dataType: 'INT-16',
    scalingFactor: 1,
    decimalPoint: 0,
    byteOrder: 'AB',
    registerRange: defaultRegisterRange,
    registerIndex: 0,
    ...initialData // This will override defaults if initialData is provided
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      // Ensure registerRange is not undefined
      setParameter({
        ...initialData,
        registerRange: initialData.registerRange || defaultRegisterRange
      });
    }
  }, [initialData, defaultRegisterRange]);

  // Update parameter if availableRanges changes and we need to set a new default
  useEffect(() => {
    if (!parameter.registerRange && availableRanges.length > 0) {
      setParameter(prev => ({
        ...prev,
        registerRange: availableRanges[0].rangeName
      }));
    }
  }, [availableRanges, parameter.registerRange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let parsedValue: string | number = value;
    if (['scalingFactor', 'decimalPoint', 'registerIndex'].includes(name)) {
      parsedValue = parseFloat(value) || 0;
    }

    setParameter(prev => ({
      ...prev,
      [name]: parsedValue
    }));

    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setParameter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!parameter.name.trim()) {
      newErrors.name = 'Parameter name is required';
    }

    if (!parameter.dataType) {
      newErrors.dataType = 'Data type is required';
    }

    if (!parameter.registerRange) {
      newErrors.registerRange = 'Register range is required';
    }

    // Check if the register index is valid for the selected range
    if (parameter.registerRange) {
      const selectedRange = availableRanges.find(range => range.rangeName === parameter.registerRange);
      if (selectedRange && (parameter.registerIndex < 0 || parameter.registerIndex >= selectedRange.length)) {
        newErrors.registerIndex = `Index must be between 0 and ${selectedRange.length - 1}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(parameter);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label htmlFor="name" required>Parameter Name</Form.Label>
        <Input
          id="name"
          name="name"
          value={parameter.name}
          onChange={handleInputChange}
          error={errors.name}
          placeholder="e.g., Temperature"
        />
      </Form.Group>

      <Form.Row>
        <Form.Group>
          <Form.Label htmlFor="dataType" required>Data Type</Form.Label>
          <Select
            id="dataType"
            value={parameter.dataType}
            onChange={handleSelectChange('dataType')}
            error={errors.dataType}
            options={[
              { value: 'INT-16', label: 'INT-16' },
              { value: 'UINT-16', label: 'UINT-16' },
              { value: 'INT-32', label: 'INT-32' },
              { value: 'UINT-32', label: 'UINT-32' },
              { value: 'FLOAT', label: 'FLOAT' },
              { value: 'DOUBLE', label: 'DOUBLE' },
            ]}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="byteOrder">Byte Order</Form.Label>
          <Select
            id="byteOrder"
            value={parameter.byteOrder}
            onChange={handleSelectChange('byteOrder')}
            options={[
              { value: 'AB', label: 'AB' },
              { value: 'BA', label: 'BA' },
              { value: 'ABCD', label: 'ABCD' },
              { value: 'DCBA', label: 'DCBA' },
              { value: 'BADC', label: 'BADC' },
              { value: 'CDAB', label: 'CDAB' },
            ]}
          />
        </Form.Group>
      </Form.Row>

      <Form.Row>
        <Form.Group>
          <Form.Label htmlFor="scalingFactor">Scaling Factor</Form.Label>
          <Input
            id="scalingFactor"
            name="scalingFactor"
            type="number"
            step="0.001"
            value={parameter.scalingFactor}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="decimalPoint">Decimal Places</Form.Label>
          <Input
            id="decimalPoint"
            name="decimalPoint"
            type="number"
            min="0"
            max="10"
            value={parameter.decimalPoint}
            onChange={handleInputChange}
          />
        </Form.Group>
      </Form.Row>

      <Form.Group>
        <Form.Label htmlFor="registerRange" required>Register Range</Form.Label>
        <Select
          id="registerRange"
          value={parameter.registerRange||''}
          onChange={handleSelectChange('registerRange')}
          error={errors.registerRange}
          options={availableRanges.map(range => ({
            value: range.rangeName,
            label: range.rangeName
          }))}
        />
        {availableRanges.length === 0 && (
          <p className="text-amber-500 text-xs mt-1">
            No register ranges defined. Please add a register range first.
          </p>
        )}
      </Form.Group>

      <Form.Group>
        <Form.Label htmlFor="registerIndex" required>Register Index</Form.Label>
        <Input
          id="registerIndex"
          name="registerIndex"
          type="number"
          min="0"
          value={parameter.registerIndex}
          onChange={handleInputChange}
          error={errors.registerIndex}
        />
      </Form.Group>

      <Form.Actions>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Parameter' : 'Add Parameter'}
        </Button>
      </Form.Actions>
    </Form>
  );
};

export default ParameterEditor;