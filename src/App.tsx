
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Clients from "./pages/Clients";
import Services from "./pages/Services";
import Professionals from "./pages/Professionals";
import Inventory from "./pages/Inventory";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "./integrations/supabase/client";
import { AppLayout } from "./components/layout/AppLayout";
import Finance from "./pages/Finance";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get session
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
      
      if (!data.session) {
        navigate("/login");
      }
    };
    
    getSession();
    
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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
