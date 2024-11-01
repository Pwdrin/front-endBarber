import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function createDateWithBrazilianTimezone(dateString: string): Date {
  // Split the date string into components and create a date at noon UTC
  // This ensures the date won't change due to timezone conversions
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

export function formatDateToBrazilian(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'dd/MM/yyyy', { locale: ptBR });
}

export function formatDateToISO(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

export function parseAndAdjustDate(dateString: string): Date {
  // Parse the date and set it to noon UTC to avoid timezone issues
  const date = new Date(dateString);
  return new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    12, 0, 0
  ));
}