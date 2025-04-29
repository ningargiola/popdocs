import React, { createContext, useContext, useState, useEffect } from 'react';

// Define theme colors
export const themes = {
  light: {
    background: '#ffffff',
    text: '#2f3147',
    textDim: '#666666',
    nodeBackground: '#f9f9f9',
    nodeBackgroundHover: '#f3f3f7',
    dirBackground: '#e0e7ff',
    dirBackgroundHover: '#d3dcff',
    border: '#eeeef5',
    borderHover: '#e5e5ed',
    dirBorder: '#ccd4ff',
    dirBorderHover: '#bbc4ff',
    handleColor: '#8286e5',
    edgeColor: '#2e3147',
    indicatorColor: '#6366f1',
    switchBackground: '#f8f8ff',
    switchBorder: '#eeeef5',
    switchActiveBackground: '#e0e7ff',
    miniMapBackground: '#f8f8ff',
    miniMapMask: 'rgba(30,32,60,0.1)',
    controlsBackground: '#ffffff',
    flowBackground: '#ffffff',
    flowBackgroundPattern: '#e5e7fa'
  },
  dark: {
    background: '#1a1b2e',
    text: '#e2e3ee',
    textDim: '#9394a7',
    nodeBackground: '#232438',
    nodeBackgroundHover: '#2a2b42',
    dirBackground: '#2e3147',
    dirBackgroundHover: '#363853',
    border: '#363853',
    borderHover: '#404263',
    dirBorder: '#404263',
    dirBorderHover: '#4a4d74',
    handleColor: '#8286e5',
    edgeColor: '#8286e5',
    indicatorColor: '#818cf8',
    switchBackground: '#232438',
    switchBorder: '#363853',
    switchActiveBackground: '#2e3147',
    miniMapBackground: '#232438',
    miniMapMask: 'rgba(0,0,0,0.2)',
    controlsBackground: '#232438',
    flowBackground: '#1a1b2e',
    flowBackgroundPattern: '#2e3147'
  }
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Check if user prefers dark mode
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [isDark, setIsDark] = useState(prefersDark);

  // Update theme when system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const theme = isDark ? themes.dark : themes.light;
  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 