
import { createContext, useContext, useState, ReactNode } from "react";
import { X } from "lucide-react";

type ToastVariant = "default" | "destructive" | "success";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextType {
  toasts: Toast[];
  toast: (props: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = ({ title, description, variant = "default" }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, title, description, variant };
    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
    }, 5000);
  };

  const dismiss = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function ToastContainer() {
  const { toasts, dismiss } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            rounded-lg border p-4 shadow-lg animate-in fade-in slide-in-from-bottom-5
            ${toast.variant === "destructive" ? "bg-red-50 border-red-200 text-red-900" : ""}
            ${toast.variant === "success" ? "bg-green-50 border-green-200 text-green-900" : ""}
            ${toast.variant === "default" ? "bg-white border-gray-200 text-gray-900" : ""}
          `}
        >
          <div className="flex justify-between items-start">
            <h3 className="font-semibold">{toast.title}</h3>
            <button
              onClick={() => dismiss(toast.id)}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-slate-100 hover:text-slate-900 h-6 w-6"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </button>
          </div>
          {toast.description && (
            <div className="text-sm mt-1">{toast.description}</div>
          )}
        </div>
      ))}
    </div>
  );
}
