
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import { Professional } from "@/hooks/professionals/types";
import { ProfessionalStatusBadge } from "./ProfessionalStatusBadge";
import { useState } from "react";
import { ProfessionalsPagination } from "./ProfessionalsPagination";

export interface ProfessionalsTableProps {
  professionals: Professional[];
  onProfessionalClick: (id: string) => void;
  onEditClick: (professional: Professional, e: React.MouseEvent) => void;
  onDeleteClick: (professional: Professional, e: React.MouseEvent) => void;
}

export const ProfessionalsTable = ({ 
  professionals,
  onProfessionalClick,
  onEditClick,
  onDeleteClick
}: ProfessionalsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const indexOfLastProfessional = currentPage * itemsPerPage;
  const indexOfFirstProfessional = indexOfLastProfessional - itemsPerPage;
  const currentProfessionals = professionals.slice(indexOfFirstProfessional, indexOfLastProfessional);
  
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  if (!professionals || professionals.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Nenhum profissional encontrado.</p>
        <p className="text-sm text-muted-foreground">Cadastre profissionais para vê-los aqui.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Nome</TableHead>
              <TableHead>Especialidades</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProfessionals.map((professional) => (
              <TableRow 
                key={professional.id}
                className="cursor-pointer hover:bg-slate-50"
                onClick={() => onProfessionalClick(professional.id)}
              >
                <TableCell className="font-medium">
                  {professional.name}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {professional.specialties?.slice(0, 2).map((specialty, index) => (
                      <span key={index} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">
                        {specialty}
                      </span>
                    ))}
                    {professional.specialties && professional.specialties.length > 2 && (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">
                        +{professional.specialties.length - 2}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{professional.email}</TableCell>
                <TableCell>{professional.phone}</TableCell>
                <TableCell>
                  <ProfessionalStatusBadge status={professional.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        onProfessionalClick(professional.id);
                      }}
                    >
                      <Eye size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditClick(professional, e);
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteClick(professional, e);
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <ProfessionalsPagination
        currentPage={currentPage}
        totalItems={professionals.length}
        itemsPerPage={itemsPerPage}
        onPageChange={paginate}
      />
    </div>
  );
};
