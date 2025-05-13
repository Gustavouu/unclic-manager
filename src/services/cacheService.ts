
/**
 * Cache Service - Implementa sistema de cache usando IndexedDB com fallback para localStorage
 */

// Configuração do banco de dados IndexedDB
const DB_NAME = 'unclic_cache';
const DB_VERSION = 1;
const STORE_NAME = 'cache_store';

// Definição de tipos para os itens em cache
interface CacheItem<T> {
  key: string;
  value: T;
  expiresAt: number | null; // timestamp em ms ou null para não expirar
  createdAt: number;
  size?: number;
}

// Opções para armazenamento no cache
interface CacheOptions {
  expiration?: number; // tempo em ms após o qual o item expira
  maxSize?: number;    // tamanho máximo em bytes (aproximado)
}

// Classe principal do serviço de cache
export class CacheService {
  private db: IDBDatabase | null = null;
  private isIndexedDBAvailable: boolean = false;
  private pendingOperations: Promise<any>[] = [];
  private readonly MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB limite padrão

  constructor() {
    // Verificar se IndexedDB está disponível no navegador
    this.isIndexedDBAvailable = this.checkIndexedDBAvailability();
    
    // Inicializar o banco de dados
    if (this.isIndexedDBAvailable) {
      this.initDatabase();
    } else {
      console.warn('IndexedDB não está disponível. Usando localStorage como fallback.');
    }
  }

  /**
   * Verifica se o IndexedDB está disponível no navegador
   */
  private checkIndexedDBAvailability(): boolean {
    try {
      return typeof window !== 'undefined' && 
             'indexedDB' in window && 
             window.indexedDB !== null;
    } catch (e) {
      console.error('Erro ao verificar disponibilidade do IndexedDB:', e);
      return false;
    }
  }

  /**
   * Inicializa o banco de dados IndexedDB
   */
  private async initDatabase(): Promise<void> {
    if (!this.isIndexedDBAvailable) return;
    
    try {
      const initPromise = new Promise<void>((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = (event) => {
          console.error('Erro ao abrir IndexedDB:', event);
          this.isIndexedDBAvailable = false;
          reject(new Error('Falha ao abrir IndexedDB'));
        };
        
        request.onsuccess = (event) => {
          this.db = (event.target as IDBOpenDBRequest).result;
          resolve();
        };
        
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          
          // Criar object store se não existir
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
            store.createIndex('expiresAt', 'expiresAt', { unique: false });
            store.createIndex('createdAt', 'createdAt', { unique: false });
          }
        };
      });
      
