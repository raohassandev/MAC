import React from 'react';

interface Register {
  name: string;
  address: number;
  length: number;
  scaleFactor?: number;
  decimalPoint?: number;
  byteOrder?: string;
  unit?: string;
}

interface RegisterTableProps {
  registers: Register[];
}

const RegisterTable: React.FC<RegisterTableProps> = ({ registers }) => {
  if (!registers || registers.length === 0) {
    return (
      <div className='bg-gray-50 p-6 rounded-lg text-center'>
        <p className='text-gray-500'>No registers configured for this device</p>
      </div>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Name
            </th>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Address
            </th>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Length
            </th>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Scale Factor
            </th>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Decimal Point
            </th>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Byte Order
            </th>
            <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Unit
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {registers.map((register, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900'>
                {register.name}
              </td>
              <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500'>
                {register.address}
              </td>
              <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500'>
                {register.length}
              </td>
              <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500'>
                {register.scaleFactor ?? 1}
              </td>
              <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500'>
                {register.decimalPoint ?? 0}
              </td>
              <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500'>
                {register.byteOrder ?? 'AB CD'}
              </td>
              <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500'>
                {register.unit || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegisterTable;
