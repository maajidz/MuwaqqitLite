'use client';

import React, { useState, useEffect, useRef } from 'react';
import {  addDays } from 'date-fns';
import DateSlider from '@/components/DateSlider';
import PrayerCard from '@/components/PrayerCard';
import LocationPermissionDialog from '@/components/LocationPermissionDialog';
import CalendarDialog from '@/components/CalendarDialog';
import { PrayerTime, LocationData, PrayerTimesResponse } from '@/types';
import {
  fetchPrayerTimes,
  getCurrentLocation,
  getCurrentTimezone,
  isLocationServiceEnabled,
  cachePrayerTimes,
  getCachedPrayerTimes,
  shouldRefreshCache,
  fetchCityName,
} from '@/utils/api';
import {
  getPrayersForDay,
  getUpcomingPrayer,
  getTimeUntilNextPrayer,
  findPrayerTimeByDate,
} from '@/utils/prayerTimes';
import SkeletonLoader from '@/components/SkeletonLoader';

const prayerIcons = {
  Fajr: { icon: "🌅", label: "Fajr" },
  Sunrise: { icon: "☀️", label: "Sunrise" },
  Dhuhr: { icon: "🌞", label: "Dhuhr" },
  Asr: { icon: "🌤️", label: "Asr" },
  Maghrib: { icon: "🌆", label: "Maghrib" },
  Isha: { icon: "🌙", label: "Isha" },
};

