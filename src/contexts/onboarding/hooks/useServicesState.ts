
import { useState } from 'react';
import { ServiceData } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const useServicesState = () => {
  const [services, setServices] = useState<ServiceData[]>([]);

  const addService = (service: ServiceData) => {
    const newService = {
      ...service,
      id: service.id || uuidv4()
    };
    setServices(prev => [...prev, newService]);
  };

  const updateService = (id: string, updatedService: Partial<ServiceData>) => {
    setServices(prev => prev.map(service => 
      service.id === id ? { ...service, ...updatedService } : service
    ));
  };

  const removeService = (id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
  };

  return {
    services,
    addService,
    updateService,
    removeService,
    setServices,
  };
};
