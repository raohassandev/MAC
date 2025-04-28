import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className='min-h-screen bg-gray-100 flex flex-col justify-center items-center px-6 py-12'>
      <div className='max-w-md w-full bg-white shadow-md rounded-lg overflow-hidden'>
        <div className='p-8'>
          <div className='flex items-center justify-center mb-6'>
            <AlertCircle size={48} className='text-red-500' />
          </div>
          <h1 className='text-3xl font-bold text-center text-gray-800 mb-4'>
            404 - Page Not Found
          </h1>
          <p className='text-gray-600 text-center mb-8'>
            The page you are looking for doesn't exist or has been moved.
          </p>
          <div className='flex justify-center'>
            <Link
              to='/'
              className='bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors'
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
