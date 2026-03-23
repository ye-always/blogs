export interface ApiConfig {
  baseURL: string;
  timeout: number;
}

export const apiConfig: ApiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 30000,
};

export const routes = {
  home: '/',
  article: (id: string | number) => `/article/${id}`,
  category: (id: string | number) => `/category/${id}`,
  tag: (name: string) => `/tag/${name}`,
  search: '/search',
  about: '/about',
  login: '/login',
  admin: {
    dashboard: '/admin',
    articles: '/admin/articles',
    comments: '/admin/comments',
    settings: '/admin/settings',
  },
};
