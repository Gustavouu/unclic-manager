
import {
  createBrowserRouter,
  RouterProvider,
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
import Finance from "./pages/Finance";
import RequireAuth from "./components/auth/RequireAuth";

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
    element: <RequireAuth />,
    children: [
      { path: "", element: <Dashboard /> }
    ]
  },
  {
    path: "/appointments",
    element: <RequireAuth />,
    children: [
      { path: "", element: <Appointments /> }
    ]
  },
  {
    path: "/clients",
    element: <RequireAuth />,
    children: [
      { path: "", element: <Clients /> }
    ]
  },
  {
    path: "/services",
    element: <RequireAuth />,
    children: [
      { path: "", element: <Services /> }
    ]
  },
  {
    path: "/professionals",
    element: <RequireAuth />,
    children: [
      { path: "", element: <Professionals /> }
    ]
  },
  {
    path: "/inventory",
    element: <RequireAuth />,
    children: [
      { path: "", element: <Inventory /> }
    ]
  },
  {
    path: "/finance",
    element: <RequireAuth />,
    children: [
      { path: "", element: <Finance /> }
    ]
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
