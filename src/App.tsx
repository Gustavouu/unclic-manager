import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import { Index } from "./pages/Index";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { NotFound } from "./pages/NotFound";
import { Dashboard } from "./pages/Dashboard";
import { Appointments } from "./pages/Appointments";
import { Clients } from "./pages/Clients";
import { Services } from "./pages/Services";
import { Professionals } from "./pages/Professionals";
import { Inventory } from "./pages/Inventory";
import { useEffect, useState } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { AppLayout } from "./components/layout/AppLayout";
import Finance from "./pages/Finance";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      navigate("/login");
    } else {
      setLoading(false);
    }
  }, [session, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />
  },
  {
    path: "/dashboard",
    element: (
      <RequireAuth>
        <AppLayout>
          <Dashboard />
        </AppLayout>
      </RequireAuth>
    ),
  },
  {
    path: "/appointments",
    element: (
      <RequireAuth>
        <AppLayout>
          <Appointments />
        </AppLayout>
      </RequireAuth>
    ),
  },
  {
    path: "/clients",
    element: (
      <RequireAuth>
        <AppLayout>
          <Clients />
        </AppLayout>
      </RequireAuth>
    ),
  },
  {
    path: "/services",
    element: (
      <RequireAuth>
        <AppLayout>
          <Services />
        </AppLayout>
      </RequireAuth>
    ),
  },
  {
    path: "/professionals",
    element: (
      <RequireAuth>
        <AppLayout>
          <Professionals />
        </AppLayout>
      </RequireAuth>
    ),
  },
  {
    path: "/inventory",
    element: (
      <RequireAuth>
        <AppLayout>
          <Inventory />
        </AppLayout>
      </RequireAuth>
    ),
  },
  {
    path: "/finance",
    element: (
      <RequireAuth>
        <AppLayout>
          <Finance />
        </AppLayout>
      </RequireAuth>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
