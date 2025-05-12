
import { useEffect, useState, ReactNode } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "./sidebar/Sidebar";
import { Header } from "./Header";
import { MobileSidebar } from "./sidebar/MobileSidebar";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "sonner";

const Layout = ({ children }: { children?: ReactNode }) => {
  const { currentBusiness, loading, error, refreshBusinessData } = useTenant();
  const navigate = useNavigate();
  const [dataRefreshed, setDataRefreshed] = useState(false);
  
  useEffect(() => {
    // Only refresh data once when the component mounts to prevent infinite loops
    if (!dataRefreshed) {
      refreshBusinessData().then(() => {
        setDataRefreshed(true);
      });
    }
  }, [refreshBusinessData, dataRefreshed]);
  
  useEffect(() => {
    // Show notifications only once based on the business status
    // The status-notification-shown check prevents showing repeated notifications
    if (!loading && !localStorage.getItem("status-notification-shown")) {
      if (!currentBusiness) {
        toast.info("Complete a configuração do seu negócio para acessar todos os recursos", {
          action: {
            label: "Configurar",
            onClick: () => navigate("/onboarding")
          },
          duration: 10000,
          id: "incomplete-onboarding"
        });
        localStorage.setItem("status-notification-shown", "true");
      } else if (currentBusiness.status === 'pendente') {
        toast.info("Finalize a configuração do seu negócio para acessar todos os recursos", {
          action: {
            label: "Finalizar",
            onClick: () => navigate("/onboarding")
          },
          duration: 10000,
          id: "pending-onboarding"
        });
        localStorage.setItem("status-notification-shown", "true");
      }
    }
  }, [currentBusiness, loading, navigate]);
  
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
            onClick={() => {
              localStorage.removeItem("status-notification-shown");
              window.location.reload();
            }}
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
      </div>
    </div>
  );
};

export default Layout;
