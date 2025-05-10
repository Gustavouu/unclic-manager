
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Clients from "./pages/Clients";
import Reports from "./pages/Reports";
import Finance from "./pages/Finance";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import "./services/InitializationService"; // Import initialization service
import { RequireAuth } from "./components/auth/RequireAuth";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Index />} />
      <Route 
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="clients" element={<Clients />} />
        <Route path="reports" element={<Reports />} />
        <Route path="finance" element={<Finance />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="settings/*" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
