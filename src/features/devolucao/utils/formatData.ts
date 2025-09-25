export const formatDate = (iso?: string) => {
  if (!iso) return '-';
  const date = new Date(iso);
  if (isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(date);
};