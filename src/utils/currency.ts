import { Currency } from '../contexts/TransactionContext';

export const formatCurrency = (amount: number, currency: Currency): string => {
  if (currency === 'VND') {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  } else {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }
};

export const formatNumber = (value: string): string => {
  const number = value.replace(/[^\d]/g, '');
  if (!number) return '';
  return new Intl.NumberFormat('en-US').format(Number(number));
};

export const parseFormattedNumber = (value: string): number => {
  return Number(value.replace(/[^\d]/g, ''));
};

export const getCurrencySymbol = (currency: Currency): string => {
  return currency === 'VND' ? '₫' : '$';
};

export const getExchangeRate = (): number => {
  return 24000;
};

export const convertCurrency = (amount: number, from: Currency, to: Currency): number => {
  if (from === to) return amount;

  const rate = getExchangeRate();
  if (from === 'USD' && to === 'VND') {
    return amount * rate;
  } else if (from === 'VND' && to === 'USD') {
    return amount / rate;
  }

  return amount;
};
