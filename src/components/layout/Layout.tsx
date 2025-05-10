
import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar/Sidebar";
import { Header } from "./Header";
import { MobileSidebar } from "./sidebar/MobileSidebar";

const Layout = () => {
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
