import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import * as Progress from '@radix-ui/react-progress';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Cpu,
  Database,
  Server,
} from 'lucide-react';

const SystemStatus: React.FC = () => {
  const [systemStats, setSystemStats] = useState({
    serverStatus: 'healthy', // healthy, warning, error
    databaseStatus: 'healthy',
    apiStatus: 'healthy',
    uptime: '5d 7h 23m',
    cpuUsage: 32,
    memoryUsage: 41,
    lastCheckTime: new Date().toLocaleTimeString(),
  });

  // In a real app, this would fetch data from an API
  useEffect(() => {
    const fetchSystemStatus = async () => {
      try {
        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Simulate some random variations in system metrics
        setSystemStats((prev) => ({
          ...prev,
          cpuUsage: Math.min(
            95,
            Math.max(
              5,
              prev.cpuUsage +
                (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5)
            )
          ),
          memoryUsage: Math.min(
            95,
            Math.max(
              5,
              prev.memoryUsage +
                (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3)
            )
          ),
          lastCheckTime: new Date().toLocaleTimeString(),
        }));
      } catch (error) {
        console.error('Error fetching system status:', error);
      }
    };

    // Initial fetch
    fetchSystemStatus();

    // Set up interval for periodic updates
    const intervalId = setInterval(fetchSystemStatus, 30000); // Update every 30 seconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-500';
      case 'warning':
        return 'text-amber-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle size={16} className='text-green-500' />;
      case 'warning':
        return <AlertCircle size={16} className='text-amber-500' />;
      case 'error':
        return <AlertCircle size={16} className='text-red-500' />;
      default:
        return null;
    }
  };

  const getUsageColor = (usage: number) => {
    if (usage < 50) return 'bg-green-500';
    if (usage < 80) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <Card.Root className='bg-white rounded-lg shadow-sm'>
      <Card.Header className='p-4 flex justify-between items-center border-b border-gray-200'>
        <h2 className='text-lg font-semibold flex items-center'>
          <Server className='mr-2 text-blue-500' size={20} />
          System Status
        </h2>
        <div className='text-sm text-gray-500'>
          Last checked: {systemStats.lastCheckTime}
        </div>
      </Card.Header>

      <Card.Content className='p-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {/* Server Status */}
          <Card.Root className='bg-gray-50 p-3 rounded-lg'>
            <Card.Content>
              <div className='flex justify-between items-center mb-1'>
                <div className='flex items-center'>
                  <Server size={16} className='mr-2 text-gray-600' />
                  <span className='text-sm font-medium text-gray-700'>
                    Server
                  </span>
                </div>
                <div className='flex items-center'>
                  {getStatusIcon(systemStats.serverStatus)}
                  <span
                    className={`text-xs ml-1 ${getStatusColor(
                      systemStats.serverStatus
                    )}`}
                  >
                    {systemStats.serverStatus.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className='mt-2'>
                <div className='flex justify-between text-xs text-gray-500 mb-1'>
                  <span>CPU Usage</span>
                  <span>{systemStats.cpuUsage}%</span>
                </div>
                <Progress.Root
                  className='w-full bg-gray-200 rounded-full h-1.5 overflow-hidden'
                  value={systemStats.cpuUsage}
                >
                  <Progress.Indicator
                    className={`h-1.5 rounded-full ${getUsageColor(
                      systemStats.cpuUsage
                    )}`}
                    style={{ width: `${systemStats.cpuUsage}%` }}
                  />
                </Progress.Root>
              </div>
              <div className='mt-2'>
                <div className='flex justify-between text-xs text-gray-500 mb-1'>
                  <span>Memory Usage</span>
                  <span>{systemStats.memoryUsage}%</span>
                </div>
                <Progress.Root
                  className='w-full bg-gray-200 rounded-full h-1.5 overflow-hidden'
                  value={systemStats.memoryUsage}
                >
                  <Progress.Indicator
                    className={`h-1.5 rounded-full ${getUsageColor(
                      systemStats.memoryUsage
                    )}`}
                    style={{ width: `${systemStats.memoryUsage}%` }}
                  />
                </Progress.Root>
              </div>
            </Card.Content>
          </Card.Root>

          {/* Database Status */}
          <Card.Root className='bg-gray-50 p-3 rounded-lg'>
            <Card.Content>
              <div className='flex justify-between items-center'>
                <div className='flex items-center'>
                  <Database size={16} className='mr-2 text-gray-600' />
                  <span className='text-sm font-medium text-gray-700'>
                    MongoDB
                  </span>
                </div>
                <div className='flex items-center'>
                  {getStatusIcon(systemStats.databaseStatus)}
                  <span
                    className={`text-xs ml-1 ${getStatusColor(
                      systemStats.databaseStatus
                    )}`}
                  >
                    {systemStats.databaseStatus.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className='mt-3 text-xs text-gray-500'>
                <div className='flex justify-between mb-1'>
                  <span>Connection Pool</span>
                  <span>12/20</span>
                </div>
                <div className='flex justify-between mb-1'>
                  <span>Query Response Time</span>
                  <span>42ms</span>
                </div>
                <div className='flex justify-between'>
                  <span>Database Size</span>
                  <span>248MB</span>
                </div>
              </div>
            </Card.Content>
          </Card.Root>

          {/* API Status */}
          <Card.Root className='bg-gray-50 p-3 rounded-lg'>
            <Card.Content>
              <div className='flex justify-between items-center'>
                <div className='flex items-center'>
                  <Cpu size={16} className='mr-2 text-gray-600' />
                  <span className='text-sm font-medium text-gray-700'>
                    API Service
                  </span>
                </div>
                <div className='flex items-center'>
                  {getStatusIcon(systemStats.apiStatus)}
                  <span
                    className={`text-xs ml-1 ${getStatusColor(
                      systemStats.apiStatus
                    )}`}
                  >
                    {systemStats.apiStatus.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className='mt-3 text-xs text-gray-500'>
                <div className='flex justify-between mb-1'>
                  <span>Request Rate</span>
                  <span>127 req/min</span>
                </div>
                <div className='flex justify-between mb-1'>
                  <span>Avg Response Time</span>
                  <span>238ms</span>
                </div>
                <div className='flex justify-between'>
                  <span>Error Rate</span>
                  <span className='text-green-500'>0.02%</span>
                </div>
              </div>
            </Card.Content>
          </Card.Root>

          {/* System Uptime */}
          <Card.Root className='bg-gray-50 p-3 rounded-lg'>
            <Card.Content>
              <div className='flex justify-between items-center'>
                <div className='flex items-center'>
                  <Clock size={16} className='mr-2 text-gray-600' />
                  <span className='text-sm font-medium text-gray-700'>
                    System Uptime
                  </span>
                </div>
              </div>
              <div className='mt-3 text-center'>
                <div className='text-2xl font-bold text-gray-700'>
                  {systemStats.uptime}
                </div>
                <div className='text-xs text-gray-500 mt-1'>
                  Since last restart
                </div>
              </div>
              <div className='mt-3 flex justify-center space-x-2'>
                <button className='px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300'>
                  Restart API
                </button>
                <button className='px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300'>
                  Restart All
                </button>
              </div>
            </Card.Content>
          </Card.Root>
        </div>
      </Card.Content>
    </Card.Root>
  );
};

export default SystemStatus;
