import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { eventBus } from './eventBus';
import { EventTypes } from './eventTypes';

export interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
  skipErrorHandler?: boolean;
  retry?: number;
  retryDelay?: number;
}

export interface ResponseData<T = any> {
  code: number;
  message: string;
  data: T;
}

class HttpClient {
  private instance: AxiosInstance;
  private pendingRequests: Map<string, AbortController>;
  private maxRetries: number;
  private retryDelay: number;

  constructor(config: RequestConfig = {}) {
    this.instance = axios.create({
      baseURL: config.baseURL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.pendingRequests = new Map();
    this.maxRetries = config.retry || 3;
    this.retryDelay = config.retryDelay || 1000;

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        
        if (token && !config.skipAuth) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        if (config.data instanceof FormData) {
          delete config.headers['Content-Type'];
        }

        const requestKey = this.getRequestKey(config);
        
        if (this.pendingRequests.has(requestKey)) {
          const controller = this.pendingRequests.get(requestKey)!;
          controller.abort();
        }

        const controller = new AbortController();
        config.signal = controller.signal;
        this.pendingRequests.set(requestKey, controller);

        eventBus.emit(EventTypes.LOADING_START, { key: requestKey });

        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse<ResponseData>) => {
        const config = response.config as InternalAxiosRequestConfig;
        const requestKey = this.getRequestKey(config);
        
        this.pendingRequests.delete(requestKey);
        eventBus.emit(EventTypes.LOADING_END, { key: requestKey });

        const { code, message, data } = response.data;

        if (code === 200) {
          return data;
        } else {
          eventBus.emit(EventTypes.NOTIFICATION_SHOW, { type: 'error', message: message || '请求失败' });
          return Promise.reject(new Error(message || '请求失败'));
        }
      },
      async (error: AxiosError<ResponseData>) => {
        const config = error.config as InternalAxiosRequestConfig & { __retryCount?: number };
        
        if (config) {
          const requestKey = this.getRequestKey(config);
          this.pendingRequests.delete(requestKey);
          eventBus.emit(EventTypes.LOADING_END, { key: requestKey });

          if (!config.skipErrorHandler) {
            if (error.response?.status === 401) {
              this.handleUnauthorized();
              return Promise.reject(error);
            }

            if (error.response?.status === 429) {
              eventBus.emit(EventTypes.NOTIFICATION_SHOW, { type: 'warning', message: '请求过于频繁，请稍后再试' });
              return Promise.reject(error);
            }

            if (this.shouldRetry(error) && (config.__retryCount || 0) < this.maxRetries) {
              config.__retryCount = (config.__retryCount || 0) + 1;
              await this.delay(this.retryDelay * config.__retryCount);
              return this.instance.request(config);
            }

            const message = error.response?.data?.message || error.message || '网络错误';
            eventBus.emit(EventTypes.NOTIFICATION_SHOW, { type: 'error', message });
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private getRequestKey(config: InternalAxiosRequestConfig): string {
    return `${config.method}:${config.url}:${JSON.stringify(config.params)}:${JSON.stringify(config.data)}`;
  }

  private handleUnauthorized(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    eventBus.emit(EventTypes.AUTH_LOGOUT);
    eventBus.emit(EventTypes.NOTIFICATION_SHOW, { type: 'error', message: '登录已过期，请重新登录' });
    window.location.href = '/login';
  }

  private shouldRetry(error: AxiosError): boolean {
    if (!error.response) return true;
    const status = error.response.status;
    return status === 503 || status === 504 || status >= 500;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public get<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return this.instance.get(url, config);
  }

  public post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.instance.post(url, data, config);
  }

  public put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.instance.put(url, data, config);
  }

  public delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return this.instance.delete(url, config);
  }

  public patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.instance.patch(url, data, config);
  }

  public cancelRequest(url: string): void {
    this.pendingRequests.forEach((controller, key) => {
      if (key.includes(url)) {
        controller.abort();
        this.pendingRequests.delete(key);
      }
    });
  }

  public cancelAllRequests(): void {
    this.pendingRequests.forEach((controller) => {
      controller.abort();
    });
    this.pendingRequests.clear();
  }
}

export const httpClient = new HttpClient();

export default httpClient;
