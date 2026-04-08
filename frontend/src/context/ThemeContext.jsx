import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('authentick-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.style.setProperty('--bg-primary', '#0F172A');
      root.style.setProperty('--bg-surface', '#1E293B');
      root.style.setProperty('--bg-surface-hover', '#334155');
      root.style.setProperty('--border-color', '#334155');
      root.style.setProperty('--text-primary', '#F1F5F9');
      root.style.setProperty('--text-secondary', '#94A3B8');
      root.style.setProperty('--text-muted', '#64748B');
      root.style.setProperty('--skeleton-base', '#334155');
      root.style.setProperty('--skeleton-shine', '#475569');
    } else {
      root.classList.remove('dark');
      root.style.setProperty('--bg-primary', '#FFFFFF');
      root.style.setProperty('--bg-surface', '#FFFFFF');
      root.style.setProperty('--bg-surface-hover', '#F8FAFC');
      root.style.setProperty('--border-color', '#F1F5F9');
      root.style.setProperty('--text-primary', '#0F172A');
      root.style.setProperty('--text-secondary', '#64748B');
      root.style.setProperty('--text-muted', '#94A3B8');
      root.style.setProperty('--skeleton-base', '#E2E8F0');
      root.style.setProperty('--skeleton-shine', '#F1F5F9');
    }
    localStorage.setItem('authentick-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
