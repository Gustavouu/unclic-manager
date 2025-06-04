
import { Product } from './types';

export const useInventoryExport = () => {
  const exportToCSV = (products: Product[], filename = 'estoque.csv') => {
    const headers = [
      'Nome',
      'Categoria',
      'Preço',
      'Quantidade',
      'Estoque Mínimo',
      'Fornecedor',
      'Descrição',
      'Status'
    ];

    const csvData = products.map(product => [
      product.name,
      product.category,
      `R$ ${product.price.toFixed(2)}`,
      product.quantity.toString(),
      product.minQuantity.toString(),
      product.supplier || '',
      product.description || '',
      product.quantity === 0 ? 'Sem Estoque' : 
        product.quantity <= product.minQuantity ? 'Estoque Baixo' : 'Normal'
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = (products: Product[], filename = 'estoque.json') => {
    const dataStr = JSON.stringify(products, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    exportToCSV,
    exportToJSON,
  };
};
