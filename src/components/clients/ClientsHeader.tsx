
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Search } from "lucide-react";
import { useState } from "react";
import { NewClientDialog } from "./NewClientDialog";

type ClientsHeaderProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

export const ClientsHeader = ({ searchTerm, setSearchTerm }: ClientsHeaderProps) => {
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Buscar cliente por nome, email ou telefone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 bg-white"
        />
      </div>
      <Button 
        onClick={() => setShowNewClientDialog(true)}
        className="w-full md:w-auto"
      >
        <UserPlus size={18} className="mr-2" />
        Novo Cliente
      </Button>
      {showNewClientDialog && (
        <NewClientDialog onClose={() => setShowNewClientDialog(false)} />
      )}
    </div>
  );
};
