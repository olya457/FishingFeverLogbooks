export const formatDate = (iso: string): string => {
  const date = new Date(iso);
  return date.toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const getTodayIso = (): string => new Date().toISOString();