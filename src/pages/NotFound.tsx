
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-4">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="text-2xl mt-4 mb-6">Página não encontrada</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        A página que você está procurando não existe ou foi removida.
      </p>
      <Button onClick={() => navigate("/dashboard")}>Voltar ao Dashboard</Button>
    </div>
  );
}
