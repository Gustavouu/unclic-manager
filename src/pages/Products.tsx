
import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';

const Products = () => {
  return (
    <PageContainer title="Produtos" description="Gerencie o estoque e catálogo de produtos">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <p className="text-muted-foreground">
          Gerencie seus produtos, preços e estoque nesta página.
        </p>
        
        {/* Placeholder for product management interface */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-center text-muted-foreground">
            Módulo de produtos em desenvolvimento.
          </p>
        </div>
      </div>
    </PageContainer>
  );
};

export default Products;
