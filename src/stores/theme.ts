import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<'light' | 'dark' | 'auto'>(
    (localStorage.getItem('theme') as 'light' | 'dark' | 'auto') || 'auto'
  );

  const setTheme = (newTheme: 'light' | 'dark' | 'auto') => {
    theme.value = newTheme;
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const applyTheme = (currentTheme: 'light' | 'dark' | 'auto') => {
    const html = document.documentElement;
    
    if (currentTheme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      html.classList.toggle('dark', prefersDark);
    } else {
      html.classList.toggle('dark', currentTheme === 'dark');
    }
  };

  const initTheme = () => {
    applyTheme(theme.value);
    
    if (theme.value === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('auto');
      mediaQuery.addEventListener('change', handleChange);
    }
  };

  return {
    theme,
    setTheme,
    initTheme,
  };
});
