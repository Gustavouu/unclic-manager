
import { useState } from 'react';
import { ServiceData } from '../types';

export const useServicesState = () => {
  const [services, setServices] = useState<ServiceData[]>([]);

  // Function to add a new service
  const addService = (service: ServiceData) => {
    setServices(prev => [...prev, service]);
  };

  // Function to remove a service
  const removeService = (id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
  };

  // Function to update a service
  const updateService = (id: string, data: Partial<ServiceData>) => {
    setServices(prev =>
      prev.map(service => (service.id === id ? { ...service, ...data } : service))
    );
  };

  return {
    services,
    setServices,
    addService,
    removeService,
    updateService,
  };
};
