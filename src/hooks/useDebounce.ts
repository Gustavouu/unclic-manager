import { useState, useEffect, useRef, useCallback } from 'react';

// Debounce a value
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

// Debounce a function
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const callbackRef = useRef<T>(callback);
  
  // Keep the callback reference updated
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  // Use useRef for timeoutId (not useState) to avoid re-renders
  const timeoutRef = useRef<number | null>(null);
  
  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = window.setTimeout(() => {
        if (callbackRef.current) {
          callbackRef.current(...args);
        }
        timeoutRef.current = null;
      }, delay);
    },
    [delay] // Only depend on delay, not on callback
  );
  
  // Clean up any pending timeouts when unmounting
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return debouncedCallback;
}

// Throttle a function - ensuring consistent hook calls
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const lastCall = useRef<number>(0);
  const timeoutRef = useRef<number | null>(null);
  const callbackRef = useRef<T>(callback);
  
  // Keep the callback reference updated
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      
      if (now - lastCall.current >= delay) {
        if (timeoutRef.current !== null) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        lastCall.current = now;
        callbackRef.current(...args);
      } else if (timeoutRef.current === null) {
        timeoutRef.current = window.setTimeout(() => {
          lastCall.current = Date.now();
          timeoutRef.current = null;
          callbackRef.current(...args);
        }, delay - (now - lastCall.current));
      }
    },
    [delay] // Only depend on delay, not on callback
  );
  
  // Clean up any pending timeouts when unmounting
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return throttledCallback;
}
