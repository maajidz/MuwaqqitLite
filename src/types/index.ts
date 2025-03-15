export interface PrayerTime {
  date: string;
  fajr_time: string;
  sunrise_time: string;
  zohr_time: string;
  mithl_time: string;
  sunset_time: string;
  esha_time: string;
}

export interface PrayerTimesResponse {
  data: PrayerTime[];
  meta: {
    latitude: number;
    longitude: number;
    timezone: string;
  };
}

export interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface PrayerTimesCache {
  data: PrayerTimesResponse;
  location: LocationData;
  lastFetched: number;
}

export type PrayerName = 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

export interface Prayer {
  name: PrayerName;
  time: string;
  apiKey: keyof PrayerTime;
} 