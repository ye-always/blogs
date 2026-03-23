import { eventBus } from './eventBus';
import { EventTypes, type NotificationPayload, type LoadingPayload } from './eventTypes';

export const eventEmitter = {
  auth: {
    login: (token: string, userInfo: any) => {
      eventBus.emit(EventTypes.AUTH_LOGIN, { token, userInfo });
    },
    logout: () => {
      eventBus.emit(EventTypes.AUTH_LOGOUT);
    },
    tokenRefresh: (token: string) => {
      eventBus.emit(EventTypes.AUTH_TOKEN_REFRESH, token);
    },
  },
  article: {
    like: (articleId: string, count: number) => {
      eventBus.emit(EventTypes.ARTICLE_LIKE, { articleId, count });
    },
    unlike: (articleId: string, count: number) => {
      eventBus.emit(EventTypes.ARTICLE_UNLIKE, { articleId, count });
    },
    favorite: (articleId: string, count: number) => {
      eventBus.emit(EventTypes.ARTICLE_FAVORITE, { articleId, count });
    },
    unfavorite: (articleId: string, count: number) => {
      eventBus.emit(EventTypes.ARTICLE_UNFAVORITE, { articleId, count });
    },
  },
  comment: {
    add: (commentId: string, articleId: string) => {
      eventBus.emit(EventTypes.COMMENT_ADD, { commentId, articleId });
    },
    delete: (commentId: string, articleId: string) => {
      eventBus.emit(EventTypes.COMMENT_DELETE, { commentId, articleId });
    },
    reply: (commentId: string, articleId: string) => {
      eventBus.emit(EventTypes.COMMENT_REPLY, { commentId, articleId });
    },
  },
  notification: {
    show: (type: NotificationPayload['type'], message: string, duration = 3000) => {
      eventBus.emit(EventTypes.NOTIFICATION_SHOW, { type, message, duration });
    },
    hide: () => {
      eventBus.emit(EventTypes.NOTIFICATION_HIDE);
    },
  },
  loading: {
    start: (key?: string, message?: string) => {
      eventBus.emit(EventTypes.LOADING_START, { key, message });
    },
    end: (key?: string) => {
      eventBus.emit(EventTypes.LOADING_END, { key });
    },
  },
  theme: {
    change: (theme: 'light' | 'dark' | 'auto') => {
      eventBus.emit(EventTypes.THEME_CHANGE, { theme });
    },
  },
  language: {
    change: (language: string) => {
      eventBus.emit(EventTypes.LANGUAGE_CHANGE, { language });
    },
  },
};

export default eventEmitter;
