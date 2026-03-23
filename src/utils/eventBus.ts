export type EventHandler<T = any> = (payload: T) => void;

export interface EventBusOptions {
  maxListeners?: number;
}

export enum EventTypes {
  AUTH_LOGIN = 'auth:login',
  AUTH_LOGOUT = 'auth:logout',
  AUTH_TOKEN_REFRESH = 'auth:tokenRefresh',
  LOADING_START = 'loading:start',
  LOADING_END = 'loading:end',
  NOTIFICATION_SHOW = 'notification:show',
  COMMENT_ADD = 'comment:add',
  ARTICLE_LIKE = 'article:like',
  ARTICLE_FAVORITE = 'article:favorite',
}

export class EventBus {
  private events: Map<string, Set<EventHandler>>;
  private maxListeners: number;

  constructor(options: EventBusOptions = {}) {
    this.events = new Map();
    this.maxListeners = options.maxListeners || 100;
  }

  on<T = any>(event: string, handler: EventHandler<T>): void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }

    const handlers = this.events.get(event)!;
    
    if (handlers.size >= this.maxListeners) {
      console.warn(`EventBus: Maximum listeners (${this.maxListeners}) reached for event "${event}"`);
      return;
    }

    handlers.add(handler);
  }

  off<T = any>(event: string, handler: EventHandler<T>): void {
    const handlers = this.events.get(event);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.events.delete(event);
      }
    }
  }

  once<T = any>(event: string, handler: EventHandler<T>): void {
    const onceHandler: EventHandler<T> = (payload) => {
      handler(payload);
      this.off(event, onceHandler);
    };
    this.on(event, onceHandler);
  }

  emit<T = any>(event: string, payload?: T): void {
    const handlers = this.events.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(payload);
        } catch (error) {
          console.error(`EventBus: Error in handler for event "${event}":`, error);
        }
      });
    }
  }

  clear(event?: string): void {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
  }

  listenerCount(event: string): number {
    return this.events.get(event)?.size || 0;
  }

  eventNames(): string[] {
    return Array.from(this.events.keys());
  }
}

export const eventBus = new EventBus();

export default eventBus;
