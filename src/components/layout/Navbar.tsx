import { StockNotifications } from "../inventory/StockNotifications";
import { MainNav } from "../main-nav";
import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <MainNav />
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-sm font-medium">Dashboard</Link>
            <Link to="/appointments" className="text-sm font-medium">Agendamentos</Link>
            <Link to="/clients" className="text-sm font-medium">Clientes</Link>
            <Link to="/reports" className="text-sm font-medium">Relatórios</Link>
            <Link to="/inventory" className="text-sm font-medium">Estoque</Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          <StockNotifications />
          {/* Other navbar items like user profile etc. */}
        </div>
      </div>
    </header>
  );
}
