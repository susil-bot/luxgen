import React, { createContext, useContext, useMemo, useCallback, useRef } from 'react';

/**
 * Context Optimizer
 * Provides utilities to optimize context performance and reduce re-renders
 */

/**
 * Creates an optimized context that only triggers re-renders when specific values change
 */
export const createOptimizedContext = <T>(
  defaultValue: T,
  selector?: (value: T) => any
) => {
  const Context = createContext(defaultValue);
  
  const OptimizedProvider: React.FC<{
    value: T;
    children: React.ReactNode;
  }> = ({ value, children }) => {
    const memoizedValue = useMemo(() => {
      if (selector) {
        return selector(value);
      }
      return value;
    }, [value]);
    
    return (
      <Context.Provider value={memoizedValue}>
        {children}
      </Context.Provider>
    );
  };
  
  return {
    Context,
    Provider: OptimizedProvider,
    useContext: () => useContext(Context)
  };
};

/**
 * Context Splitter
 * Splits a large context into smaller, more focused contexts
 */
export const createContextSplitter = <T extends Record<string, any>>(
  contextName: string,
  initialValue: T
) => {
  const contexts = {} as Record<keyof T, React.Context<any>>;
  const providers = {} as Record<keyof T, React.ComponentType<{ children: React.ReactNode }>>;
  
  // Create individual contexts for each key
  Object.keys(initialValue).forEach(key => {
    const keyContext = createContext(initialValue[key as keyof T]);
    contexts[key as keyof T] = keyContext;
    
    providers[key as keyof T] = ({ children }) => (
      <keyContext.Provider value={initialValue[key as keyof T]}>
        {children}
      </keyContext.Provider>
    );
  });
  
  return {
    contexts,
    providers,
    useContext: <K extends keyof T>(key: K) => useContext(contexts[key])
  };
};

/**
 * Context Memoizer
 * Memoizes context values to prevent unnecessary re-renders
 */
export const createContextMemoizer = <T>(
  contextName: string,
  defaultValue: T
) => {
  const Context = createContext(defaultValue);
  
  const MemoizedProvider: React.FC<{
    value: T;
    children: React.ReactNode;
    dependencies?: any[];
  }> = ({ value, children, dependencies = [] }) => {
    const memoizedValue = useMemo(() => value, dependencies);
    const prevValueRef = useRef(memoizedValue);
    
    // Only update if value actually changed
    if (prevValueRef.current !== memoizedValue) {
      prevValueRef.current = memoizedValue;
    }
    
    return (
      <Context.Provider value={prevValueRef.current}>
        {children}
      </Context.Provider>
    );
  };
  
  return {
    Context,
    Provider: MemoizedProvider,
    useContext: () => useContext(Context)
  };
};

/**
 * Context Selector Hook
 * Allows components to subscribe to specific parts of context
 */
export const createContextSelector = <T, R>(
  Context: React.Context<T>,
  selector: (value: T) => R
) => {
  return () => {
    const contextValue = useContext(Context);
    return useMemo(() => selector(contextValue), [contextValue]);
  };
};

/**
 * Context Consumer with Equality Check
 * Only triggers re-renders when context value passes equality check
 */
export const createContextConsumer = <T>(
  Context: React.Context<T>,
  equalityFn?: (prev: T, next: T) => boolean
) => {
  return () => {
    const contextValue = useContext(Context);
    const prevValueRef = useRef(contextValue);
    
    const shouldUpdate = useCallback((prev: T, next: T) => {
      if (equalityFn) {
        return !equalityFn(prev, next);
      }
      return prev !== next;
    }, [equalityFn]);
    
    if (shouldUpdate(prevValueRef.current, contextValue)) {
      prevValueRef.current = contextValue;
    }
    
    return prevValueRef.current;
  };
};

/**
 * Context Performance Tracker
 * Tracks context performance and provides optimization suggestions
 */
export const createContextPerformanceTracker = <T>(
  contextName: string,
  enabled: boolean = process.env.NODE_ENV === 'development'
) => {
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(0);
  
  return {
    trackRender: (contextValue: T) => {
      if (!enabled) return;
      
      renderCountRef.current++;
      const now = performance.now();
      
      if (lastRenderTimeRef.current > 0) {
        const timeSinceLastRender = now - lastRenderTimeRef.current;
        
        if (timeSinceLastRender < 16) { // Less than one frame
          console.warn(`🔄 High frequency context updates in ${contextName}: ${renderCountRef.current} renders`);
        }
      }
      
      lastRenderTimeRef.current = now;
    },
    
    getMetrics: () => ({
      renderCount: renderCountRef.current,
      lastRenderTime: lastRenderTimeRef.current
    }),
    
    reset: () => {
      renderCountRef.current = 0;
      lastRenderTimeRef.current = 0;
    }
  };
};

export default {
  createOptimizedContext,
  createContextSplitter,
  createContextMemoizer,
  createContextSelector,
  createContextConsumer,
  createContextPerformanceTracker
};
