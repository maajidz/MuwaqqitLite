import React, { useEffect, useRef, useMemo } from 'react';
import { format, addDays, subDays, isSameDay, startOfDay } from 'date-fns';

interface DateSliderProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

const DateSlider: React.FC<DateSliderProps> = ({
  selectedDate,
  onDateChange,
  minDate = subDays(startOfDay(new Date()), 7),
  maxDate = addDays(startOfDay(new Date()), 30),
}) => {
  // Memoize the dates array to ensure consistency between server and client
  const dates = useMemo(() => {
    const datesArray: Date[] = [];
    let currentDate = startOfDay(minDate);
    const endDate = startOfDay(maxDate);
    
    while (currentDate <= endDate) {
      datesArray.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }
    
    return datesArray;
  }, [minDate, maxDate]);

  const sliderRef = useRef<HTMLDivElement>(null);

  // Use useEffect for client-side scrolling
  useEffect(() => {
    if (sliderRef.current) {
      const selectedButton = sliderRef.current.querySelector(
        `button[data-date="${startOfDay(selectedDate).toISOString()}"]`
      );
      if (selectedButton) {
        selectedButton.scrollIntoView({ behavior: 'smooth', inline: 'center' });
      }
    }
  }, [selectedDate]);

  const handlePrevDate = () => {
    const newDate = subDays(selectedDate, 1);
    if (newDate >= minDate) {
      onDateChange(newDate);
    }
  };

  const handleNextDate = () => {
    const newDate = addDays(selectedDate, 1);
    if (newDate <= maxDate) {
      onDateChange(newDate);
    }
  };

  return (
    <div className="w-full bg-white shadow-sm rounded-lg p-4 mb-4 text-gray-800">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium">
          {format(startOfDay(selectedDate), 'MMMM yyyy')}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevDate}
            disabled={isSameDay(selectedDate, minDate)}
            className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <span className="text-sm font-medium">
            {/* This can be removed if you don't want to show the date here */}
          </span>
          <button
            onClick={handleNextDate}
            disabled={isSameDay(selectedDate, maxDate)}
            className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto pb-2" ref={sliderRef}>
        <div className="flex space-x-2 px-2">
          {dates.map((date) => {
            const normalizedDate = startOfDay(date);
            return (
              <button
                key={normalizedDate.toISOString()}
                data-date={normalizedDate.toISOString()}
                onClick={() => onDateChange(date)}
                className={`flex-shrink-0 w-24 h-16 rounded-xl px-3 py-2 snap-center flex flex-col items-center justify-center gap-1 transition-all border focus:outline-none focus:ring-2 focus:ring-primary/20 bg-primary text-primary-foreground border-gray-200 ${
                  isSameDay(date, selectedDate)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${isSameDay(date, startOfDay(new Date())) ? 'font-bold' : ''}`}
              >
                {format(normalizedDate, 'dd')}
                <span className='text-xs'>{format(normalizedDate, 'EEE')}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DateSlider; 