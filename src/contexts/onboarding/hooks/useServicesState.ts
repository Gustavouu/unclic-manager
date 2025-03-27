
import { useState, useCallback } from "react";
import { ServiceData } from "../types";

export const useServicesState = () => {
  const [services, setServices] = useState<ServiceData[]>([]);

  // Service management functions
  const addService = useCallback((service: ServiceData) => {
    setServices(prev => [...prev, service]);
  }, []);

  const removeService = useCallback((id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
  }, []);

  const updateService = useCallback((id: string, data: Partial<ServiceData>) => {
    setServices(prev => 
      prev.map(service => service.id === id ? { ...service, ...data } : service)
    );
  }, []);

  return {
    services,
    setServices,
    addService,
    removeService,
    updateService
  };
};
