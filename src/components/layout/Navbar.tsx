import { StockNotifications } from "../inventory/StockNotifications";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <a href="/" className="text-xl font-bold">Logo</a>
          <nav className="hidden md:flex items-center space-x-4">
            <a href="/dashboard" className="text-sm font-medium">Dashboard</a>
            <a href="/appointments" className="text-sm font-medium">Agendamentos</a>
            <a href="/clients" className="text-sm font-medium">Clientes</a>
            <a href="/reports" className="text-sm font-medium">Relatórios</a>
            <a href="/inventory" className="text-sm font-medium">Estoque</a>
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
