import { useEffect, useState } from 'react';

const Footer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <footer className='bg-white border-t border-gray-200 py-2 px-4'>
      <div className='flex justify-between items-center text-xs text-gray-500'>
        <div>© 2025 MACSYS Systems. All rights reserved.</div>
        <div className='flex items-center space-x-3'>
          <div>
            {currentTime.toLocaleDateString()}{' '}
            {currentTime.toLocaleTimeString()}
          </div>
          <div className='flex items-center'>
            <span className='inline-block w-2 h-2 bg-green-500 rounded-full mr-1'></span>
            System Status: Online
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
