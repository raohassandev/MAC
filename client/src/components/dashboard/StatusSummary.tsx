import React from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Server 
} from 'lucide-react';
import { Card } from '@/components/ui/Card';

export type StatusData = {
  total: number;
  online: number;
  offline: number;
  warning: number;
  lastUpdate?: Date;
};

interface StatusSummaryProps {
  data: StatusData;
  title?: string;
  showLastUpdate?: boolean;
  className?: string;
}

const StatusSummary: React.FC<StatusSummaryProps> = ({
  data,
  title = 'Device Status',
  showLastUpdate = true,
  className = '',
}) => {
  const formatTimeAgo = (date?: Date) => {
    if (!date) return 'Never';

    // Convert string date to Date object if needed
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <Card className={`h-full ${className}`}>
      <Card.Header className="pb-2">
        <div className="flex items-center">
          <Server size={18} className="mr-2 text-blue-500" />
          <Card.Title>{title}</Card.Title>
        </div>
        {showLastUpdate && data.lastUpdate && (
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <Clock size={12} className="mr-1" />
            Last updated {formatTimeAgo(data.lastUpdate)}
          </div>
        )}
      </Card.Header>
      <Card.Content>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600 mb-1">Total</span>
            <span className="text-2xl font-semibold">{data.total}</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center mb-1">
              <CheckCircle size={12} className="text-green-500 mr-1" />
              <span className="text-sm text-gray-600">Online</span>
            </div>
            <span className="text-2xl font-semibold text-green-600">{data.online}</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-3 bg-red-50 rounded-lg">
            <div className="flex items-center mb-1">
              <AlertCircle size={12} className="text-red-500 mr-1" />
              <span className="text-sm text-gray-600">Offline</span>
            </div>
            <span className="text-2xl font-semibold text-red-600">{data.offline}</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center mb-1">
              <AlertCircle size={12} className="text-yellow-500 mr-1" />
              <span className="text-sm text-gray-600">Warning</span>
            </div>
            <span className="text-2xl font-semibold text-yellow-600">{data.warning}</span>
          </div>
        </div>
        
        {data.total > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex h-2 overflow-hidden bg-gray-200 rounded">
              <div 
                className="bg-green-500" 
                style={{ width: `${(data.online / data.total) * 100}%` }}
              />
              <div 
                className="bg-yellow-500" 
                style={{ width: `${(data.warning / data.total) * 100}%` }}
              />
              <div 
                className="bg-red-500" 
                style={{ width: `${(data.offline / data.total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default StatusSummary;