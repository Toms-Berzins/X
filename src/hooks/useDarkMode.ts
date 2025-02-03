import { useEffect } from 'react';
import { useTheme } from '../components/shared/ThemeProvider';

export const useDarkMode = () => {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return {
    isDark: theme === 'dark',
    toggleDarkMode: toggleTheme,
  };
}; 