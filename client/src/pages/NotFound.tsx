import { AlertCircle, Home } from 'lucide-react';

import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8'>
      <div className='flex flex-col items-center'>
        <div className='rounded-full bg-red-100 p-3'>
          <AlertCircle size={36} className='text-red-600' />
        </div>
        <h1 className='mt-4 text-3xl font-bold text-gray-900'>
          Page Not Found
        </h1>
        <p className='mt-2 text-center text-gray-600'>
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className='mt-8'>
          <Link
            to='/'
            className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            <Home size={18} className='mr-2' />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
