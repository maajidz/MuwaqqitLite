import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Value } from 'react-calendar/dist/esm/shared/types.js';

interface CalendarDialogProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onClose: () => void;
  minDate?: Date;
  maxDate?: Date;
}

const CalendarDialog: React.FC<CalendarDialogProps> = ({
  selectedDate,
  onDateChange,
  onClose,
  minDate,
  maxDate,
}) => {
  // Using any type here to avoid type issues with react-calendar
  const handleDateChange = (value: Value) => {
    if (value instanceof Date) {
      onDateChange(value);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Select Date</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="calendar-container">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            minDate={minDate}
            maxDate={maxDate}
            className="rounded-xl border-0 shadow-none w-full"
          />
        </div>
        <style jsx global>{`
          .react-calendar {
            border: none;
            width: 100%;
            font-family: inherit;
          }
          .react-calendar__tile {
            border-radius: 0.75rem;
            padding: 0.75rem;
            font-size: 0.875rem;
          }
          .react-calendar__tile--active {
            background: linear-gradient(to right, #2563eb, #3b82f6) !important;
            color: white;
            box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
          }
          .react-calendar__tile--active:enabled:hover,
          .react-calendar__tile--active:enabled:focus {
            background: linear-gradient(to right, #1d4ed8, #2563eb) !important;
          }
          .react-calendar__tile--now {
            background: #f3f4f6;
          }
          .react-calendar__tile:enabled:hover,
          .react-calendar__tile:enabled:focus {
            background-color: #f3f4f6;
          }
          .react-calendar__navigation {
            margin-bottom: 1rem;
          }
          .react-calendar__navigation button {
            border-radius: 0.75rem;
            min-width: 44px;
            background: none;
          }
          .react-calendar__navigation button:enabled:hover,
          .react-calendar__navigation button:enabled:focus {
            background-color: #f3f4f6;
          }
          .react-calendar__month-view__weekdays {
            font-size: 0.875rem;
            font-weight: 500;
            color: #6b7280;
          }
        `}</style>
      </div>
    </div>
  );
};

export default CalendarDialog; 