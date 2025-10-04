import { useState, useEffect, useCallback, useRef } from 'react';

interface InfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

interface InfiniteScrollState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  total: number;
}

interface InfiniteScrollReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  reset: () => void;
  loadingRef: React.RefObject<HTMLDivElement>;
}

export function useInfiniteScroll<T>(
  fetchFunction: (page: number, limit: number) => Promise<{
    success: boolean;
    data: T[];
    pagination?: any;
    error?: string;
  }>,
  options: InfiniteScrollOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '100px',
    enabled = true
  } = options;

  const [state, setState] = useState<InfiniteScrollState<T>>({
    data: [],
    loading: false,
    error: null,
    hasMore: true,
    page: 1,
    total: 0
  });

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const isInitialLoad = useRef(true);

  const loadMore = useCallback(async () => {
    if (state.loading || !state.hasMore) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await fetchFunction(state.page, 10);
      
      if (result.success && result.data) {
        setState(prev => ({
          ...prev,
          data: prev.page === 1 ? result.data : [...prev.data, ...result.data],
          page: prev.page + 1,
          hasMore: result.pagination?.hasNext ?? false,
          total: result.pagination?.total ?? prev.total,
          loading: false
        }));
      } else {
        setState(prev => ({
          ...prev,
          error: result.error || 'Failed to load data',
          loading: false
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An error occurred',
        loading: false
      }));
    }
  }, [state.page, state.loading, state.hasMore, fetchFunction]);

  const refresh = useCallback(async () => {
    setState(prev => ({
      ...prev,
      data: [],
      page: 1,
      hasMore: true,
      error: null
    }));
    isInitialLoad.current = true;
  }, []);

  const reset = useCallback(() => {
    setState({
      data: [],
      loading: false,
      error: null,
      hasMore: true,
      page: 1,
      total: 0
    });
    isInitialLoad.current = true;
  }, []);

  // Set up intersection observer
  useEffect(() => {
    if (!enabled || !loadingRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && state.hasMore && !state.loading) {
          loadMore();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observerRef.current.observe(loadingRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enabled, state.hasMore, state.loading, loadMore, threshold, rootMargin]);

  // Initial load
  useEffect(() => {
    if (isInitialLoad.current && enabled) {
      isInitialLoad.current = false;
      loadMore();
    }
  }, [enabled, loadMore]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    hasMore: state.hasMore,
    loadMore,
    refresh,
    reset,
    loadingRef
  };
}
