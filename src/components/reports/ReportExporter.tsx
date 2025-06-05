
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, FileSpreadsheet, Printer } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface ReportExporterProps {
  data: any;
  reportType: string;
  period: string;
}

export const ReportExporter: React.FC<ReportExporterProps> = ({ data, reportType, period }) => {
  const [exportFormat, setExportFormat] = React.useState<'pdf' | 'excel' | 'csv'>('pdf');

  const handleExport = async () => {
    try {
      toast.loading('Preparando relatório para download...');
      
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aqui implementaria a lógica real de exportação
      const fileName = `relatorio-${reportType}-${period}.${exportFormat}`;
      
      toast.success(`Relatório ${fileName} gerado com sucesso!`);
      console.log('Exportando:', { format: exportFormat, data, reportType, period });
    } catch (error) {
      toast.error('Erro ao gerar relatório');
      console.error('Erro na exportação:', error);
    }
  };

  const handlePrint = () => {
    window.print();
    toast.success('Preparando para impressão...');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Exportar Relatório
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Formato de Exportação</label>
          <Select value={exportFormat} onValueChange={(value: 'pdf' | 'excel' | 'csv') => setExportFormat(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  PDF
                </div>
              </SelectItem>
              <SelectItem value="excel">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  Excel
                </div>
              </SelectItem>
              <SelectItem value="csv">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  CSV
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleExport} className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Baixar
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>• PDF: Ideal para visualização e compartilhamento</p>
          <p>• Excel: Permite análises e edições avançadas</p>
          <p>• CSV: Compatível com diversos sistemas</p>
        </div>
      </CardContent>
    </Card>
  );
};
