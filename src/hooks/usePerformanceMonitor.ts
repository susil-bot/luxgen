import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  maxRenderTime: number;
  minRenderTime: number;
}

/**
 * Performance Monitor Hook
 * Tracks component render performance and provides optimization insights
 */
export const usePerformanceMonitor = (
  componentName: string,
  enabled: boolean = process.env.NODE_ENV === 'development'
) => {
  const metricsRef = useRef<PerformanceMetrics>({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    maxRenderTime: 0,
    minRenderTime: Infinity
  });

  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    startTimeRef.current = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTimeRef.current;
      
      const metrics = metricsRef.current;
      metrics.renderCount++;
      metrics.lastRenderTime = renderTime;
      
      // Update average
      metrics.averageRenderTime = 
        (metrics.averageRenderTime * (metrics.renderCount - 1) + renderTime) / metrics.renderCount;
      
      // Update min/max
      metrics.maxRenderTime = Math.max(metrics.maxRenderTime, renderTime);
      metrics.minRenderTime = Math.min(metrics.minRenderTime, renderTime);
      
      // Log performance warnings
      if (renderTime > 16) { // More than one frame (60fps)
        console.warn(`🐌 Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
      
      if (metrics.renderCount > 10 && metrics.averageRenderTime > 8) {
        console.warn(`⚠️ High render frequency in ${componentName}: ${metrics.renderCount} renders, avg: ${metrics.averageRenderTime.toFixed(2)}ms`);
      }
    };
  });

  const getMetrics = useCallback(() => metricsRef.current, []);
  
  const resetMetrics = useCallback(() => {
    metricsRef.current = {
      renderCount: 0,
      lastRenderTime: 0,
      averageRenderTime: 0,
      maxRenderTime: 0,
      minRenderTime: Infinity
    };
  }, []);

  return {
    metrics: getMetrics(),
    resetMetrics,
    isSlowRender: metricsRef.current.lastRenderTime > 16,
    isHighFrequency: metricsRef.current.renderCount > 10 && metricsRef.current.averageRenderTime > 8
  };
};

/**
 * Context Performance Monitor
 * Monitors context value changes and re-renders
 */
export const useContextPerformanceMonitor = <T>(
  contextName: string,
  contextValue: T,
  enabled: boolean = process.env.NODE_ENV === 'development'
) => {
  const prevValueRef = useRef<T>(contextValue);
  const changeCountRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    if (prevValueRef.current !== contextValue) {
      changeCountRef.current++;
      prevValueRef.current = contextValue;
      
      if (changeCountRef.current > 5) {
        console.warn(`🔄 High context change frequency in ${contextName}: ${changeCountRef.current} changes`);
      }
    }
  }, [contextValue, contextName, enabled]);

  return {
    changeCount: changeCountRef.current,
    hasChanged: prevValueRef.current !== contextValue
  };
};

export default usePerformanceMonitor;
