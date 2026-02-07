import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const currencyLocales: Record<string, string> = {
  MXN: 'es-MX',
  USD: 'en-US',
  EUR: 'es-ES',
  ARS: 'es-AR',
  COP: 'es-CO',
  CLP: 'es-CL',
  PEN: 'es-PE'
}

export function formatPrice(price: number, currency: string = 'MXN'): string {
  const locale = currencyLocales[currency] || 'es-MX'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(price)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'long',
    timeStyle: 'short'
  }).format(new Date(date))
}
