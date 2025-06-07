
import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { initializeGlobalErrorHandler } from "@/services/error/GlobalErrorHandler";
import App from "./App";

import "./index.css";

// Initialize global error handler for production monitoring
initializeGlobalErrorHandler();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="unclic-theme">
      <App />
      <Toaster />
    </ThemeProvider>
  </React.StrictMode>
);
