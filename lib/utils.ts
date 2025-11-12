export function formatCurrency(amount: number, currency: string = 'AED'): string {
  return `${currency} ${amount.toLocaleString()}`;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
