
export const formatCurrency = (value?: number) => {
  if (value === undefined) return "—";
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export const getFormattedDate = (dateString?: string) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR').format(date);
};
