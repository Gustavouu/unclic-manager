
import { ServiceData } from '../models/dashboardTypes';

/**
 * Processes popular services from appointment data
 */
export const processPopularServices = (popularServicesData: ServiceData[] | null) => {
  if (!popularServicesData || popularServicesData.length === 0) {
    return [];
  }
  
  const serviceCountMap = new Map<string, {id: string, name: string, count: number}>();
  
  popularServicesData.forEach(app => {
    if (!app.id_servico || !app.servicos) return;
    
    const serviceId = app.id_servico;
    const existing = serviceCountMap.get(serviceId);
    
    if (existing) {
      existing.count += 1;
    } else {
      // Extract service name safely
      const serviceName = typeof app.servicos === 'object' && app.servicos !== null
        ? app.servicos.nome || "Serviço desconhecido"
        : "Serviço desconhecido";
      
      serviceCountMap.set(serviceId, {
        id: serviceId,
        name: serviceName,
        count: 1
      });
    }
  });
  
  // Calculate total service count for percentage calculation
  const totalServiceCount = Array.from(serviceCountMap.values()).reduce((sum, service) => sum + service.count, 0);
  
  // Add percentage to popular services
  return Array.from(serviceCountMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map(service => ({
      ...service,
      percentage: totalServiceCount > 0 ? (service.count / totalServiceCount) * 100 : 0
    }));
};
