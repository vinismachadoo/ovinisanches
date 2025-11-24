import { format, parseISO } from 'date-fns';

export const minutesToHour = (minutes: number | null) => {
  if (!minutes) return '00:00:00';
  const hours = Math.floor(minutes / 60)
    .toString()
    .padStart(2, '0');
  const minutesLeftString = (minutes % 60).toFixed(0).toString().padStart(2, '0');
  return `${hours}:${minutesLeftString}:00`;
};

export const formatTime = (date?: string | null | undefined, dateFormat?: string) => {
  try {
    if (!date) return date;
    const d = parseISO(date);
    return format(d, dateFormat || 'dd/MM/yy HH:mm');
  } catch {
    return date;
  }
};
