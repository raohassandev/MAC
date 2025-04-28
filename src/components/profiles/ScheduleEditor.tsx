import { AlertCircle, Plus, Trash } from 'lucide-react';
import React, { useState } from 'react';

type Day = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

interface ScheduleTime {
  id: string;
  days: Day[];
  startTime: string;
  endTime: string;
}

interface Schedule {
  active: boolean;
  times: ScheduleTime[];
}

interface ScheduleEditorProps {
  schedule: Schedule;
  onChange: (schedule: Schedule) => void;
  error?: string;
}

const ScheduleEditor: React.FC<ScheduleEditorProps> = ({
  schedule,
  onChange,
  error,
}) => {
  const [selectedDays, setSelectedDays] = useState<Record<Day, boolean>>({
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
    sat: false,
    sun: false,
  });
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('17:00');

  const days: { value: Day; label: string }[] = [
    { value: 'mon', label: 'Monday' },
    { value: 'tue', label: 'Tuesday' },
    { value: 'wed', label: 'Wednesday' },
    { value: 'thu', label: 'Thursday' },
    { value: 'fri', label: 'Friday' },
    { value: 'sat', label: 'Saturday' },
    { value: 'sun', label: 'Sunday' },
  ];

  const resetForm = () => {
    setSelectedDays({
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false,
    });
    setStartTime('08:00');
    setEndTime('17:00');
  };

  const handleDayToggle = (day: Day) => {
    setSelectedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const handleAddTime = () => {
    const selectedDaysList = Object.entries(selectedDays)
      .filter(([_, isSelected]) => isSelected)
      .map(([day]) => day as Day);

    if (selectedDaysList.length === 0) {
      alert('Please select at least one day.');
      return;
    }

    if (startTime >= endTime) {
      alert('End time must be after start time.');
      return;
    }

    const newTime: ScheduleTime = {
      id: Date.now().toString(),
      days: selectedDaysList,
      startTime,
      endTime,
    };

    onChange({
      ...schedule,
      times: [...schedule.times, newTime],
    });

    // Reset form after adding
    resetForm();
  };

  const handleRemoveTime = (id: string) => {
    onChange({
      ...schedule,
      times: schedule.times.filter((time) => time.id !== id),
    });
  };

  const formatDaysList = (days: Day[]) => {
    if (days.length === 7) return 'Every day';
    if (
      days.length === 5 &&
      days.includes('mon') &&
      days.includes('tue') &&
      days.includes('wed') &&
      days.includes('thu') &&
      days.includes('fri')
    ) {
      return 'Weekdays';
    }
    if (days.length === 2 && days.includes('sat') && days.includes('sun')) {
      return 'Weekend';
    }

    return days
      .map((day) => day.charAt(0).toUpperCase() + day.slice(1))
      .join(', ');
  };

  const formatTimeRange = (start: string, end: string) => {
    return `${start} - ${end}`;
  };

  return (
    <div className='space-y-4'>
      {/* Error display */}
      {error && (
        <div className='flex items-center text-red-600 mb-2'>
          <AlertCircle size={16} className='mr-1' />
          <span className='text-sm'>{error}</span>
        </div>
      )}

      {/* Days selection */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Select Days
        </label>
        <div className='flex flex-wrap gap-2'>
          {days.map((day) => (
            <button
              key={day.value}
              type='button'
              onClick={() => handleDayToggle(day.value)}
              className={`px-3 py-1.5 text-sm rounded-md ${
                selectedDays[day.value]
                  ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                  : 'bg-gray-50 text-gray-700 border-gray-200'
              } border`}
            >
              {day.value.charAt(0).toUpperCase() + day.value.slice(1)}
            </button>
          ))}
        </div>
        <div className='mt-2 flex space-x-2'>
          <button
            type='button'
            onClick={() => {
              // Select all days
              const allSelected = Object.fromEntries(
                days.map((day) => [day.value, true])
              ) as Record<Day, boolean>;
              setSelectedDays(allSelected);
            }}
            className='text-xs text-indigo-600 hover:text-indigo-800'
          >
            Select All
          </button>
          <button
            type='button'
            onClick={() => {
              // Select weekdays
              const weekdays = Object.fromEntries(
                days.map((day) => [
                  day.value,
                  ['mon', 'tue', 'wed', 'thu', 'fri'].includes(day.value),
                ])
              ) as Record<Day, boolean>;
              setSelectedDays(weekdays);
            }}
            className='text-xs text-indigo-600 hover:text-indigo-800'
          >
            Weekdays
          </button>
          <button
            type='button'
            onClick={() => {
              // Select weekend
              const weekend = Object.fromEntries(
                days.map((day) => [
                  day.value,
                  ['sat', 'sun'].includes(day.value),
                ])
              ) as Record<Day, boolean>;
              setSelectedDays(weekend);
            }}
            className='text-xs text-indigo-600 hover:text-indigo-800'
          >
            Weekend
          </button>
          <button
            type='button'
            onClick={resetForm}
            className='text-xs text-gray-600 hover:text-gray-800'
          >
            Clear
          </button>
        </div>
      </div>

      {/* Time selection */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Start Time
          </label>
          <input
            type='time'
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full'
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            End Time
          </label>
          <input
            type='time'
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full'
          />
        </div>
      </div>

      {/* Add button */}
      <div className='flex justify-end'>
        <button
          type='button'
          onClick={handleAddTime}
          className='flex items-center gap-1 bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600'
        >
          <Plus size={16} />
          Add Time Slot
        </button>
      </div>

      {/* Scheduled times list */}
      <div className='mt-4'>
        <h3 className='text-sm font-medium text-gray-700 mb-2'>
          Scheduled Time Slots
        </h3>

        {schedule.times.length === 0 ? (
          <div className='bg-gray-50 p-4 rounded-lg text-center text-gray-500'>
            <p>No time slots added yet.</p>
          </div>
        ) : (
          <div className='border border-gray-200 rounded-md overflow-hidden'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Days
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Time
                  </th>
                  <th className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {schedule.times.map((time) => (
                  <tr key={time.id}>
                    <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
                      {formatDaysList(time.days)}
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
                      {formatTimeRange(time.startTime, time.endTime)}
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap text-right text-sm font-medium'>
                      <button
                        type='button'
                        onClick={() => handleRemoveTime(time.id)}
                        className='text-red-500 hover:text-red-700'
                      >
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleEditor;
