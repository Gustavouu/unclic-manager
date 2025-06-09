
interface ProductionConfig {
  enableCache: boolean;
  enableErrorMonitoring: boolean;
  enablePerformanceMonitoring: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  apiTimeout: number;
  maxRetries: number;
  cacheTTL: number;
}

const getProductionConfig = (): ProductionConfig => {
  const isProduction = import.meta.env.PROD;
  
  return {
    enableCache: import.meta.env.VITE_ENABLE_CACHE !== 'false',
    enableErrorMonitoring: import.meta.env.VITE_ENABLE_ERROR_MONITORING !== 'false',
    enablePerformanceMonitoring: import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING !== 'false',
    logLevel: isProduction ? 'error' : 'debug',
    apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
    maxRetries: isProduction ? 3 : 1,
    cacheTTL: parseInt(import.meta.env.VITE_CACHE_TTL || '300000'), // 5 minutes
  };
};

export const productionConfig = getProductionConfig();

export const shouldLog = (level: ProductionConfig['logLevel']): boolean => {
  const levels = { debug: 0, info: 1, warn: 2, error: 3 };
  const currentLevel = levels[productionConfig.logLevel];
  const messageLevel = levels[level];
  
  return messageLevel >= currentLevel;
};

export const log = {
  debug: (message: string, ...args: any[]) => {
    if (shouldLog('debug')) {
      console.log(`🔧 [DEBUG] ${message}`, ...args);
    }
  },
  info: (message: string, ...args: any[]) => {
    if (shouldLog('info')) {
      console.info(`ℹ️ [INFO] ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: any[]) => {
    if (shouldLog('warn')) {
      console.warn(`⚠️ [WARN] ${message}`, ...args);
    }
  },
  error: (message: string, ...args: any[]) => {
    if (shouldLog('error')) {
      console.error(`❌ [ERROR] ${message}`, ...args);
    }
  }
};
