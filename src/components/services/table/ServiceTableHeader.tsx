
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const ServiceTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Serviço</TableHead>
        <TableHead>Categoria</TableHead>
        <TableHead>Duração</TableHead>
        <TableHead>Preço</TableHead>
        <TableHead className="text-right">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
};
