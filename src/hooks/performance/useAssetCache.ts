
import { useState, useEffect, useCallback } from 'react';
import { RedisService } from '@/services/cache/RedisService';

interface AssetCacheOptions {
  enableCache?: boolean;
  maxCacheSize?: number;
  preloadOnHover?: boolean;
}

interface AssetState {
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;
  src?: string;
}

export const useAssetCache = (
  src: string | undefined,
  options: AssetCacheOptions = {}
) => {
  const {
    enableCache = true,
    maxCacheSize = 10 * 1024 * 1024, // 10MB
    preloadOnHover = true
  } = options;

  const [state, setState] = useState<AssetState>({
    isLoading: false,
    isLoaded: false,
    error: null
  });

  const redis = RedisService.getInstance();

  const loadImage = useCallback(async (imageSrc: string): Promise<void> => {
    if (!imageSrc) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Check cache first
      if (enableCache) {
        const cached = await redis.get<string>(`asset:${imageSrc}`);
        if (cached) {
          setState({
            isLoading: false,
            isLoaded: true,
            error: null,
            src: cached
          });
          return;
        }
      }

      // Load image
      const img = new Image();
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          setState({
            isLoading: false,
            isLoaded: true,
            error: null,
            src: imageSrc
          });

          // Cache the successful load
          if (enableCache) {
            redis.set(`asset:${imageSrc}`, imageSrc, 24 * 60 * 60 * 1000); // 24 hours
          }
          
          resolve();
        };
        
        img.onerror = () => {
          const error = 'Failed to load image';
          setState({
            isLoading: false,
            isLoaded: false,
            error,
            src: undefined
          });
          reject(new Error(error));
        };
        
        img.src = imageSrc;
      });
    } catch (error) {
      setState({
        isLoading: false,
        isLoaded: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        src: undefined
      });
    }
  }, [enableCache, redis]);

  const preload = useCallback(async (imageSrc: string): Promise<void> => {
    if (!imageSrc || !preloadOnHover) return;
    
    try {
      const cached = await redis.get<string>(`asset:${imageSrc}`);
      if (!cached) {
        // Start preloading in background
        loadImage(imageSrc);
      }
    } catch (error) {
      console.warn('Preload failed:', error);
    }
  }, [loadImage, preloadOnHover, redis]);

  useEffect(() => {
    if (src) {
      loadImage(src);
    } else {
      setState({
        isLoading: false,
        isLoaded: false,
        error: null,
        src: undefined
      });
    }
  }, [src, loadImage]);

  return {
    ...state,
    preload,
    reload: () => src && loadImage(src)
  };
};

// Hook for preloading multiple assets
export const useAssetPreloader = (assets: string[]) => {
  const [preloadedCount, setPreloadedCount] = useState(0);
  const [isPreloading, setIsPreloading] = useState(false);
  const redis = RedisService.getInstance();

  const preloadAll = useCallback(async (): Promise<void> => {
    if (assets.length === 0) return;

    setIsPreloading(true);
    setPreloadedCount(0);

    const promises = assets.map(async (src, index) => {
      try {
        // Check if already cached
        const cached = await redis.get<string>(`asset:${src}`);
        if (cached) {
          setPreloadedCount(prev => prev + 1);
          return;
        }

        // Preload image
        const img = new Image();
        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            redis.set(`asset:${src}`, src, 24 * 60 * 60 * 1000);
            setPreloadedCount(prev => prev + 1);
            resolve();
          };
          img.onerror = () => reject(new Error(`Failed to preload ${src}`));
          img.src = src;
        });
      } catch (error) {
        console.warn(`Failed to preload asset ${src}:`, error);
        setPreloadedCount(prev => prev + 1); // Count as "completed" to not block progress
      }
    });

    await Promise.all(promises);
    setIsPreloading(false);
  }, [assets, redis]);

  useEffect(() => {
    if (assets.length > 0) {
      preloadAll();
    }
  }, [assets, preloadAll]);

  return {
    preloadedCount,
    totalAssets: assets.length,
    isPreloading,
    progress: assets.length > 0 ? (preloadedCount / assets.length) * 100 : 0,
    retry: preloadAll
  };
};
