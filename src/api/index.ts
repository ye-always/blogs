import httpClient from '../utils/httpClient';

export interface Article {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  author: {
    id: number;
    username: string;
    avatar?: string;
  };
  category: {
    id: number;
    name: string;
  };
  tags: Tag[];
  views: number;
  likes: number;
  favorites: number;
  comments: number;
  isLiked: boolean;
  isFavorited: boolean;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  articleCount?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  articleCount: number;
}

export interface Comment {
  id: number;
  content: string;
  articleId: number;
  author: {
    id: number;
    username: string;
    avatar?: string;
  };
  parentId?: number;
  replies?: Comment[];
  likes: number;
  isLiked: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface ArticleListParams extends PaginationParams {
  categoryId?: number;
  tagId?: number;
  keyword?: string;
  status?: string;
}

export interface ArticleListResponse {
  list: Article[];
  total: number;
  page: number;
  pageSize: number;
}

export const articleApi = {
  getArticleList: (params: ArticleListParams) => {
    return httpClient.get<any>('/articles', { params });
  },

  getArticleDetail: (id: number) => {
    return httpClient.get<any>(`/articles/${id}`);
  },

  createArticle: (data: any) => {
    return httpClient.post<any>('/articles', data);
  },

  updateArticle: (id: number, data: any) => {
    return httpClient.put<any>(`/articles/${id}`, data);
  },

  deleteArticle: (id: number) => {
    return httpClient.delete(`/articles/${id}`);
  },

  likeArticle: (id: number) => {
    return httpClient.post<any>(`/articles/${id}/like`);
  },

  unlikeArticle: (id: number) => {
    return httpClient.delete<any>(`/articles/${id}/like`);
  },

  favoriteArticle: (id: number) => {
    return httpClient.post<any>(`/articles/${id}/favorite`);
  },

  unfavoriteArticle: (id: number) => {
    return httpClient.delete<any>(`/articles/${id}/favorite`);
  },

  getUserLikedArticles: (params: { page?: number; pageSize?: number }) => {
    return httpClient.get<any>('/articles/user/liked', { params });
  },

  getUserFavoritedArticles: (params: { page?: number; pageSize?: number }) => {
    return httpClient.get<any>('/articles/user/favorited', { params });
  },
};

export const commentApi = {
  getCommentList: (articleId: number, params: PaginationParams) => {
    return httpClient.get<any>(`/articles/${articleId}/comments`, { params });
  },

  createComment: (articleId: number, data: { content: string; parentId?: number }) => {
    return httpClient.post<any>(`/articles/${articleId}/comments`, data);
  },

  deleteComment: (commentId: number) => {
    return httpClient.delete(`/comments/${commentId}`);
  },

  likeComment: (commentId: number) => {
    return httpClient.post<any>(`/comments/${commentId}/like`);
  },

  unlikeComment: (commentId: number) => {
    return httpClient.delete<any>(`/comments/${commentId}/like`);
  },

  approveComment: (commentId: number) => {
    return httpClient.put<any>(`/comments/${commentId}/approve`);
  },

  rejectComment: (commentId: number) => {
    return httpClient.put<any>(`/comments/${commentId}/reject`);
  },
};

export const categoryApi = {
  getCategoryList: () => {
    return httpClient.get<Category[]>('/categories');
  },

  getCategoryDetail: (id: number) => {
    return httpClient.get<any>(`/categories/${id}`);
  },

  createCategory: (data: { name: string; slug: string; description?: string }) => {
    return httpClient.post<any>('/categories', data);
  },

  updateCategory: (id: number, data: { name: string; slug: string; description?: string }) => {
    return httpClient.put<any>(`/categories/${id}`, data);
  },

  deleteCategory: (id: number) => {
    return httpClient.delete(`/categories/${id}`);
  },
};

export const tagApi = {
  getTagList: () => {
    return httpClient.get<Tag[]>('/tags');
  },

  getTagDetail: (id: number) => {
    return httpClient.get<any>(`/tags/${id}`);
  },

  createTag: (data: { name: string; slug: string }) => {
    return httpClient.post<any>('/tags', data);
  },

  updateTag: (id: number, data: { name: string; slug: string }) => {
    return httpClient.put<any>(`/tags/${id}`, data);
  },

  deleteTag: (id: number) => {
    return httpClient.delete(`/tags/${id}`);
  },
};

export const authApi = {
  login: (data: { username: string; password: string }) => {
    return httpClient.post<any>('/auth/login', data);
  },

  logout: () => {
    return httpClient.post('/auth/logout');
  },

  register: (data: { username: string; email: string; password: string }) => {
    return httpClient.post<any>('/auth/register', data);
  },

  refreshToken: () => {
    return httpClient.post<any>('/auth/refresh');
  },

  getCurrentUser: () => {
    return httpClient.get<any>('/auth/me');
  },

  updateProfile: (data: Partial<User>) => {
    return httpClient.put<any>('/auth/profile', data);
  },

  changePassword: (data: { oldPassword: string; newPassword: string }) => {
    return httpClient.put('/auth/password', data);
  },

  forgotPassword: (email: string) => {
    return httpClient.post('/auth/forgot-password', { email });
  },
};

export const adminApi = {
  getDashboard: () => {
    return httpClient.get<any>('/admin/dashboard');
  },

  getComments: (params: PaginationParams & { status?: string }) => {
    return httpClient.get<any>('/admin/comments', { params });
  },

  getPendingComments: (params: PaginationParams) => {
    return httpClient.get<any>('/admin/comments/pending', { params });
  },

  batchApproveComments: (commentIds: number[]) => {
    return httpClient.put('/admin/comments/batch-approve', { commentIds });
  },

  batchRejectComments: (commentIds: number[]) => {
    return httpClient.put('/admin/comments/batch-reject', { commentIds });
  },

  getUsers: (params: PaginationParams & { keyword?: string }) => {
    return httpClient.get<any>('/admin/users', { params });
  },

  updateUserRole: (userId: number, data: { role: string }) => {
    return httpClient.put<any>(`/admin/users/${userId}/role`, data);
  },

  deleteUser: (userId: number) => {
    return httpClient.delete(`/admin/users/${userId}`);
  },
};

export const settingsApi = {
  getSettings: () => {
    return httpClient.get<any>('/settings');
  },

  getPublicSettings: () => {
    return httpClient.get<any>('/settings/public');
  },

  updateBasicSettings: (data: { siteName: string; siteDescription: string; siteKeywords: string; contactEmail: string }) => {
    return httpClient.put<any>('/settings/basic', data);
  },

  updateSecuritySettings: (data: { allowRegister: boolean; commentModeration: boolean; dailyCommentLimit: number }) => {
    return httpClient.put<any>('/settings/security', data);
  },
};

export const bannerApi = {
  getBannerList: () => {
    return httpClient.get<any>('/banners');
  },

  getBannerDetail: (id: number) => {
    return httpClient.get<any>(`/banners/${id}`);
  },

  createBanner: (data: { title: string; description?: string; image: string; link?: string; order: number; status: string }) => {
    return httpClient.post<any>('/banners', data);
  },

  updateBanner: (id: number, data: { title: string; description?: string; image?: string; link?: string; order?: number; status?: string }) => {
    return httpClient.put<any>(`/banners/${id}`, data);
  },

  deleteBanner: (id: number) => {
    return httpClient.delete(`/banners/${id}`);
  },
};
