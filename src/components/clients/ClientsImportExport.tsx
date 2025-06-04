
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Upload, 
  Download, 
  FileSpreadsheet,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useClientsData } from '@/hooks/clients/useClientsData';
import type { ClientFormData } from '@/types/client';

export const ClientsImportExport: React.FC = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { clients, createClient } = useClientsData();

  const exportClients = async () => {
    setIsExporting(true);
    try {
      const csvContent = [
        // Header
        'Nome,Email,Telefone,Data Nascimento,Gênero,Endereço,Cidade,Estado,CEP,Notas',
        // Data
        ...clients.map(client => [
          client.name || '',
          client.email || '',
          client.phone || '',
          client.birth_date || '',
          client.gender || '',
          client.address || '',
          client.city || '',
          client.state || '',
          client.zip_code || '',
          client.notes || ''
        ].map(field => `"${field.replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `clientes_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`${clients.length} clientes exportados com sucesso!`);
    } catch (error) {
      console.error('Error exporting clients:', error);
      toast.error('Erro ao exportar clientes');
    } finally {
      setIsExporting(false);
    }
  };

  const importClients = async (file: File) => {
    setIsImporting(true);
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('Arquivo CSV deve conter pelo menos um cabeçalho e uma linha de dados');
      }

      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase());
      const dataLines = lines.slice(1);

      let importedCount = 0;
      let errorCount = 0;

      for (const line of dataLines) {
        try {
          const values = line.split(',').map(v => v.replace(/"/g, '').trim());
          
          const clientData: ClientFormData = {
            name: values[headers.indexOf('nome')] || '',
            email: values[headers.indexOf('email')] || undefined,
            phone: values[headers.indexOf('telefone')] || undefined,
            birth_date: values[headers.indexOf('data nascimento')] || undefined,
            gender: values[headers.indexOf('gênero')] || undefined,
            address: values[headers.indexOf('endereço')] || undefined,
            city: values[headers.indexOf('cidade')] || undefined,
            state: values[headers.indexOf('estado')] || undefined,
            zip_code: values[headers.indexOf('cep')] || undefined,
            notes: values[headers.indexOf('notas')] || undefined,
          };

          if (clientData.name) {
            await createClient(clientData);
            importedCount++;
          }
        } catch (error) {
          console.error('Error importing client row:', error);
          errorCount++;
        }
      }

      if (importedCount > 0) {
        toast.success(`${importedCount} clientes importados com sucesso!`);
      }
      
      if (errorCount > 0) {
        toast.error(`${errorCount} clientes não puderam ser importados`);
      }
    } catch (error) {
      console.error('Error importing clients:', error);
      toast.error('Erro ao importar clientes');
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        importClients(file);
      } else {
        toast.error('Por favor, selecione um arquivo CSV');
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Importar / Exportar Clientes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Button
              onClick={exportClients}
              disabled={isExporting || clients.length === 0}
              className="w-full sm:w-auto flex items-center gap-2"
              variant="outline"
            >
              <Download className="h-4 w-4" />
              {isExporting ? 'Exportando...' : 'Exportar CSV'}
            </Button>
            <p className="text-sm text-gray-500 mt-1">
              Exportar {clients.length} clientes para arquivo CSV
            </p>
          </div>

          <div className="flex-1">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              disabled={isImporting}
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-1">
              {isImporting ? 'Importando...' : 'Importar clientes de arquivo CSV'}
            </p>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Formato do arquivo CSV:</p>
              <p>O arquivo deve conter as colunas: Nome, Email, Telefone, Data Nascimento, Gênero, Endereço, Cidade, Estado, CEP, Notas</p>
              <p className="mt-1">Apenas a coluna "Nome" é obrigatória.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
