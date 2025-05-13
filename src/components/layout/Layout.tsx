
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "./Header";
import { SideMenu } from "./SideMenu";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "sonner";

const Layout = () => {
  const { currentBusiness, loading, error, refreshBusinessData } = useTenant();
  const navigate = useNavigate();
  const [dataRefreshed, setDataRefreshed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white shadow-sm transition-transform duration-300 ease-in-out border-r dark:bg-background dark:border-gray-800 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center border-b px-4">
          <h1 className="text-xl font-semibold text-blue-600">Unclic</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SideMenu />
        </div>
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium">GH</span>
            </div>
            <div className="flex flex-1 flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">Gustavo Henrique</span>
              <span className="text-xs text-muted-foreground truncate">exemplo@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
