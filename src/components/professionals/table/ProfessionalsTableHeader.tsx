
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const ProfessionalsTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Colaborador</TableHead>
        <TableHead>Contato</TableHead>
        <TableHead>Função</TableHead>
        <TableHead>Data de Contratação</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="w-[100px]">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
};
