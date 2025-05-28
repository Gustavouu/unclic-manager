
export const formatCurrency = (value: number, options?: { notation?: 'compact' | 'standard' }): string => {
  const baseOptions = {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  };

  if (options?.notation === 'compact') {
    return new Intl.NumberFormat('pt-BR', {
      ...baseOptions,
      notation: 'compact',
      compactDisplay: 'short'
    }).format(value);
  }

  return new Intl.NumberFormat('pt-BR', baseOptions).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
};
