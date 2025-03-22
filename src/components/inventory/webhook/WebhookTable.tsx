
import React from 'react';
import { webhooksData } from './mockData';
import { useWebhookSort } from './hooks/useWebhookSort';
import { useWebhookPagination } from './hooks/useWebhookPagination';
import { WebhookTableView } from './WebhookTableView';
import { WebhookPagination } from './WebhookPagination';

export const WebhookTable = () => {
  // Utiliza os hooks personalizados para ordenação e paginação
  const { sortField, sortDirection, sortedWebhooks, handleSort } = useWebhookSort(webhooksData);
  
  const {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    paginatedWebhooks,
    indexOfFirstItem,
    indexOfLastItem
  } = useWebhookPagination(sortedWebhooks);

  return (
    <div className="space-y-6">
      <WebhookTableView 
        webhooks={paginatedWebhooks} 
        sortField={sortField} 
        sortDirection={sortDirection} 
        onSort={handleSort} 
      />
      
      <WebhookPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={sortedWebhooks.length}
        indexOfFirstItem={indexOfFirstItem}
        indexOfLastItem={indexOfLastItem}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value);
          setCurrentPage(1);
        }}
      />
    </div>
  );
};
