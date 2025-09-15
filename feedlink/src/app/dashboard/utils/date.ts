export function isExpired(dateStr: string): boolean {
  const now = new Date();
  const date = new Date(dateStr);
  return date < now;
}

export function isExpiringSoon(dateStr: string, days = 3): boolean {
  const now = new Date();
  const date = new Date(dateStr);
  const diffDays = (date.getTime() - now.getTime()) / (1000 * 3600 * 24);
  return diffDays >= 0 && diffDays <= days;
}