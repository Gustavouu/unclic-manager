
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "./sidebar/Sidebar";
import { Header } from "./Header";
import { MobileSidebar } from "./sidebar/MobileSidebar";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "sonner";
import { StatusFixButton } from "@/components/dashboard/StatusFixButton";

const Layout = () => {
  const { currentBusiness, loading, error, refreshBusinessData } = useTenant();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Refresh business data when layout mounts
    refreshBusinessData();
    
    // Show non-blocking notifications instead of forced redirects
    if (!loading) {
      if (!currentBusiness) {
        toast.info("Complete a configuração do seu negócio para acessar todos os recursos", {
          action: {
            label: "Configurar",
            onClick: () => navigate("/onboarding")
          },
          duration: 10000, // 10 seconds
          id: "incomplete-onboarding" // Prevent duplicates
        });
      } else if (currentBusiness.status === 'pendente') {
        toast.info("Finalize a configuração do seu negócio para acessar todos os recursos", {
          action: {
            label: "Finalizar",
            onClick: () => navigate("/onboarding")
          },
          duration: 10000,
          id: "pending-onboarding"
        });
      }
    }
  }, [currentBusiness, loading, navigate, refreshBusinessData]);
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">Erro ao carregar dados</h2>
          <p className="text-gray-700 mt-2">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-background">
      <Sidebar />
      <MobileSidebar />
      
      <div className="flex-1 flex flex-col ml-0 md:ml-60">
        <Header />
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="container mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
        <StatusFixButton />
      </div>
    </div>
  );
};

export default Layout;
