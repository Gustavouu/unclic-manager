
/**
 * Função para formatar valores monetários no formato brasileiro (R$)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * Função para formatar percentuais com o símbolo %
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

/**
 * Função para formatar números com separadores de milhares
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value);
};
