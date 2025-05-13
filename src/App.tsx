
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import { initializeStorage } from "./services/storageService";

function App() {
  // Inicializar serviços ao carregar a aplicação
  useEffect(() => {
    const initServices = async () => {
      // Inicializar storage
      await initializeStorage();
    };
    
    initServices();
  }, []);
  
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default App;
