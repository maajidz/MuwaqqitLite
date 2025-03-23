import { format } from 'date-fns';
import { getDistance } from 'geolib';
import { LocationData, PrayerTimesCache, PrayerTimesResponse } from '@/types';

const CACHE_KEY = 'prayer-times-cache';
const MAX_DISTANCE_METERS = 25000; // 1 kilometer

interface PrayerTimeItem {
  d: string; // Date
  fajr_time?: string;
  fajr_time_min?: string;
  sunrise_time?: string;
  duha_time?: string;
  duha_time_min?: string;
  zohr_time?: string;
  mithl_time?: string;
  sunset_time?: string;
  esha_time?: string;
  esha_time_min?: string;
}

export async function fetchPrayerTimes(
  latitude: number,
  longitude: number,
  date: Date,
  timezone: string
): Promise<PrayerTimesResponse> {
  const formattedDate = format(date, 'yyyy-MM-dd');
  const encodedTimezone = encodeURIComponent(timezone);
  
  const url = `/api/prayer-times?lt=${latitude}&ln=${longitude}&d=${formattedDate}&tz=${encodedTimezone}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const responseData = await response.json();
    
    // Check if data exists and has the list property
    if (!responseData || !Array.isArray(responseData.list)) {
      console.error('Invalid API response structure:', responseData);
      throw new Error('Invalid response format: missing list property');
    }

    // Transform the response to match our expected format
    return {
      data: responseData.list.map((item: PrayerTimeItem) => ({
        date: item.d,
        fajr_time: item.fajr_time || item.fajr_time_min || '',
        sunrise_time: item.sunrise_time || '',
        zohr_time: item.zohr_time || '',
        mithl_time: item.mithl_time || '',
        sunset_time: item.sunset_time || '',
        esha_time: item.esha_time || item.esha_time_min || '',
      })),
      meta: {
        latitude: Number(responseData.list[0].lt) || latitude,
        longitude: Number(responseData.list[0].ln) || longitude,
        timezone: responseData.list[0].tz || timezone,
      },
    };
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    throw error;
  }
}

export function getCurrentTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export async function getCurrentLocation(): Promise<LocationData> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: Date.now(),
        });
      },
      (error) => {
        let errorMessage = 'Failed to get your location. ';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please enable location services in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'The request to get your location timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
}

export function isLocationServiceEnabled(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(false);
      return;
    }

    navigator.permissions
      .query({ name: 'geolocation' })
      .then((permissionStatus) => {
        resolve(permissionStatus.state === 'granted' || permissionStatus.state === 'prompt');
      })
      .catch(() => {
        // If we can't determine permission status, we'll try to get the position
        const timeoutId = setTimeout(() => resolve(false), 3000);
        
        navigator.geolocation.getCurrentPosition(
          () => {
            clearTimeout(timeoutId);
            resolve(true);
          },
          () => {
            clearTimeout(timeoutId);
            resolve(false);
          }
        );
      });
  });
}

export function getCachedPrayerTimes(): PrayerTimesCache | null {
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    return cachedData ? JSON.parse(cachedData) : null;
  } catch (error) {
    console.error('Error retrieving cached prayer times:', error);
    return null;
  }
}

export function cachePrayerTimes(data: PrayerTimesResponse, location: LocationData): void {
  try {
    const cacheData: PrayerTimesCache = {
      data,
      location,
      lastFetched: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error caching prayer times:', error);
  }
}

export function shouldRefreshCache(currentLocation: LocationData): boolean {
  const cachedData = getCachedPrayerTimes();
  
  if (!cachedData) return true;
  
  // Check if the location has changed significantly
  const distance = getDistance(
    { latitude: currentLocation.latitude, longitude: currentLocation.longitude },
    { latitude: cachedData.location.latitude, longitude: cachedData.location.longitude }
  );
  
  return distance > MAX_DISTANCE_METERS;
}

export const fetchCityName = async (latitude: number, longitude: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'Muwaqqit Prayer App'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch city name');
    }

    const data = await response.json();

    // Prioritize display_name first
    if (data.display_name) {
      return data.display_name;
    }

    // Prepare components for concatenation
    const components = [
      data.address?.suburb,
      data.address?.county,
      data.address?.state_district,
      data.address?.state,
    ].filter(Boolean); // Remove any undefined or null values

    // Concatenate components
    if (components.length > 0) {
      return components.join(', ');
    }

    return 'Location not found'; // Fallback if no components are available
  } catch (error) {
    console.error('Error fetching city name:', error);
    return 'Location not found';
  }
};