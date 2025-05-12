
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './hooks/useAuth';
import { LoadingProvider } from './contexts/LoadingContext';
import './index.css';
import { initializeEnv } from './lib/env';

// Initialize environment validation
try {
  initializeEnv();
} catch (error) {
  console.error("Failed to initialize environment:", error);
  // We could show an error screen here, but for now we'll just log the error
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <LoadingProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </LoadingProvider>
    </BrowserRouter>
  </React.StrictMode>
);
