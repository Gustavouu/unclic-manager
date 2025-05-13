
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { initializeStorage } from "./services/storageService";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

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
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings/*" element={<Settings />} />
        <Route path="/appointments" element={<Dashboard />} />
        <Route path="/services" element={<Dashboard />} />
        <Route path="/clients" element={<Dashboard />} />
        <Route path="/professionals" element={<Dashboard />} />
        <Route path="/inventory" element={<Dashboard />} />
        <Route path="/finances" element={<Dashboard />} />
        <Route path="/payments" element={<Dashboard />} />
        <Route path="/reports" element={<Dashboard />} />
        <Route path="/theme" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
