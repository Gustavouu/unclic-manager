
import { useState, useMemo } from 'react';
import { Webhook } from '../types';

export const useWebhookPagination = (webhooks: Webhook[]) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = useMemo(() => {
    return Math.ceil(webhooks.length / itemsPerPage);
  }, [webhooks.length, itemsPerPage]);

  const paginatedWebhooks = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return webhooks.slice(indexOfFirstItem, indexOfLastItem);
  }, [webhooks, currentPage, itemsPerPage]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  return {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    paginatedWebhooks,
    indexOfFirstItem,
    indexOfLastItem
  };
};
