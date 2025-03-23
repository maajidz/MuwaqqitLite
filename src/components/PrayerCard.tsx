import React, { useEffect, useState } from 'react';
import { Prayer } from '@/types';
import { formatPrayerTime, getTimeUntilNextPrayer } from '@/utils/prayerTimes';
// import { useRive } from '@rive-app/react-canvas';
import './PrayerCard.css';

interface PrayerCardProps {
  prayer: Prayer;
  isUpcoming: boolean;
  icon: string;
  isPrayerTime: boolean;
}

// Utility function to format seconds into a readable string
const formatTimeUntil = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes > 0 ? `${minutes} minute${minutes > 1 ? 's' : ''}` : ''} ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`.trim();
};

const PrayerCard: React.FC<PrayerCardProps> = ({ prayer, isUpcoming, icon, isPrayerTime }) => {
  const [timeUntil, setTimeUntil] = useState<string>('0s');

  useEffect(() => {
    if (isUpcoming) {
      const interval = setInterval(() => {
        const updatedTimeUntil = getTimeUntilNextPrayer(prayer);
        setTimeUntil(updatedTimeUntil);
      }, 1000);

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [isUpcoming, prayer]);

  // const getBackgroundAnimation = () => {
  //   if (isUpcoming && prayer.name === 'Fajr') {
  //     return '/isha.riv';
  //   } else if (isUpcoming && prayer.name === 'Sunrise') {
  //     return '/isha.riv';
  //   }
  //   return null;
  // };

  // const backgroundAnimation = getBackgroundAnimation();

  // const { rive, RiveComponent } = useRive({
  //   src: backgroundAnimation || undefined,
  //   stateMachines: 'default',
  //   autoplay: false,
  // });

  // useEffect(() => {
  //   if (rive) {
  //     rive.play();
  //   }
  // }, [rive]);

  return (
    <div
      className={`relative rounded-xl p-4 mb-3 ${
        isUpcoming 
          ? 
          'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
          : 'bg-white hover:bg-gray-50 transition-colors'
      }`}
    >
      {/* {backgroundAnimation && (
        <div className="absolute inset-0 w-full h-full opacity-100 overflow-hidden rounded-xl">
          <RiveComponent className="w-full h-full" />
        </div>
      )} */}
      <div className="flex justify-between items-center relative z-10">
        <div>
          <h3 className={`text-lg font-semibold ${isUpcoming ? 'text-white' : 'text-gray-900'}`}>
            {icon} {prayer.name}
          </h3>
          {isPrayerTime ? (
            <p className="text-white font-bold">Prayer Time!</p>
          ) : (
            <p className={`text-sm mt-1 ${isUpcoming ? 'text-blue-100' : 'text-gray-500'}`}>
              {formatPrayerTime(prayer.time)}
            </p>
          )}
        </div>
        {/* {isUpcoming && timeUntil !== undefined && ( */}
        {isUpcoming && (
          <div className="flex flex-col items-end">
            <span className="bg-white text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-1 shadow-sm">
              Upcoming
            </span>
            <span className="text-sm font-medium text-blue-100">{timeUntil}</span>
          </div>
        )}
        {isUpcoming && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-blue-500/10 rounded-xl pointer-events-none" />
        )}
      </div>
    </div>
  );
};

export default PrayerCard;