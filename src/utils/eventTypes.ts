export enum EventTypes {
  AUTH_LOGIN = 'auth:login',
  AUTH_LOGOUT = 'auth:logout',
  AUTH_TOKEN_REFRESH = 'auth:token_refresh',
  ARTICLE_LIKE = 'article:like',
  ARTICLE_UNLIKE = 'article:unlike',
  ARTICLE_FAVORITE = 'article:favorite',
  ARTICLE_UNFAVORITE = 'article:unfavorite',
  COMMENT_ADD = 'comment:add',
  COMMENT_DELETE = 'comment:delete',
  COMMENT_REPLY = 'comment:reply',
  NOTIFICATION_SHOW = 'notification:show',
  NOTIFICATION_HIDE = 'notification:hide',
  LOADING_START = 'loading:start',
  LOADING_END = 'loading:end',
  ROUTER_CHANGE = 'router:change',
  THEME_CHANGE = 'theme:change',
  LANGUAGE_CHANGE = 'language:change',
}

export interface AuthLoginPayload {
  token: string;
  userInfo: UserInfo;
}

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: string;
}

export interface ArticleActionPayload {
  articleId: string;
  count: number;
}

export interface CommentPayload {
  commentId: string;
  articleId: string;
}

export interface NotificationPayload {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface LoadingPayload {
  key?: string;
  message?: string;
}

export interface ThemeChangePayload {
  theme: 'light' | 'dark' | 'auto';
}

export interface LanguageChangePayload {
  language: string;
}
