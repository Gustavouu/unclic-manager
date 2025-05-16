
import React, { useEffect, useState } from "react";
import { Onboarding } from "@/components/onboarding/Onboarding";
import { OnboardingProvider } from "@/contexts/onboarding/OnboardingContext";
import { Toaster } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Loader } from "@/components/ui/loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";

const OnboardingPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { businessId, businessData, loading: businessLoading, error: businessError } = useCurrentBusiness();
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "error">("checking");
  const [retryCount, setRetryCount] = useState(0);
  
  // Define page title
  useEffect(() => {
    document.title = "Initial Setup | Unclic";
  }, []);
  
  // Check Supabase connection
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Simple query to check database connection
        const { data, error } = await supabase.from('businesses').select('id').limit(1);
        
        if (error) {
          console.error("Database connection error:", error);
          setConnectionStatus("error");
          toast.error(`Error connecting to database: ${error.message}`);
        } else {
          console.log("Successfully connected to database");
          setConnectionStatus("connected");
        }
      } catch (err) {
        console.error("Failed to connect to Supabase:", err);
        setConnectionStatus("error");
        toast.error("Failed to connect to Supabase");
      }
    };
    
    if (user && !authLoading) {
      checkConnection();
    }
  }, [user, authLoading, retryCount]);

  // Show loading state while checking authentication
  if (authLoading || businessLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader size="lg" text="Loading..." />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Show error if database connection failed
  if (connectionStatus === "error" || businessError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4">
          <Alert variant="destructive">
            <AlertTitle>Connection error</AlertTitle>
            <AlertDescription className="mt-2">
              {businessError || "Could not connect to the database. Please try again later or contact support."}
            </AlertDescription>
            <div className="mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setConnectionStatus("checking");
                  setRetryCount(prev => prev + 1);
                }}
                className="flex items-center"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try again
              </Button>
            </div>
          </Alert>
        </div>
      </div>
    );
  }
  
  // Show loading state while checking connection
  if (connectionStatus === "checking") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader size="lg" text="Checking database connection..." />
      </div>
    );
  }

  // Show loading state while waiting for business ID
  if (!businessId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader size="lg" text="Loading business information..." />
      </div>
    );
  }

  return (
    <OnboardingProvider>
      <div className="min-h-screen bg-slate-50 py-8">
        <Onboarding />
        <Toaster position="top-right" />
      </div>
    </OnboardingProvider>
  );
};

export default OnboardingPage;
