/**
 * Thai Buddhist Calendar Utilities
 * Supports BE 2560-2600 (CE 2017-2057)
 * Reusable for analytics, export, and reporting modules
 */

// Constants
const BUDDHIST_ERA_OFFSET = 543;
const MIN_BUDDHIST_YEAR = 2560;
const MAX_BUDDHIST_YEAR = 2600;

// Thai month names (short)
const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

// Thai month names (full)
const THAI_MONTHS_FULL = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

// Thai day names
const THAI_DAYS = [
  'อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'
];

/**
 * Convert Gregorian year to Buddhist Era
 * @param gregorianYear - CE year (e.g., 2024)
 * @returns BE year (e.g., 2567)
 */
export function toBuddhistYear(gregorianYear: number): number {
  return gregorianYear + BUDDHIST_ERA_OFFSET;
}

/**
 * Convert Buddhist Era to Gregorian year
 * @param buddhistYear - BE year (e.g., 2567)
 * @returns CE year (e.g., 2024)
 */
export function toGregorianYear(buddhistYear: number): number {
  return buddhistYear - BUDDHIST_ERA_OFFSET;
}

/**
 * Validate Buddhist year is within supported range
 * @param buddhistYear - BE year to validate
 * @returns true if valid
 */
export function isValidBuddhistYear(buddhistYear: number): boolean {
  return buddhistYear >= MIN_BUDDHIST_YEAR && buddhistYear <= MAX_BUDDHIST_YEAR;
}

/**
 * Format date in Thai Buddhist format (short)
 * @param date - Date object
 * @returns Formatted string (e.g., "25 พ.ย. 2567")
 */
export function formatThaiDateShort(date: Date): string {
  const day = date.getDate();
  const month = THAI_MONTHS_SHORT[date.getMonth()];
  const year = toBuddhistYear(date.getFullYear());
  
  return `${day} ${month} ${year}`;
}

/**
 * Format date in Thai Buddhist format (full)
 * @param date - Date object
 * @returns Formatted string (e.g., "25 พฤศจิกายน 2567")
 */
export function formatThaiDateFull(date: Date): string {
  const day = date.getDate();
  const month = THAI_MONTHS_FULL[date.getMonth()];
  const year = toBuddhistYear(date.getFullYear());
  
  return `${day} ${month} ${year}`;
}

/**
 * Format date with day name
 * @param date - Date object
 * @returns Formatted string (e.g., "วันจันทร์ที่ 25 พฤศจิกายน 2567")
 */
export function formatThaiDateWithDay(date: Date): string {
  const dayName = THAI_DAYS[date.getDay()];
  const day = date.getDate();
  const month = THAI_MONTHS_FULL[date.getMonth()];
  const year = toBuddhistYear(date.getFullYear());
  
  return `วัน${dayName}ที่ ${day} ${month} ${year}`;
}

/**
 * Format date and time in Thai format
 * @param date - Date object
 * @returns Formatted string (e.g., "25 พ.ย. 2567 14:30")
 */