const Home: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesResponse | null>(null);
  const [currentPrayerTime, setCurrentPrayerTime] = useState<PrayerTime | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [locationEnabled, setLocationEnabled] = useState<boolean | null>(null);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<string>('');
  const [cityName, setCityName] = useState<string>('');
  const [isPrayerTime, setIsPrayerTime] = useState<boolean>(false);
  const [showTomorrow, setShowTomorrow] = useState<boolean>(false);
  const prayerListRef = useRef<HTMLDivElement>(null);

  // Add a memoized value for date range
  const dateRange = React.useMemo(() => {
    if (!prayerTimes?.data || !Array.isArray(prayerTimes.data) || prayerTimes.data.length === 0) {
      return {
        minDate: undefined,
        maxDate: undefined
      };
    }

    return {
      minDate: new Date(prayerTimes.data[0].date),
      maxDate: new Date(prayerTimes.data[prayerTimes.data.length - 1].date)
    };
  }, [prayerTimes?.data]);

  // Check if location service is enabled
  useEffect(() => {
    const checkLocationService = async () => {
      try {
        const enabled = await isLocationServiceEnabled();
        setLocationEnabled(enabled);
      } catch (error) {
        console.error('Error checking location service:', error);
        setLocationEnabled(false);
      }
    };

    checkLocationService();
  }, []);

  // Load prayer times and city name
  useEffect(() => {
    const loadPrayerTimes = async () => {
      if (locationEnabled === null) return;
      
      if (!locationEnabled) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Try to get cached data first
        const cachedData = getCachedPrayerTimes();
        
        // Get current location
        let location: LocationData;
        try {
          location = await getCurrentLocation();
          // Fetch city name based on location using the new utility function
          const cityName = await fetchCityName(location.latitude, location.longitude);
          setCityName(cityName);
        } catch (locationError) {
          setLocationEnabled(false);
          throw locationError;
        }
        
        // Check if we need to refresh the cache
        const shouldRefresh = !cachedData || shouldRefreshCache(location);
        
        let prayerTimesData: PrayerTimesResponse;
        
        if (shouldRefresh) {
          // Fetch new data
          const timezone = getCurrentTimezone();
          prayerTimesData = await fetchPrayerTimes(
            location.latitude,
            location.longitude,
            selectedDate,
            timezone
          );
          
          // Cache the data
          cachePrayerTimes(prayerTimesData, location);
        } else {
          prayerTimesData = cachedData.data;
        }
        
        setPrayerTimes(prayerTimesData);
        
        // Set current prayer time based on selected date
        const prayerTime = findPrayerTimeByDate(prayerTimesData.data, selectedDate);
        setCurrentPrayerTime(prayerTime || null);
      } catch (error) {
        console.error('Error loading prayer times:', error);
        setError(error instanceof Error ? error.message : 'Failed to load prayer times. Please try again.');
        if (error instanceof Error && error.message.includes('location')) {
          setLocationEnabled(false);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    loadPrayerTimes();
  }, [locationEnabled, refreshing, selectedDate]);

  // Update current prayer time when selected date changes
  useEffect(() => {
    if (prayerTimes) {
      const prayerTime = findPrayerTimeByDate(prayerTimes.data, selectedDate);
      setCurrentPrayerTime(prayerTime || null);
      
      // Check if all prayers have passed only if prayerTime is defined
      if (prayerTime) {
        const prayers = getPrayersForDay(prayerTime);
        const now = new Date();
        const allPassed = prayers.every(prayer => {
          const [hours, minutes] = prayer.time.split(':').map(Number);
          const prayerDate = new Date();
          prayerDate.setHours(hours, minutes, 0, 0);
          return prayerDate < now; // Check if the prayer time has passed
        });

        setShowTomorrow(allPassed); // Set state to show tomorrow's prayers if all have passed
      } else {
        setShowTomorrow(false); // Handle case where prayerTime is undefined
      }
    }
  }, [selectedDate, prayerTimes]);

  // Update the countdown timer effect
  useEffect(() => {
    if (!currentPrayerTime) return;

    const prayers = getPrayersForDay(currentPrayerTime);
    const upcomingPrayer = getUpcomingPrayer(prayers);
    
    if (!upcomingPrayer) {
      setCountdown('');
      setIsPrayerTime(false);
      return;
    }

    const updateCountdown = () => {
      const timeUntil = getTimeUntilNextPrayer(upcomingPrayer);
      setCountdown(timeUntil);

      // Check if we're in the last minute
      const [hours, minutes] = upcomingPrayer.time.split(':').map(Number);
      const prayerTime = new Date();
      prayerTime.setHours(hours, minutes, 0, 0);
      const diffInMilliseconds = prayerTime.getTime() - new Date().getTime();
      const diffInSeconds = Math.floor(diffInMilliseconds / 1000);

      // Set prayer time flag if countdown reaches 0
      if (diffInSeconds <= 0) {
        setCountdown('');
        setIsPrayerTime(true);
        return true;
      }

      // Return true if we're in the last minute
      return diffInSeconds < 60;
    };

    // Initial update
    const isLastMinute = updateCountdown();

    // Set up the interval
    const intervalId = setInterval(
      updateCountdown,
      isLastMinute ? 1000 : 60000
    );

    return () => clearInterval(intervalId);
  }, [currentPrayerTime]);

  const handleRequestLocation = () => {
    getCurrentLocation()
      .then(() => {
        setLocationEnabled(true);
      })
      .catch((error) => {
        console.error('Error getting location:', error);
        setError('Failed to get location. Please enable location services and try again.');
      });
  };

  const handleRefresh = () => {
    setRefreshing(true);
  };

  const renderContent = () => {
    if (loading) {
      return <SkeletonLoader />;
    }

    if (error) {
      return (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          <p>{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (!locationEnabled) {
      return (
        <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg">
          <p>Location services are required to show accurate prayer times.</p>
          <button
            onClick={handleRequestLocation}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700"
          >
            Enable Location
          </button>
        </div>
      );
    }

    if (!currentPrayerTime) {
      return (
        <div className="p-4 bg-gray-50 text-gray-700 rounded-lg">
          <p>No prayer times available for the selected date.</p>
        </div>
      );
    }

    const prayers = getPrayersForDay(currentPrayerTime);
    const upcomingPrayer = getUpcomingPrayer(prayers);

    return (
      <div className={`space-y-3 ${showTomorrow ? 'overflow-y-auto max-h-96' : ''}`} ref={prayerListRef}>
        {showTomorrow && <h2 className="text-xl font-bold">Tomorrow</h2>}
        {showTomorrow ? (
          (() => {
            if (prayerTimes) {
              const tomorrowPrayerTime = findPrayerTimeByDate(prayerTimes.data, addDays(selectedDate, 1));
              if (tomorrowPrayerTime) {
                return getPrayersForDay(tomorrowPrayerTime).map((prayer) => (
                  <PrayerCard
                    key={prayer.name}
                    prayer={prayer}
                    isUpcoming={false}
                    timeUntil={undefined}
                    icon={prayerIcons[prayer.name]?.icon}
                    isPrayerTime={false}
                  />
                ));
              }
            }
            return null; // Return null if prayerTimes is null or tomorrowPrayerTime is undefined
          })()
        ) : (
          prayers.map((prayer) => {
            const isUpcoming = upcomingPrayer?.name === prayer.name;
            return (
              <PrayerCard
                key={prayer.name}
                prayer={prayer}
                isUpcoming={isUpcoming}
                timeUntil={isUpcoming ? countdown : undefined}
                icon={prayerIcons[prayer.name]?.icon}
                isPrayerTime={isUpcoming && isPrayerTime}
              />
            );
          })
        )}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex flex-row justify-between items-start mb-6">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-300 bg-clip-text text-transparent">
              Muwaqqit Lite
            </h1>
            <span className="text-xs font-medium text-gray-500 mt-2">{cityName || 'Loading...'}</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleRefresh}
              disabled={loading || refreshing}
              className="p-2 rounded-xl hover:bg-white/50 disabled:opacity-50 transition-colors"
              aria-label="Refresh"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className="text-gray-600" fill="currentColor">
                <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h60v250H530v-60h168q-32-56-87.5-89T480-732q-109 0-184.5 75.5T220-480q0 109 75.5 184.5T480-220q109 0 184.5-75.5T740-480h60q0 134-93 227t-227 93Z"/>
              </svg>
            </button>
            <button
              onClick={() => setShowCalendar(true)}
              className="p-2 rounded-xl hover:bg-white/50 transition-colors"
              aria-label="Open Calendar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className="text-gray-600" fill="currentColor">
                <path d="M180-80q-24 0-42-18t-18-42v-620q0-24 18-42t42-18h65v-60h65v60h340v-60h65v60h65q24 0 42 18t18 42v620q0 24-18 42t-42 18H180Zm0-60h600v-430H180v430Zm0-490h600v-130H180v130Zm0 0v-130 130Zm300 230q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/>
              </svg>
            </button>
          </div>
        </div>

        <DateSlider
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          minDate={dateRange.minDate}
          maxDate={dateRange.maxDate}
        />

        <div className="space-y-3">
          {renderContent()}
        </div>
      </div>

      {locationEnabled === false && (
        <LocationPermissionDialog
          onRequestPermission={handleRequestLocation}
          onCancel={() => setLocationEnabled(false)}
        />
      )}

      {showCalendar && (
        <CalendarDialog
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onClose={() => setShowCalendar(false)}
          minDate={dateRange.minDate}
          maxDate={dateRange.maxDate}
        />
      )}
    </main>
  );
};

export default Home;
