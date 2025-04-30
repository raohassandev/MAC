import {
  AlertTriangle,
  CreditCard,
  Edit,
  FileText,
  Plus,
  Search,
  Trash,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Template {
  id: string;
  name: string;
  description: string;
  deviceType: string;
  registerCount: number;
  createdAt: string;
  updatedAt: string;
}

const TemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock template data
        const mockTemplates: Template[] = [
          {
            id: '1',
            name: 'Energy Analyzer Template',
            description:
              'Standard template for energy analyzer devices with voltage, current, and power readings',
            deviceType: 'Energy Analyzer',
            registerCount: 12,
            createdAt: '2024-03-15T09:00:00Z',
            updatedAt: '2024-04-10T14:23:00Z',
          },
          {
            id: '2',
            name: 'HVAC Controller Template',
            description:
              'Template for HVAC controllers with temperature, humidity, and fan control registers',
            deviceType: 'HVAC Controller',
            registerCount: 8,
            createdAt: '2024-03-20T11:30:00Z',
            updatedAt: '2024-04-12T09:45:00Z',
          },
          {
            id: '3',
            name: 'Temperature Sensor Template',
            description: 'Basic template for temperature monitoring devices',
            deviceType: 'Sensor',
            registerCount: 4,
            createdAt: '2024-03-25T15:20:00Z',
            updatedAt: '2024-04-05T10:15:00Z',
          },
          {
            id: '4',
            name: 'Water Level Controller Template',
            description:
              'Template for water level controllers with level, flow, and pump control registers',
            deviceType: 'Level Controller',
            registerCount: 6,
            createdAt: '2024-04-02T08:40:00Z',
            updatedAt: '2024-04-15T16:30:00Z',
          },
        ];

        setTemplates(mockTemplates);
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleAddTemplate = () => {
    setCurrentTemplate(null);
    setShowAddModal(true);
  };

  const handleEditTemplate = (template: Template) => {
    setCurrentTemplate(template);
    setShowEditModal(true);
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      // In a real app, this would be an API call
      setTemplates(templates.filter((template) => template.id !== id));
    }
  };

  const handleDuplicateTemplate = (template: Template) => {
    const newTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTemplates([...templates, newTemplate]);
  };

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.deviceType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-gray-800'>Device Templates</h1>
        <button
          onClick={handleAddTemplate}
          className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center gap-2'
        >
          <Plus size={16} />
          Add Template
        </button>
      </div>

      <div className='bg-white shadow rounded-lg p-4'>
        <div className='relative'>
          <Search
            size={16}
            className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
          />
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search templates...'
            className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
      </div>

      {loading ? (
        <div className='animate-pulse p-8 text-center text-gray-500'>
          <FileText className='mx-auto mb-4' size={32} />
          <p>Loading templates...</p>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className='bg-white shadow rounded-lg p-8 text-center'>
          <FileText className='mx-auto mb-4 text-gray-400' size={32} />
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            No templates found
          </h3>
          <p className='text-gray-500 mb-4'>
            {searchQuery
              ? 'No templates match your search criteria. Try adjusting your search.'
              : "You haven't created any device templates yet."}
          </p>
          {!searchQuery && (
            <button
              onClick={handleAddTemplate}
              className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700'
            >
              <Plus size={16} className='mr-2' />
              Create your first template
            </button>
          )}
        </div>
      ) : (
        <div className='bg-white shadow rounded-lg overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Template Name
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Device Type
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Registers
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Last Updated
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredTemplates.map((template) => (
                  <tr key={template.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <CreditCard className='flex-shrink-0 h-5 w-5 text-gray-400' />
                        <div className='ml-4'>
                          <div className='text-sm font-medium text-gray-900'>
                            {template.name}
                          </div>
                          <div className='text-sm text-gray-500 truncate max-w-xs'>
                            {template.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800'>
                        {template.deviceType}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {template.registerCount} registers
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {formatDate(template.updatedAt)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                      <button
                        onClick={() => handleEditTemplate(template)}
                        className='text-indigo-600 hover:text-indigo-900 mr-3'
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDuplicateTemplate(template)}
                        className='text-blue-600 hover:text-blue-900 mr-3'
                      >
                        <FileText size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className='text-red-600 hover:text-red-900'
                      >
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* This is where you would add the modal components for adding/editing templates */}
      {/* We'll implement these in separate components */}
    </div>
  );
};

export default TemplatesPage;
