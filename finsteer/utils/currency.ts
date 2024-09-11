import { currencyFormatter, Currency } from '@core/formatter';

export const formatCurrency = (value: number, currency: Currency, locale: string = 'en-US') => {
  return currencyFormatter(value, currency, locale);
};

export const parseCurrency = (value: string, currency: Currency, locale: string = 'en-US') => {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'narrowSymbol',
  });

  const parsed = formatter.formatToParts(Number(value.replace(/[^0-9.-]+/g, '')));
  const fraction = parsed.find((part) => part.type === 'fraction')?.value || '';
  const integer = parsed.find((part) => part.type === 'integer')?.value || '';
  const formattedValue = `${integer}.${fraction}`;

  return Number(formattedValue);
};

export const getCurrencySymbol = (currency: Currency, locale: string = 'en-US') => {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'narrowSymbol',
  });

  const parts = formatter.formatToParts(0);
  const symbolPart = parts.find((part) => part.type === 'literal');

  return symbolPart ? symbolPart.value : '';
};

export const getAvailableCurrencies = () => {
  return [
    'USD',
    'EUR',
    'GBP',
    'JPY',
    'AUD',
    'CAD',
    'CHF',
    'CNY',
    'HKD',
    'NZD',
    'SEK',
    'KRW',
    'SGD',
    'NOK',
    'MXN',
    'INR',
    'RUB',
    'ZAR',
    'TRY',
    'BRL',
    'TWD',
    'DKK',
    'PLN',
    'THB',
    'IDR',
    'HUF',
    'CZK',
    'ILS',
    'CLP',
    'PHP',
    'AED',
    'COP',
    'SAR',
    'MYR',
    'RON',
  ] as Currency[];
};