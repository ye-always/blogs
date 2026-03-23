export interface ThemeColors {
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  secondary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
}

export interface ThemeFonts {
  sans: string[];
  serif: string[];
  mono: string[];
}

export interface ThemeSpacing {
  container: string;
  section: string;
}

export interface ThemeShadows {
  soft: string;
  medium: string;
  strong: string;
}

export interface ThemeTransitions {
  fast: string;
  normal: string;
  slow: string;
}

export interface Theme {
  colors: ThemeColors;
  fonts: ThemeFonts;
  spacing: ThemeSpacing;
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    full: string;
  };
  shadows: ThemeShadows;
  transitions: ThemeTransitions;
}

export const theme: Theme = {
  colors: {
    primary: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
    },
    secondary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7e22ce',
      800: '#6b21a8',
      900: '#581c87',
    },
  },
  fonts: {
    sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    serif: ['Merriweather', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
    mono: ['Fira Code', 'Monaco', 'Consolas', 'Courier New', 'monospace'],
  },
  spacing: {
    container: '1200px',
    section: '4rem',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  shadows: {
    soft: '0 2px 8px rgba(0, 0, 0, 0.06)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.08)',
    strong: '0 8px 32px rgba(0, 0, 0, 0.12)',
  },
  transitions: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
};
