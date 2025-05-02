// client/src/components/devices/NewDeviceForm/DataReaderTab.tsx
import React, { useState } from 'react';
import { Plus, Trash, Edit, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useDeviceForm } from './DeviceFormContext';
import ParameterEditor from './ParameterEditor';
import { ParameterConfig } from '../../../types/form.types';

const DataReaderTab: React.FC = () => {
  const { state, actions } = useDeviceForm();
  const [expandedParamIndex, setExpandedParamIndex] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleAddParameter = () => {
    setIsAddingNew(true);
  };

  const handleEditParameter = (index: number) => {
    setExpandedParamIndex(index);
  };

  const handleDeleteParameter = (index: number) => {
    actions.deleteParameter(index);
  };

  const handleSaveParameter = (parameter: ParameterConfig) => {
    if (expandedParamIndex !== null) {
      actions.updateParameter(expandedParamIndex, parameter);
      setExpandedParamIndex(null);
    } else {
      actions.addParameter(parameter);
      setIsAddingNew(false);
    }
  };

  const handleCancelEdit = () => {
    setExpandedParamIndex(null);
    setIsAddingNew(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Data Parameters</h3>
        <Button 
          onClick={handleAddParameter} 
          size="sm" 
          icon={<Plus size={16} />}
          disabled={isAddingNew}
        >
          Add Parameter
        </Button>
      </div>

      {/* Add New Parameter Section - Expandable */}
      {isAddingNew && (
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
          <h4 className="text-md font-medium mb-3">Add New Parameter</h4>
          <ParameterEditor 
            onSave={handleSaveParameter}
            onCancel={handleCancelEdit}
            availableRanges={state.registerRanges}
          />
        </div>
      )}

      {/* Existing Parameters List */}
      <div className="space-y-3">
        {state.parameters.length === 0 && !isAddingNew ? (
          <div className="text-center py-8 bg-gray-50 rounded-md">
            <p className="text-gray-500">No parameters defined yet.</p>
            <Button 
              variant="outline" 
              className="mt-2" 
              size="sm"
              onClick={handleAddParameter}
            >
              Add your first parameter
            </Button>
          </div>
        ) : (
          state.parameters.map((param, index) => (
            <div key={index} className="border border-gray-200 rounded-md overflow-hidden">
              <div 
                className="flex justify-between items-center p-4 bg-white cursor-pointer"
                onClick={() => expandedParamIndex === index 
                  ? setExpandedParamIndex(null) 
                  : setExpandedParamIndex(index)
                }
              >
                <div>
                  <h4 className="font-medium text-gray-900">{param.name}</h4>
                  <p className="text-sm text-gray-500">
                    Type: {param.dataType}, Range: {param.registerRange}, Index: {param.registerIndex}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    icon={<Edit size={16} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditParameter(index);
                    }}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    icon={<Trash size={16} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteParameter(index);
                    }}
                  >
                    Delete
                  </Button>
                  {expandedParamIndex === index ? 
                    <ChevronUp size={20} /> : 
                    <ChevronDown size={20} />
                  }
                </div>
              </div>
              
              {/* Expanded Edit Section */}
              {expandedParamIndex === index && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <ParameterEditor 
                    initialData={param}
                    onSave={handleSaveParameter}
                    onCancel={handleCancelEdit}
                    availableRanges={state.registerRanges}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DataReaderTab;