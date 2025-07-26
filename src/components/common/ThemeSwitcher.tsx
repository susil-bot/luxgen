import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button, Card, Text } from './SimpleThemeComponents';

const ThemeSwitcher: React.FC = () => {
  const { 
    theme, 
    currentTheme, 
    setTheme, 
    isDarkMode, 
    setDarkMode, 
    getThemePresets,
    resetTheme 
  } = useTheme();

  const presets = getThemePresets();

  const handleThemeChange = (themeName: string) => {
    setTheme(themeName);
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!isDarkMode);
  };

  return (
    <Card variant="outlined" size="md" padding="lg">
      <Text variant="h4" color="primary" align="center">
        Theme Customization
      </Text>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'flex-start' }}>
        {/* Theme Presets */}
        <div className="w-full">
          <Text variant="h6" color="secondary" className="mb-2">
            Theme Presets
          </Text>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {Object.entries(presets).map(([key, preset]) => (
              <Button
                key={key}
                variant={currentTheme === key ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => handleThemeChange(key)}
              >
                {preset.name || key}
              </Button>
            ))}
                      </div>
          </div>

        {/* Dark Mode Toggle */}
        <div className="w-full">
          <Text variant="h6" color="secondary" className="mb-2">
            Dark Mode
          </Text>
          <Button
            variant={isDarkMode ? 'primary' : 'secondary'}
            size="md"
            onClick={handleDarkModeToggle}
          >
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </Button>
        </div>

        {/* Reset Theme */}
        <div style={{ width: '100%' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetTheme}
          >
            Reset to Default
          </Button>
        </div>

        {/* Current Theme Info */}
        <Card variant="default" size="sm" padding="md" className="w-full">
          <Text variant="caption" color="muted">
            Current Theme: {theme.name}
          </Text>
          <Text variant="caption" color="muted">
            Version: {theme.version}
          </Text>
          <Text variant="caption" color="muted">
            Author: {theme.author}
          </Text>
        </Card>
              </div>
      </Card>
  );
};

export default ThemeSwitcher; 