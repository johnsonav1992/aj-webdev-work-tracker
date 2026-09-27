import { formatCurrency } from './format-currency.ts';

export const formatCurrencyTotals = (amounts: Map<string, number>, fallbackCurrency: string) =>
  amounts.size
    ? [...amounts]
        .map(([currency, amount]) => formatCurrency(Math.round(amount), currency))
        .join(' · ')
    : formatCurrency(0, fallbackCurrency);
