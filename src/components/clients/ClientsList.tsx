
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClientsTable } from './ClientsTable';
import { ClientsPagination } from './ClientsPagination';
import type { Client } from '@/types/client';

interface ClientsListProps {
  clients: Client[];
  totalClients: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onEditClient: (clientId: string) => void;
  onViewClient: (clientId: string) => void;
  onDeleteClient: (clientId: string) => void;
  onCreateAppointment?: (clientId: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const ClientsList: React.FC<ClientsListProps> = ({
  clients,
  totalClients,
  currentPage,
  totalPages,
  pageSize,
  onEditClient,
  onViewClient,
  onDeleteClient,
  onCreateAppointment,
  onPageChange,
  onPageSizeChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {totalClients} cliente{totalClients !== 1 ? 's' : ''} encontrado{totalClients !== 1 ? 's' : ''}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ClientsTable
          clients={clients}
          onEditClient={onEditClient}
          onViewClient={onViewClient}
          onDeleteClient={onDeleteClient}
          onCreateAppointment={onCreateAppointment}
        />
        
        {totalClients > 0 && (
          <ClientsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalClients}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        )}
      </CardContent>
    </Card>
  );
};
