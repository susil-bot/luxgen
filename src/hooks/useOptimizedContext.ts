import { useContext, useMemo, useRef, useCallback } from 'react';

/**
 * Optimized Context Hook
 * Reduces re-renders by memoizing context values and providing
 * stable references when possible
 */
export const useOptimizedContext = <T>(
  Context: React.Context<T>,
  selector?: (value: T) => any
) => {
  const contextValue = useContext(Context);
  const selectorRef = useRef(selector);
  const lastValueRef = useRef<any>();

  // Update selector ref if it changed
  if (selector !== selectorRef.current) {
    selectorRef.current = selector;
  }

  const selectedValue = useMemo(() => {
    if (!selectorRef.current) {
      return contextValue;
    }

    const newValue = selectorRef.current(contextValue);
    
    // Only update if the selected value actually changed
    if (lastValueRef.current !== newValue) {
      lastValueRef.current = newValue;
      return newValue;
    }

    return lastValueRef.current;
  }, [contextValue]);

  return selectedValue;
};

/**
 * Context Selector Hook
 * Allows components to subscribe to specific parts of context
 */
export const useContextSelector = <T, R>(
  Context: React.Context<T>,
  selector: (value: T) => R
): R => {
  return useOptimizedContext(Context, selector);
};

/**
 * Stable Context Value Hook
 * Provides a stable reference to context value to prevent unnecessary re-renders
 */
export const useStableContext = <T>(
  Context: React.Context<T>
) => {
  const contextValue = useContext(Context);
  const stableValueRef = useRef(contextValue);

  // Only update if the context value actually changed
  if (stableValueRef.current !== contextValue) {
    stableValueRef.current = contextValue;
  }

  return stableValueRef.current;
};

/**
 * Context Consumer Hook
 * Alternative to useContext that provides more control over re-renders
 */
export const useContextConsumer = <T>(
  Context: React.Context<T>,
  shouldUpdate?: (prevValue: T, nextValue: T) => boolean
) => {
  const contextValue = useContext(Context);
  const prevValueRef = useRef(contextValue);

  const shouldRerender = useCallback((prev: T, next: T) => {
    if (shouldUpdate) {
      return shouldUpdate(prev, next);
    }
    
    // Default: only update if reference changed
    return prev !== next;
  }, [shouldUpdate]);

  if (shouldRerender(prevValueRef.current, contextValue)) {
    prevValueRef.current = contextValue;
  }

  return prevValueRef.current;
};

export default useOptimizedContext;