export function formatThaiDateTime(date: Date): string {
  const dateStr = formatThaiDateShort(date);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${dateStr} ${hours}:${minutes}`;
}

/**
 * Get Thai month name (short)
 * @param monthIndex - Month index (0-11)
 * @returns Thai month name
 */
export function getThaiMonthShort(monthIndex: number): string {
  return THAI_MONTHS_SHORT[monthIndex] || '';
}

/**
 * Get Thai month name (full)
 * @param monthIndex - Month index (0-11)
 * @returns Thai month name
 */
export function getThaiMonthFull(monthIndex: number): string {
  return THAI_MONTHS_FULL[monthIndex] || '';
}

/**
 * Get Thai day name
 * @param dayIndex - Day index (0-6, Sunday=0)
 * @returns Thai day name
 */
export function getThaiDay(dayIndex: number): string {
  return THAI_DAYS[dayIndex] || '';
}

/**
 * Date range interface
 */
export interface DateRange {
  start: Date;
  end: Date;
  label: string;
}

/**
 * Get predefined quick date ranges
 * @returns Object with quick range options
 */
export function getQuickDateRanges(): Record<string, DateRange> {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return {
    today: {
      start: today,
      end: new Date(today.getTime() + 86400000 - 1), // End of day
      label: 'วันนี้'
    },
    yesterday: {
      start: new Date(today.getTime() - 86400000),
      end: new Date(today.getTime() - 1),
      label: 'เมื่อวาน'
    },
    last7Days: {
      start: new Date(today.getTime() - 6 * 86400000),
      end: new Date(today.getTime() + 86400000 - 1),
      label: '7 วันที่ผ่านมา'
    },
    last30Days: {
      start: new Date(today.getTime() - 29 * 86400000),
      end: new Date(today.getTime() + 86400000 - 1),
      label: '30 วันที่ผ่านมา'
    },
    thisWeek: {
      start: new Date(today.getTime() - today.getDay() * 86400000),
      end: new Date(today.getTime() + (6 - today.getDay()) * 86400000 + 86400000 - 1),
      label: 'สัปดาห์นี้'
    },
    lastWeek: {
      start: new Date(today.getTime() - (today.getDay() + 7) * 86400000),
      end: new Date(today.getTime() - (today.getDay() + 1) * 86400000 - 1),
      label: 'สัปดาห์ที่แล้ว'
    },
    thisMonth: {
      start: new Date(now.getFullYear(), now.getMonth(), 1),
      end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
      label: 'เดือนนี้'
    },
    lastMonth: {
      start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
      end: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999),
      label: 'เดือนที่แล้ว'
    },
    thisQuarter: {
      start: new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1),
      end: new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 + 3, 0, 23, 59, 59, 999),
      label: 'ไตรมาสนี้'
    },
    lastQuarter: {
      start: new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 - 3, 1),
      end: new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 0, 23, 59, 59, 999),
      label: 'ไตรมาสที่แล้ว'
    },
    thisYear: {
      start: new Date(now.getFullYear(), 0, 1),
      end: new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999),
      label: 'ปีนี้'
    },
    lastYear: {
      start: new Date(now.getFullYear() - 1, 0, 1),
      end: new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999),
      label: 'ปีที่แล้ว'
    }
  };
}

/**
 * Get date range label in Thai
 * @param start - Start date
 * @param end - End date
 * @returns Formatted range string
 */
export function getDateRangeLabel(start: Date, end: Date): string {
  const startStr = formatThaiDateShort(start);
  const endStr = formatThaiDateShort(end);
  
  // Same day
  if (start.toDateString() === end.toDateString()) {
    return startStr;
  }
  
  // Same month and year
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()}-${end.getDate()} ${getThaiMonthShort(start.getMonth())} ${toBuddhistYear(start.getFullYear())}`;
  }
  
  // Different months or years
  return `${startStr} - ${endStr}`;
}

/**
 * Calculate days between two dates
 * @param start - Start date
 * @param end - End date
 * @returns Number of days
 */
export function getDaysBetween(start: Date, end: Date): number {
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if date is today
 * @param date - Date to check
 * @returns true if today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

/**
 * Check if date is in the past
 * @param date - Date to check
 * @returns true if past
 */
export function isPast(date: Date): boolean {
  return date < new Date();
}

/**
 * Check if date is in the future
 * @param date - Date to check
 * @returns true if future
 */
export function isFuture(date: Date): boolean {
  return date > new Date();
}

/**
 * Export all utilities as default object
 */
export const thaiCalendar = {
  toBuddhistYear,
  toGregorianYear,
  isValidBuddhistYear,
  formatThaiDateShort,
  formatThaiDateFull,
  formatThaiDateWithDay,
  formatThaiDateTime,
  getThaiMonthShort,
  getThaiMonthFull,
  getThaiDay,
  getQuickDateRanges,
  getDateRangeLabel,
  getDaysBetween,
  isToday,
  isPast,
  isFuture,
  BUDDHIST_ERA_OFFSET,
  MIN_BUDDHIST_YEAR,
  MAX_BUDDHIST_YEAR,
  THAI_MONTHS_SHORT,
  THAI_MONTHS_FULL,
  THAI_DAYS,
};

export default thaiCalendar;
