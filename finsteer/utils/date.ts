import { format, isValid, parseISO } from 'date-fns';

export function formatDate(date: string | Date, formatString = 'yyyy-MM-dd'): string {
  if (!isValid(date)) {
    throw new Error('Invalid date');
  }

  return format(typeof date === 'string' ? parseISO(date) : date, formatString);
}

export function formatDateTime(
  date: string | Date,
  formatString = "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
): string {
  if (!isValid(date)) {
    throw new Error('Invalid date');
  }

  return format(typeof date === 'string' ? parseISO(date) : date, formatString);
}

export function formatRelativeDate(date: string | Date): string {
  if (!isValid(date)) {
    throw new Error('Invalid date');
  }

  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  const now = new Date();
  const diffSeconds = Math.floor((now.getTime() - parsedDate.getTime()) / 1000);

  if (diffSeconds < 60) {
    return 'just now';
  } else if (diffSeconds < 3600) {
    return `${Math.floor(diffSeconds / 60)} minutes ago`;
  } else if (diffSeconds < 86400) {
    return `${Math.floor(diffSeconds / 3600)} hours ago`;
  } else {
    return formatDate(parsedDate, 'yyyy-MM-dd');
  }
}

export function parseDate(dateString: string): Date {
  const parsed = parseISO(dateString);
  if (!isValid(parsed)) {
    throw new Error('Invalid date string');
  }
  return parsed;
}

export function isValidDate(date: string | Date): boolean {
  return isValid(typeof date === 'string' ? parseISO(date) : date);
}