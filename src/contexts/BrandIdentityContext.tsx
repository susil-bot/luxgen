/**
 * Brand Identity Context
 * React context for managing brand identity state
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { brandIdentityService, BrandIdentity, BrandAssets, BrandHealth } from '../services/brandIdentityService';

// Action Types
type BrandIdentityAction =
  | { type: 'SET_CURRENT_BRAND_ID'; payload: string }
  | { type: 'SET_BRAND_IDENTITY'; payload: BrandIdentity | null }
  | { type: 'SET_AVAILABLE_BRANDS'; payload: string[] }
  | { type: 'SET_BRAND_ASSETS'; payload: BrandAssets }
  | { type: 'SET_BRAND_HEALTH'; payload: BrandHealth }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// State Interface
interface BrandIdentityState {
  currentBrandId: string;
  brandIdentity: BrandIdentity | null;
  availableBrands: string[];
  brandAssets: BrandAssets;
  brandHealth: BrandHealth | null;
  loading: boolean;
  error: string | null;
}

const initialState: BrandIdentityState = {
  currentBrandId: 'default',
  brandIdentity: null,
  availableBrands: [],
  brandAssets: {},
  brandHealth: null,
  loading: true,
  error: null,
};

// Reducer
const brandIdentityReducer = (state: BrandIdentityState, action: BrandIdentityAction): BrandIdentityState => {
  switch (action.type) {
    case 'SET_CURRENT_BRAND_ID':
      return { ...state, currentBrandId: action.payload };
    case 'SET_BRAND_IDENTITY':
      return { ...state, brandIdentity: action.payload };
    case 'SET_AVAILABLE_BRANDS':
      return { ...state, availableBrands: action.payload };
    case 'SET_BRAND_ASSETS':
      return { ...state, brandAssets: action.payload };
    case 'SET_BRAND_HEALTH':
      return { ...state, brandHealth: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

// Context
interface BrandIdentityContextType extends BrandIdentityState {
  switchBrand: (brandId: string) => Promise<void>;
  refreshBrandIdentity: () => Promise<void>;
  loadAvailableBrands: () => Promise<void>;
  loadBrandAssets: (brandId?: string) => Promise<void>;
  loadBrandHealth: (brandId?: string) => Promise<void>;
  createBrand: (brandId: string, brandIdentity: BrandIdentity) => Promise<void>;
  updateBrand: (brandId: string, brandIdentity: BrandIdentity) => Promise<void>;
  deleteBrand: (brandId: string) => Promise<void>;
  clearBrandCache: (brandId?: string) => Promise<void>;
}

const BrandIdentityContext = createContext<BrandIdentityContextType | undefined>(undefined);

// Provider Component
export const BrandIdentityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(brandIdentityReducer, initialState);

  const switchBrand = useCallback(async (brandId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      // Apply brand identity to document
      await brandIdentityService.applyBrandIdentity(brandId);
      
      // Load brand identity
      const brandIdentity = await brandIdentityService.getBrandIdentity(brandId);
      dispatch({ type: 'SET_BRAND_IDENTITY', payload: brandIdentity });
      dispatch({ type: 'SET_CURRENT_BRAND_ID', payload: brandId });
      
      // Load brand assets and health
      await Promise.all([
        loadBrandAssets(brandId),
        loadBrandHealth(brandId)
      ]);
    } catch (error: any) {
      console.error('Failed to switch brand:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to switch brand' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const refreshBrandIdentity = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const brandIdentity = await brandIdentityService.getCurrentBrandIdentity();
      dispatch({ type: 'SET_BRAND_IDENTITY', payload: brandIdentity });
    } catch (error: any) {
      console.error('Failed to refresh brand identity:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to refresh brand identity' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const loadAvailableBrands = useCallback(async () => {
    try {
      const availableBrands = await brandIdentityService.getAvailableBrands();
      dispatch({ type: 'SET_AVAILABLE_BRANDS', payload: availableBrands });
    } catch (error: any) {
      console.error('Failed to load available brands:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to load available brands' });
    }
  }, []);

  const loadBrandAssets = useCallback(async (brandId?: string) => {
    try {
      const targetBrandId = brandId || state.currentBrandId;
      const brandAssets = await brandIdentityService.getBrandAssets(targetBrandId);
      dispatch({ type: 'SET_BRAND_ASSETS', payload: brandAssets });
    } catch (error: any) {
      console.error('Failed to load brand assets:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to load brand assets' });
    }
  }, [state.currentBrandId]);

  const loadBrandHealth = useCallback(async (brandId?: string) => {
    try {
      const targetBrandId = brandId || state.currentBrandId;
      const brandHealth = await brandIdentityService.getBrandHealth(targetBrandId);
      dispatch({ type: 'SET_BRAND_HEALTH', payload: brandHealth });
    } catch (error: any) {
      console.error('Failed to load brand health:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to load brand health' });
    }
  }, [state.currentBrandId]);

  const createBrand = useCallback(async (brandId: string, brandIdentity: BrandIdentity) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      await brandIdentityService.createBrandIdentity(brandId, brandIdentity);
      await loadAvailableBrands();
    } catch (error: any) {
      console.error('Failed to create brand:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to create brand' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [loadAvailableBrands]);

  const updateBrand = useCallback(async (brandId: string, brandIdentity: BrandIdentity) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      await brandIdentityService.updateBrandIdentity(brandId, brandIdentity);
      if (brandId === state.currentBrandId) {
        dispatch({ type: 'SET_BRAND_IDENTITY', payload: brandIdentity });
      }
    } catch (error: any) {
      console.error('Failed to update brand:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update brand' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.currentBrandId]);

  const deleteBrand = useCallback(async (brandId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      await brandIdentityService.deleteBrandIdentity(brandId);
      await loadAvailableBrands();
      
      // If deleted brand was current, switch to default
      if (brandId === state.currentBrandId) {
        await switchBrand('default');
      }
    } catch (error: any) {
      console.error('Failed to delete brand:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to delete brand' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.currentBrandId, switchBrand, loadAvailableBrands]);

  const clearBrandCache = useCallback(async (brandId?: string) => {
    try {
      const targetBrandId = brandId || state.currentBrandId;
      await brandIdentityService.clearBrandCache(targetBrandId);
    } catch (error: any) {
      console.error('Failed to clear brand cache:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to clear brand cache' });
    }
  }, [state.currentBrandId]);

  // Initialize brand identity on mount
  useEffect(() => {
    const initializeBrandIdentity = async () => {
      try {
        const currentBrandId = brandIdentityService.getCurrentBrandId();
        dispatch({ type: 'SET_CURRENT_BRAND_ID', payload: currentBrandId });
        
        // Load initial data
        await Promise.all([
          refreshBrandIdentity(),
          loadAvailableBrands(),
          loadBrandAssets(currentBrandId),
          loadBrandHealth(currentBrandId)
        ]);
      } catch (error: any) {
        console.error('Failed to initialize brand identity:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to initialize brand identity' });
      }
    };

    initializeBrandIdentity();
  }, [refreshBrandIdentity, loadAvailableBrands, loadBrandAssets, loadBrandHealth]);

  const contextValue: BrandIdentityContextType = {
    ...state,
    switchBrand,
    refreshBrandIdentity,
    loadAvailableBrands,
    loadBrandAssets,
    loadBrandHealth,
    createBrand,
    updateBrand,
    deleteBrand,
    clearBrandCache,
  };

  return (
    <BrandIdentityContext.Provider value={contextValue}>
      {children}
    </BrandIdentityContext.Provider>
  );
};

// Hook for easy consumption
export const useBrandIdentity = () => {
  const context = useContext(BrandIdentityContext);
  if (context === undefined) {
    throw new Error('useBrandIdentity must be used within a BrandIdentityProvider');
  }
  return context;
};