      this.pendingOperations.push(initPromise);
      await initPromise;
    } catch (error) {
      console.error('Erro na inicialização do IndexedDB:', error);
      this.isIndexedDBAvailable = false;
    }
  }

  /**
   * Aguarda a inicialização do banco de dados antes de executar operações
   */
  private async waitForInit(): Promise<void> {
    if (this.pendingOperations.length > 0) {
      await Promise.all(this.pendingOperations);
      this.pendingOperations = [];
    }
  }

  /**
   * Armazena um item no cache
   */
  public async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<boolean> {
    await this.waitForInit();
    
    const now = Date.now();
    const expiresAt = options.expiration ? now + options.expiration : null;
    
    // Calcular tamanho aproximado do item (estimativa básica)
    const size = this.estimateSize(value);
    
    // Se exceder o tamanho máximo especificado, não permitir armazenamento
    if (options.maxSize && size > options.maxSize) {
      console.warn(`Item "${key}" excede o tamanho máximo permitido:`, size, 'bytes');
      return false;
    }
    
    const cacheItem: CacheItem<T> = {
      key,
      value,
      expiresAt,
      createdAt: now,
      size
    };
    
    // Tentar usar IndexedDB primeiro
    if (this.isIndexedDBAvailable && this.db) {
      try {
        await this.setInIndexedDB(cacheItem);
        return true;
      } catch (error) {
        console.warn('Erro ao armazenar no IndexedDB, usando localStorage como fallback:', error);
        // Fallback para localStorage em caso de falha
      }
    }
    
    // Usar localStorage como fallback
    return this.setInLocalStorage(cacheItem);
  }

  /**
   * Armazena um item no IndexedDB
   */
  private setInIndexedDB<T>(item: CacheItem<T>): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Banco de dados não inicializado'));
        return;
      }
      
      try {
        const transaction = this.db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        const request = store.put(item);
        
        request.onsuccess = () => resolve();
        request.onerror = (event) => reject(event);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Armazena um item no localStorage
   */
  private setInLocalStorage<T>(item: CacheItem<T>): boolean {
    try {
      // Verificar se o localStorage está disponível
      if (typeof localStorage === 'undefined') return false;
      
      const stringValue = JSON.stringify(item);
      
      // Verificar se excede o limite do localStorage (geralmente 5MB)
      if (stringValue.length > 4 * 1024 * 1024) {
        console.warn(`Item "${item.key}" é muito grande para localStorage:`, stringValue.length, 'bytes');
        return false;
      }
      
      const storageKey = `${DB_NAME}_${item.key}`;
      localStorage.setItem(storageKey, stringValue);
      return true;
    } catch (error) {
      console.error('Erro ao armazenar no localStorage:', error);
      return false;
    }
  }

  /**
   * Recupera um item do cache
   */
  public async get<T>(key: string): Promise<T | null> {
    await this.waitForInit();
    
    // Tentar recuperar do IndexedDB primeiro
    if (this.isIndexedDBAvailable && this.db) {
      try {
        const item = await this.getFromIndexedDB<T>(key);
        if (item) {
          // Verificar expiração
          if (item.expiresAt && Date.now() > item.expiresAt) {
            await this.delete(key);
            return null;
          }
          return item.value;
        }
      } catch (error) {
        console.warn('Erro ao recuperar do IndexedDB, tentando localStorage:', error);
      }
    }
    
    // Fallback para localStorage
    return this.getFromLocalStorage<T>(key);
  }

  /**
   * Recupera um item do IndexedDB
   */
  private getFromIndexedDB<T>(key: string): Promise<CacheItem<T> | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Banco de dados não inicializado'));
        return;
      }
      
      try {
        const transaction = this.db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(key);
        
        request.onsuccess = (event) => {
          const result = (event.target as IDBRequest).result as CacheItem<T> | undefined;
          resolve(result || null);
        };
        
        request.onerror = (event) => reject(event);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Recupera um item do localStorage
   */
  private getFromLocalStorage<T>(key: string): T | null {
    try {
      if (typeof localStorage === 'undefined') return null;
      
      const storageKey = `${DB_NAME}_${key}`;
      const item = localStorage.getItem(storageKey);
      
      if (!item) return null;
      
      const cacheItem = JSON.parse(item) as CacheItem<T>;
      
      // Verificar expiração
      if (cacheItem.expiresAt && Date.now() > cacheItem.expiresAt) {
        localStorage.removeItem(storageKey);
        return null;
      }
      
      return cacheItem.value;
    } catch (error) {
      console.error('Erro ao recuperar do localStorage:', error);
      return null;
    }
  }

  /**
   * Remove um item do cache
   */
  public async delete(key: string): Promise<boolean> {
    await this.waitForInit();
    
    let success = true;
    
    // Remover do IndexedDB
    if (this.isIndexedDBAvailable && this.db) {
      try {
        await this.deleteFromIndexedDB(key);
      } catch (error) {
        console.warn('Erro ao remover do IndexedDB:', error);
        success = false;
      }
    }
    
    // Remover do localStorage também
    try {
      if (typeof localStorage !== 'undefined') {
        const storageKey = `${DB_NAME}_${key}`;
        localStorage.removeItem(storageKey);
      }
    } catch (error) {
      console.error('Erro ao remover do localStorage:', error);
      success = false;
    }
    
    return success;
  }

  /**
   * Remove um item do IndexedDB
   */
  private deleteFromIndexedDB(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Banco de dados não inicializado'));
        return;
      }
      
      try {
        const transaction = this.db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(key);
        
        request.onsuccess = () => resolve();
        request.onerror = (event) => reject(event);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Limpa todos os itens expirados do cache
   */
  public async clearExpiredItems(): Promise<void> {
    await this.waitForInit();
    
    const now = Date.now();
    
    // Limpar do IndexedDB
    if (this.isIndexedDBAvailable && this.db) {
      try {
        await this.clearExpiredFromIndexedDB(now);
      } catch (error) {
        console.error('Erro ao limpar itens expirados do IndexedDB:', error);
      }
    }
    
    // Limpar do localStorage
    this.clearExpiredFromLocalStorage(now);
  }

  /**
   * Limpa itens expirados do IndexedDB
   */
  private clearExpiredFromIndexedDB(now: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Banco de dados não inicializado'));
        return;
      }
      
      try {
        const transaction = this.db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const index = store.index('expiresAt');
        
        // Usar um IDBKeyRange para selecionar itens expirados
        // Não incluir itens onde expiresAt é null (não expiram)
        const range = IDBKeyRange.bound(1, now); // 1 em vez de 0 para evitar nulls
        
        const request = index.openCursor(range);
        
        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result as IDBCursorWithValue | null;
          
          if (cursor) {
            cursor.delete();
            cursor.continue();
          } else {
            resolve();
          }
        };
        
        request.onerror = (event) => reject(event);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Limpa itens expirados do localStorage
   */
  private clearExpiredFromLocalStorage(now: number): void {
    try {
      if (typeof localStorage === 'undefined') return;
      
      const keysToRemove: string[] = [];
      
      // Buscar todas as chaves relacionadas ao nosso DB_NAME
      for (let i = 0; i < localStorage.length; i++) {
        const storageKey = localStorage.key(i);
        
        if (storageKey?.startsWith(`${DB_NAME}_`)) {
          try {
            const item = localStorage.getItem(storageKey);
            if (item) {
              const cacheItem = JSON.parse(item) as CacheItem<any>;
              
              // Verificar se o item está expirado
              if (cacheItem.expiresAt && cacheItem.expiresAt < now) {
                keysToRemove.push(storageKey);
              }
            }
          } catch (e) {
            console.warn('Erro ao processar item do localStorage:', storageKey, e);
          }
        }
      }
      
      // Remover todos os itens expirados
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      if (keysToRemove.length > 0) {
        console.log(`Removidos ${keysToRemove.length} itens expirados do localStorage`);
      }
    } catch (error) {
      console.error('Erro ao limpar itens expirados do localStorage:', error);
    }
  }

  /**
   * Limpa todo o cache
   */
  public async clear(): Promise<boolean> {
    await this.waitForInit();
    
    let success = true;
    
    // Limpar do IndexedDB
    if (this.isIndexedDBAvailable && this.db) {
      try {
        await this.clearIndexedDB();
      } catch (error) {
        console.error('Erro ao limpar IndexedDB:', error);
        success = false;
      }
    }
    
    // Limpar do localStorage
    this.clearLocalStorage();
    
    return success;
  }

  /**
   * Limpa todos os dados do IndexedDB
   */
  private clearIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Banco de dados não inicializado'));
        return;
      }
      
      try {
        const transaction = this.db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();
        
        request.onsuccess = () => resolve();
        request.onerror = (event) => reject(event);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Limpa todos os dados do cache no localStorage
   */
  private clearLocalStorage(): void {
    try {
      if (typeof localStorage === 'undefined') return;
      
      const keysToRemove: string[] = [];
      
      // Encontrar todas as chaves relacionadas ao nosso DB_NAME
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(`${DB_NAME}_`)) {
          keysToRemove.push(key);
        }
      }
      
      // Remover todas as chaves encontradas
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
    } catch (error) {
      console.error('Erro ao limpar localStorage:', error);
    }
  }

  /**
   * Estima o tamanho de um objeto em bytes
   */
  private estimateSize(value: any): number {
    try {
      const jsonString = JSON.stringify(value);
      // Uma estimativa aproximada. Cada caractere em JS é 2 bytes em UTF-16
      return jsonString.length * 2;
    } catch (e) {
      console.warn('Erro ao estimar tamanho do objeto:', e);
      return 0;
    }
  }

  /**
   * Verifica o uso atual do cache
   */
  public async getCacheUsage(): Promise<{ itemCount: number; totalSize: number }> {
    await this.waitForInit();
    
    let itemCount = 0;
    let totalSize = 0;
    
    // Verificar uso no IndexedDB
    if (this.isIndexedDBAvailable && this.db) {
      try {
        const stats = await this.getIndexedDBUsage();
        itemCount = stats.itemCount;
        totalSize = stats.totalSize;
      } catch (error) {
        console.error('Erro ao verificar uso do IndexedDB:', error);
      }
    } else {
      // Fallback para localStorage
      const stats = this.getLocalStorageUsage();
      itemCount = stats.itemCount;
      totalSize = stats.totalSize;
    }
    
    return { itemCount, totalSize };
  }

  /**
   * Verifica o uso do cache no IndexedDB
   */
  private getIndexedDBUsage(): Promise<{ itemCount: number; totalSize: number }> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Banco de dados não inicializado'));
        return;
      }
      
      try {
        const transaction = this.db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const countRequest = store.count();
        
        let itemCount = 0;
        let totalSize = 0;
        
        countRequest.onsuccess = () => {
          itemCount = countRequest.result;
          
          // Agora percorrer todos os itens para calcular o tamanho total
          const cursorRequest = store.openCursor();
          
          cursorRequest.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest).result as IDBCursorWithValue | null;
            
            if (cursor) {
              const item = cursor.value as CacheItem<any>;
              totalSize += item.size || 0;
              cursor.continue();
            } else {
              resolve({ itemCount, totalSize });
            }
          };
          
          cursorRequest.onerror = (event) => reject(event);
        };
        
        countRequest.onerror = (event) => reject(event);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Verifica o uso do cache no localStorage
   */
  private getLocalStorageUsage(): { itemCount: number; totalSize: number } {
    try {
      if (typeof localStorage === 'undefined') {
        return { itemCount: 0, totalSize: 0 };
      }
      
      let itemCount = 0;
      let totalSize = 0;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        if (key?.startsWith(`${DB_NAME}_`)) {
          itemCount++;
          const item = localStorage.getItem(key) || '';
          totalSize += item.length * 2; // Aproximadamente 2 bytes por caractere
        }
      }
      
      return { itemCount, totalSize };
    } catch (error) {
      console.error('Erro ao verificar uso do localStorage:', error);
      return { itemCount: 0, totalSize: 0 };
    }
  }
}

// Instância singleton do CacheService
export const cacheService = new CacheService();

// Iniciar limpeza automática de itens expirados periodicamente
if (typeof window !== 'undefined') {
  // Limpar itens expirados a cada hora
  setInterval(() => {
    cacheService.clearExpiredItems().catch(error => {
      console.error('Erro na limpeza automática de cache:', error);
    });
  }, 60 * 60 * 1000); // 1 hora em milissegundos
}
