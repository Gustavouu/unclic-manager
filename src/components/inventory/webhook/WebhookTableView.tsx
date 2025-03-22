
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Webhook, SortField, SortDirection } from './types';
import { WebhookActions } from './WebhookActions';

interface WebhookTableViewProps {
  webhooks: Webhook[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

export const WebhookTableView = ({ 
  webhooks, 
  sortField, 
  sortDirection, 
  onSort 
}: WebhookTableViewProps) => {
  return (
    <div className="border rounded-md shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead 
              className="cursor-pointer font-medium text-sm" 
              onClick={() => onSort('date')}
            >
              <div className="flex items-center">
                Data / Hora alteração {sortField === 'date' ? (
                  sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                ) : null}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer font-medium text-sm"
              onClick={() => onSort('product')}
            >
              <div className="flex items-center">
                Produto {sortField === 'product' ? (
                  sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                ) : null}
              </div>
            </TableHead>
            <TableHead className="font-medium text-sm">URL</TableHead>
            <TableHead className="font-medium text-sm">Autenticação</TableHead>
            <TableHead className="text-right font-medium text-sm">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {webhooks.map((webhook) => (
            <TableRow key={webhook.id} className="text-sm">
              <TableCell>{webhook.date}</TableCell>
              <TableCell>{webhook.product}</TableCell>
              <TableCell className="max-w-[200px] truncate">{webhook.url}</TableCell>
              <TableCell>{webhook.authentication}</TableCell>
              <TableCell className="text-right">
                <WebhookActions />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
