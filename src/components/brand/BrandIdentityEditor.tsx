/**
 * Brand Identity Editor Component
 * Advanced editor for brand identity configurations
 */

import React, { useState, useEffect } from 'react';
import { useBrandIdentity } from '../../contexts/BrandIdentityContext';
import { BrandIdentity } from '../../services/brandIdentityService';

interface BrandIdentityEditorProps {
  brandId: string;
  onSave?: (brandIdentity: BrandIdentity) => void;
  onCancel?: () => void;
}

const BrandIdentityEditor: React.FC<BrandIdentityEditorProps> = ({
  brandId,
  onSave,
  onCancel
}) => {
  const { brandIdentity, updateBrand, loading } = useBrandIdentity();
  const [editedBrand, setEditedBrand] = useState<BrandIdentity>(brandIdentity || {});
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'spacing' | 'motion' | 'decorations'>('colors');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (brandIdentity) {
      setEditedBrand(brandIdentity);
    }
  }, [brandIdentity]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateBrand(brandId, editedBrand);
      onSave?.(editedBrand);
    } catch (error: any) {
      alert(`Failed to save brand identity: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleColorChange = (path: string, value: string) => {
    const keys = path.split('.');
    setEditedBrand(prev => {
      const newBrand = { ...prev };
      let current = newBrand;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newBrand;
    });
  };

  const addColorToken = () => {
    const tokenName = prompt('Enter color token name:');
    const tokenValue = prompt('Enter color value (e.g., #ff0000):');
    
    if (tokenName && tokenValue) {
      setEditedBrand(prev => ({
        ...prev,
        colors: {
          ...prev.colors,
          palette: {
            ...prev.colors?.palette,
            [tokenName]: tokenValue
          }
        }
      }));
    }
  };

  const removeColorToken = (tokenName: string) => {
    setEditedBrand(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        palette: {
          ...prev.colors?.palette,
          [tokenName]: undefined
        }
      }
    }));
  };

  const addSpacingToken = () => {
    const tokenName = prompt('Enter spacing token name:');
    const tokenValue = prompt('Enter spacing value (e.g., 16px):');
    
    if (tokenName && tokenValue) {
      setEditedBrand(prev => ({
        ...prev,
        spacing: {
          ...prev.spacing,
          [tokenName]: tokenValue
        }
      }));
    }
  };

  const removeSpacingToken = (tokenName: string) => {
    setEditedBrand(prev => {
      const newSpacing = { ...prev.spacing };
      delete newSpacing[tokenName];
      return {
        ...prev,
        spacing: newSpacing
      };
    });
  };

  const renderColorsTab = () => (
    <div className="colors-editor">
      <div className="section-header">
        <h3>Color Palette</h3>
        <button onClick={addColorToken} className="add-button">
          Add Color Token
        </button>
      </div>
      
      {editedBrand.colors?.palette && Object.entries(editedBrand.colors.palette).map(([key, value]) => (
        <div key={key} className="color-editor-item">
          <div className="color-input-group">
            <input
              type="text"
              value={key}
              onChange={(e) => {
                const newKey = e.target.value;
                const newPalette = { ...editedBrand.colors?.palette };
                delete newPalette[key];
                newPalette[newKey] = value;
                setEditedBrand(prev => ({
                  ...prev,
                  colors: {
                    ...prev.colors,
                    palette: newPalette
                  }
                }));
              }}
              className="token-name"
            />
            <input
              type="color"
              value={value}
              onChange={(e) => handleColorChange(`colors.palette.${key}`, e.target.value)}
              className="color-picker"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => handleColorChange(`colors.palette.${key}`, e.target.value)}
              className="color-value"
            />
            <button 
              onClick={() => removeColorToken(key)}
              className="remove-button"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSpacingTab = () => (
    <div className="spacing-editor">
      <div className="section-header">
        <h3>Spacing System</h3>
        <button onClick={addSpacingToken} className="add-button">
          Add Spacing Token
        </button>
      </div>
      
      {editedBrand.spacing && Object.entries(editedBrand.spacing).map(([key, value]) => (
        <div key={key} className="spacing-editor-item">
          <div className="spacing-input-group">
            <input
              type="text"
              value={key}
              onChange={(e) => {
                const newKey = e.target.value;
                const newSpacing = { ...editedBrand.spacing };
                delete newSpacing[key];
                newSpacing[newKey] = value;
                setEditedBrand(prev => ({
                  ...prev,
                  spacing: newSpacing
                }));
              }}
              className="token-name"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => setEditedBrand(prev => ({
                ...prev,
                spacing: {
                  ...prev.spacing,
                  [key]: e.target.value
                }
              }))}
              className="spacing-value"
            />
            <button 
              onClick={() => removeSpacingToken(key)}
              className="remove-button"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTypographyTab = () => (
    <div className="typography-editor">
      <h3>Typography System</h3>
      <p>Typography configuration editor would go here...</p>
      <p>This would include font families, weights, sizes, line heights, etc.</p>
    </div>
  );

  const renderMotionTab = () => (
    <div className="motion-editor">
      <h3>Motion System</h3>
      <p>Motion configuration editor would go here...</p>
      <p>This would include animation durations, easing functions, etc.</p>
    </div>
  );

  const renderDecorationsTab = () => (
    <div className="decorations-editor">
      <h3>Decorations</h3>
      <p>Decorations configuration editor would go here...</p>
      <p>This would include border styles, shadows, etc.</p>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'colors':
        return renderColorsTab();
      case 'spacing':
        return renderSpacingTab();
      case 'typography':
        return renderTypographyTab();
      case 'motion':
        return renderMotionTab();
      case 'decorations':
        return renderDecorationsTab();
      default:
        return renderColorsTab();
    }
  };

  if (loading) {
    return <div className="brand-editor-loading">Loading brand identity editor...</div>;
  }

  return (
    <div className="brand-identity-editor">
      <div className="editor-header">
        <h2>Edit Brand Identity: {brandId}</h2>
        <div className="editor-actions">
          <button onClick={onCancel} disabled={isSaving}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="editor-tabs">
        <button 
          className={activeTab === 'colors' ? 'active' : ''}
          onClick={() => setActiveTab('colors')}
        >
          Colors
        </button>
        <button 
          className={activeTab === 'spacing' ? 'active' : ''}
          onClick={() => setActiveTab('spacing')}
        >
          Spacing
        </button>
        <button 
          className={activeTab === 'typography' ? 'active' : ''}
          onClick={() => setActiveTab('typography')}
        >
          Typography
        </button>
        <button 
          className={activeTab === 'motion' ? 'active' : ''}
          onClick={() => setActiveTab('motion')}
        >
          Motion
        </button>
        <button 
          className={activeTab === 'decorations' ? 'active' : ''}
          onClick={() => setActiveTab('decorations')}
        >
          Decorations
        </button>
      </div>

      <div className="editor-content">
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default BrandIdentityEditor;
