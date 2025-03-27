
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface WebsiteLoadingProps {
  type: "loading" | "not-found";
}

export const WebsiteLoading: React.FC<WebsiteLoadingProps> = ({ type }) => {
  const navigate = useNavigate();
  
  if (type === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Carregando...</h1>
          <p className="text-muted-foreground mt-2">Aguarde enquanto buscamos as informações do estabelecimento</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Estabelecimento não encontrado</h1>
        <p className="text-muted-foreground mt-2">
          O estabelecimento que você está procurando não existe
        </p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate("/")}
        >
          Voltar para página inicial
        </Button>
      </div>
    </div>
  );
};
