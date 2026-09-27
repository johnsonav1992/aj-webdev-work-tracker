const paymentMethodLabels: Record<string, string> = {
  bank_transfer: 'Bank transfer',
  card: 'Card',
  check: 'Check',
  cash: 'Cash',
  other: 'Other'
};

export const formatPaymentMethodLabel = (method: string) => paymentMethodLabels[method] ?? method;
