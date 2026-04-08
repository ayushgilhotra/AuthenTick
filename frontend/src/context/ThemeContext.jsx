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
      // Backgrounds
      root.style.setProperty('--bg-primary', '#0F172A');
      root.style.setProperty('--bg-surface', '#1E293B');
      root.style.setProperty('--bg-elevated', '#273548');
      root.style.setProperty('--bg-input', '#1E293B');

      // Borders
      root.style.setProperty('--border-color', '#334155');

      // Text
      root.style.setProperty('--text-primary', '#F1F5F9');
      root.style.setProperty('--text-secondary', '#CBD5E1');
      root.style.setProperty('--text-muted', '#94A3B8');
      root.style.setProperty('--text-disabled', '#475569');

      // Brand
      root.style.setProperty('--color-blue', '#2563EB');
      root.style.setProperty('--color-blue-hover', '#1D4ED8');

      // Status
      root.style.setProperty('--color-success', '#22C55E');
      root.style.setProperty('--color-danger', '#EF4444');
      root.style.setProperty('--color-warning', '#F59E0B');
      root.style.setProperty('--color-info', '#38BDF8');

      // Sidebar
      root.style.setProperty('--sidebar-bg', '#0F172A');
      root.style.setProperty('--sidebar-active', '#1E3A5F');
      root.style.setProperty('--sidebar-text', '#CBD5E1');
      root.style.setProperty('--sidebar-icon', '#94A3B8');

      // Skeleton
      root.style.setProperty('--skeleton-base', '#334155');
      root.style.setProperty('--skeleton-shine', '#3E4F63');
    } else {
      root.classList.remove('dark');
      // Backgrounds
      root.style.setProperty('--bg-primary', '#FFFFFF');
      root.style.setProperty('--bg-surface', '#FFFFFF');
      root.style.setProperty('--bg-surface-hover', '#F8FAFC');
      root.style.setProperty('--bg-elevated', '#F8FAFC');
      root.style.setProperty('--bg-input', '#F9FAFB');
      // Borders
      root.style.setProperty('--border-color', '#F1F5F9');
      // Text
      root.style.setProperty('--text-primary', '#0F172A');
      root.style.setProperty('--text-secondary', '#64748B');
      root.style.setProperty('--text-muted', '#94A3B8');
      root.style.setProperty('--text-disabled', '#CBD5E1');
      // Sidebar
      root.style.setProperty('--sidebar-bg', '#FFFFFF');
      root.style.setProperty('--sidebar-active', '#EFF6FF');
      root.style.setProperty('--sidebar-text', '#64748B');
      root.style.setProperty('--sidebar-icon', '#94A3B8');
      // Skeleton
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
