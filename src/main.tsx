
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { SessionProvider } from "./contexts/SessionContext";
import { initializeEnv } from "./lib/env";

// Initialize environment validation
try {
  initializeEnv();
} catch (error) {
  console.error("Failed to initialize environment:", error);
  // We could show an error screen here, but for now we'll just log the error
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <SessionProvider>
        <App />
      </SessionProvider>
    </BrowserRouter>
  </React.StrictMode>
);
