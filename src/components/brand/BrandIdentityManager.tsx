/**
 * Brand Identity Manager Component
 * Comprehensive brand identity management interface
 */

import React, { useState, useEffect } from 'react';
import { useBrandIdentity } from '../../contexts/BrandIdentityContext';
import { BrandIdentity } from '../../services/brandIdentityService';

const BrandIdentityManager: React.FC = () => {
  const {
    currentBrandId,
    brandIdentity,
    availableBrands,
    brandAssets,
    brandHealth,
    loading,
    error,
    switchBrand,
    refreshBrandIdentity,
    loadAvailableBrands,
    createBrand,
    updateBrand,
    deleteBrand,
    clearBrandCache
  } = useBrandIdentity();

  const [newBrandId, setNewBrandId] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBrandId, setEditingBrandId] = useState('');

  useEffect(() => {
    loadAvailableBrands();
  }, [loadAvailableBrands]);

  const handleSwitchBrand = async (brandId: string) => {
    try {
      await switchBrand(brandId);
    } catch (error) {
      console.error('Failed to switch brand:', error);
    }
  };

  const handleCreateBrand = async () => {
    if (!newBrandId.trim()) return;

    setIsCreating(true);
    try {
      // Create a default brand identity structure
      const defaultBrandIdentity: BrandIdentity = {
        colors: {
          palette: {
            'primary-01': '#007bff',
            'primary-07': '#0056b3',
            'neutral-01': '#f5f5f5',
            'neutral-08': '#333333',
            'white': '#ffffff',
            'black': '#000000'
          }
        },
        spacing: {
          'spacing-0': '0px',
          'spacing-4': '4px',
          'spacing-8': '8px',
          'spacing-16': '16px',
          'spacing-24': '24px',
          'spacing-32': '32px'
        },
        typography: {
          definitions: {
            utility: {
              'body': {
                family: 'Helvetica',
                weight: 400,
                'mobile-size': 16,
                'line-height': 1.5
              },
              'heading': {
                family: 'Helvetica',
                weight: 700,
                'mobile-size': 24,
                'line-height': 1.25
              }
            }
          }
        }
      };

      await createBrand(newBrandId, defaultBrandIdentity);
      setNewBrandId('');
      alert(`Brand "${newBrandId}" created successfully!`);
    } catch (error: any) {
      alert(`Failed to create brand: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteBrand = async (brandId: string) => {
    if (brandId === 'default') {
      alert('Cannot delete the default brand');
      return;
    }

    if (window.confirm(`Are you sure you want to delete brand "${brandId}"?`)) {
      try {
        await deleteBrand(brandId);
        alert(`Brand "${brandId}" deleted successfully!`);
      } catch (error: any) {
        alert(`Failed to delete brand: ${error.message}`);
      }
    }
  };

  const handleClearCache = async (brandId: string) => {
    try {
      await clearBrandCache(brandId);
      alert(`Cache cleared for brand "${brandId}"`);
    } catch (error: any) {
      alert(`Failed to clear cache: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="brand-identity-manager">
        <div className="loading">Loading brand identity...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="brand-identity-manager">
        <div className="error">Error: {error}</div>
        <button onClick={refreshBrandIdentity}>Retry</button>
      </div>
    );
  }

  return (
    <div className="brand-identity-manager">
      <h1>Brand Identity Manager</h1>

      {/* Current Brand Info */}
      <div className="current-brand-info">
        <h2>Current Brand: {currentBrandId}</h2>
        {brandHealth && (
          <div className={`health-status ${brandHealth.status}`}>
            Status: {brandHealth.status}
            {brandHealth.hasColors && <span> ✓ Colors</span>}
            {brandHealth.hasTypography && <span> ✓ Typography</span>}
            {brandHealth.hasSpacing && <span> ✓ Spacing</span>}
          </div>
        )}
      </div>

      {/* Brand Switcher */}
      <div className="brand-switcher">
        <h3>Switch Brand</h3>
        <div className="brand-list">
          {availableBrands.map((brandId) => (
            <div key={brandId} className={`brand-item ${brandId === currentBrandId ? 'active' : ''}`}>
              <span>{brandId}</span>
              <div className="brand-actions">
                <button 
                  onClick={() => handleSwitchBrand(brandId)}
                  disabled={brandId === currentBrandId}
                >
                  {brandId === currentBrandId ? 'Current' : 'Switch'}
                </button>
                <button 
                  onClick={() => handleDeleteBrand(brandId)}
                  disabled={brandId === 'default'}
                >
                  Delete
                </button>
                <button onClick={() => handleClearCache(brandId)}>
                  Clear Cache
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create New Brand */}
      <div className="create-brand">
        <h3>Create New Brand</h3>
        <div className="create-form">
          <input
            type="text"
            placeholder="Brand ID (e.g., my-brand)"
            value={newBrandId}
            onChange={(e) => setNewBrandId(e.target.value)}
            disabled={isCreating}
          />
          <button 
            onClick={handleCreateBrand}
            disabled={!newBrandId.trim() || isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Brand'}
          </button>
        </div>
      </div>

      {/* Brand Identity Details */}
      {brandIdentity && (
        <div className="brand-details">
          <h3>Brand Identity Details</h3>
          <div className="brand-sections">
            {brandIdentity.colors && (
              <div className="brand-section">
                <h4>Colors</h4>
                {brandIdentity.colors.palette && (
                  <div className="color-palette">
                    {Object.entries(brandIdentity.colors.palette).map(([key, value]) => (
                      <div key={key} className="color-item">
                        <div 
                          className="color-swatch" 
                          style={{ backgroundColor: value }}
                        ></div>
                        <span className="color-name">{key}</span>
                        <span className="color-value">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {brandIdentity.spacing && (
              <div className="brand-section">
                <h4>Spacing</h4>
                <div className="spacing-list">
                  {Object.entries(brandIdentity.spacing).map(([key, value]) => (
                    <div key={key} className="spacing-item">
                      <span className="spacing-name">{key}</span>
                      <span className="spacing-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {brandIdentity.typography && (
              <div className="brand-section">
                <h4>Typography</h4>
                <div className="typography-list">
                  {Object.entries(brandIdentity.typography.definitions || {}).map(([category, styles]) => (
                    <div key={category} className="typography-category">
                      <h5>{category}</h5>
                      {Object.entries(styles).map(([styleName, style]) => (
                        <div key={styleName} className="typography-style">
                          <span className="style-name">{styleName}</span>
                          <span className="style-details">
                            {(style as any).family} {(style as any).weight} {(style as any)['mobile-size']}px
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Brand Assets */}
      {Object.keys(brandAssets).length > 0 && (
        <div className="brand-assets">
          <h3>Brand Assets</h3>
          {Object.entries(brandAssets).map(([category, assets]) => (
            <div key={category} className="asset-category">
              <h4>{category}</h4>
              <div className="asset-list">
                {assets.map((asset) => (
                  <div key={asset.name} className="asset-item">
                    <span className="asset-name">{asset.name}</span>
                    <span className="asset-type">{asset.type}</span>
                    <a href={asset.path} target="_blank" rel="noopener noreferrer">
                      View
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandIdentityManager;
