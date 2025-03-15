import { format } from 'date-fns';
import { Prayer, PrayerTime } from '@/types';

export function formatPrayerTime(time: string | undefined): string {
  if (!time) return '';
  
  try {
    // Check if the time is already in HH:mm format
    if (/^\d{2}:\d{2}$/.test(time)) {
      return time;
    }

    // If time is in HH:mm:ss format, remove seconds
    if (/^\d{2}:\d{2}:\d{2}$/.test(time)) {
      return time.substring(0, 5);
    }

    // If we can't parse the time, return empty string
    return '';
  } catch (error) {
    console.error('Error formatting prayer time:', error);
    return '';
  }
}

export function getPrayersForDay(prayerTime: PrayerTime): Prayer[] {
  return [
    { name: 'Fajr', time: prayerTime.fajr_time, apiKey: 'fajr_time' },
    { name: 'Sunrise', time: prayerTime.sunrise_time, apiKey: 'sunrise_time' },
    { name: 'Dhuhr', time: prayerTime.zohr_time, apiKey: 'zohr_time' },
    { name: 'Asr', time: prayerTime.mithl_time, apiKey: 'mithl_time' },
    { name: 'Maghrib', time: prayerTime.sunset_time, apiKey: 'sunset_time' },
    { name: 'Isha', time: prayerTime.esha_time, apiKey: 'esha_time' },
  ];
}

export function getUpcomingPrayer(prayers: Prayer[]): Prayer | null {
  const now = new Date();
  const currentTime = format(now, 'HH:mm');
  
  // Find the first prayer that hasn't occurred yet today
  const upcomingPrayer = prayers.find(prayer => prayer.time > currentTime);
  
  // If all prayers for today have passed, return null
  return upcomingPrayer || null;
}

export function getTimeUntilNextPrayer(upcomingPrayer: Prayer): string {
  if (!upcomingPrayer?.time) return '';

  const now = new Date();
  const [hours, minutes] = upcomingPrayer.time.split(':').map(Number);
  const prayerTime = new Date(now);
  prayerTime.setHours(hours, minutes, 0, 0);

  const diffInMilliseconds = prayerTime.getTime() - now.getTime();
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  
  // If less than 1 minute, show seconds countdown
  if (diffInMinutes < 1) {
    const diffInSeconds = Math.max(0, Math.floor(diffInMilliseconds / 1000));
    return `${diffInSeconds}s`;
  }

  // For times greater than an hour
  if (diffInMinutes >= 60) {
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    return `${hours}h ${minutes}m`;
  }

  // For times less than an hour but more than a minute
  return `${diffInMinutes}m`;
}

export function findPrayerTimeByDate(prayerTimes: PrayerTime[] | undefined, date: Date): PrayerTime | undefined {
  if (!prayerTimes || !Array.isArray(prayerTimes)) {
    return undefined;
  }
  const dateString = format(date, 'yyyy-MM-dd');
  return prayerTimes.find(pt => pt.date === dateString);
} 