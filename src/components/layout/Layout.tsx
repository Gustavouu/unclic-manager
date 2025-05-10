
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container max-w-7xl mx-auto py-6 px-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
