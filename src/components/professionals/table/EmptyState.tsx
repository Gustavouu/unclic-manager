
import { UserRound } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="text-center py-10">
      <UserRound className="h-12 w-12 mx-auto text-muted-foreground/60 mb-3" />
      <p className="text-muted-foreground mb-1">Nenhum colaborador encontrado</p>
      <p className="text-sm text-muted-foreground/75">Adicione um novo colaborador ou altere sua busca</p>
    </div>
  );
};
