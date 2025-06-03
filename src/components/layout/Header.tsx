
import { UserMenu } from "@/components/auth/UserMenu";

export function Header() {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <UserMenu />
      </div>
    </header>
  );
}
