/**
 * API Types & Request/Response Schemas
 * Type-safe API communication layer
 */

import type { Message } from './index';
import type { Result } from './errors';

/**
 * HTTP Methods
 */
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

/**
 * Request configuration
 */
export interface RequestConfig {
  method: HTTPMethod;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  signal?: AbortSignal;
}

/**
 * Response metadata
 */
export interface ResponseMetadata {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  url: string;
  timestamp: Date;
  duration: number;
}

/**
 * Generic API response wrapper
 */
export interface APIResponse<T> {
  data: T;
  metadata: ResponseMetadata;
  error?: null;
}

/**
 * Error response
 */
export interface APIErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
  metadata: ResponseMetadata;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  limit: number;
  offset?: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Chat completion request
 */
export interface ChatCompletionRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  max_completion_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string[];
}

/**
 * Chat completion response
 */
export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: 'assistant';
      content: string;
    };
    finish_reason: 'stop' | 'length' | 'content_filter';
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Text-to-Speech request
 */
export interface TTSRequest {
  model: 'tts-1' | 'tts-1-hd';
  input: string;
  voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  response_format?: 'mp3' | 'opus' | 'aac' | 'flac';
  speed?: number;
}

/**
 * File upload response
 */
export interface FileUploadResponse {
  id: string;
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
  url: string;
}

/**
 * Assessment result response
 */
export interface AssessmentResultResponse {
  id: string;
  userId: string;
  topic: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  recommendations: string[];
  completedAt: Date;
}

/**
 * User profile response
 */
export interface UserProfileResponse {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: {
    language: string;
    theme: 'light' | 'dark';
    notifications: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Request builder for type-safe API calls
 */
export interface RequestBuilder<T> {
  setMethod(method: HTTPMethod): RequestBuilder<T>;
  setHeaders(headers: Record<string, string>): RequestBuilder<T>;
  setBody(body: any): RequestBuilder<T>;
  setTimeout(ms: number): RequestBuilder<T>;
  setRetries(count: number): RequestBuilder<T>;
  addHeader(key: string, value: string): RequestBuilder<T>;
  build(): RequestConfig;
}

/**
 * HTTP client interface
 */
export interface HTTPClient {
  get<T>(url: string, config?: Partial<RequestConfig>): Promise<Result<APIResponse<T>>>;
  post<T>(url: string, body?: any, config?: Partial<RequestConfig>): Promise<Result<APIResponse<T>>>;
  put<T>(url: string, body?: any, config?: Partial<RequestConfig>): Promise<Result<APIResponse<T>>>;
  delete<T>(url: string, config?: Partial<RequestConfig>): Promise<Result<APIResponse<T>>>;
  patch<T>(url: string, body?: any, config?: Partial<RequestConfig>): Promise<Result<APIResponse<T>>>;
}

/**
 * API service interface
 */
export interface APIService {
  // Chat endpoints
  sendMessage(request: ChatCompletionRequest): Promise<Result<ChatCompletionResponse>>;
  
  // TTS endpoints
  generateSpeech(request: TTSRequest): Promise<Result<Blob>>;
  
  // File endpoints
  uploadFile(file: File): Promise<Result<FileUploadResponse>>;
  
  // Assessment endpoints
  submitAssessment(data: any): Promise<Result<AssessmentResultResponse>>;
  
  // User endpoints
  getUserProfile(): Promise<Result<UserProfileResponse>>;
}

/**
 * Interceptor for HTTP requests
 */
export interface RequestInterceptor {
  (config: RequestConfig): RequestConfig | Promise<RequestConfig>;
}

/**
 * Interceptor for HTTP responses
 */
export interface ResponseInterceptor<T> {
  (response: APIResponse<T>): APIResponse<T> | Promise<APIResponse<T>>;
}

/**
 * Interceptor for errors
 */
export interface ErrorInterceptor {
  (error: any): Promise<never>;
}

/**
 * Type-safe query builder
 */
export class QueryBuilder {
  private params: Map<string, any> = new Map();

  /**
   * Add parameter
   */
  addParam(key: string, value: any): this {
    if (value !== null && value !== undefined) {
      this.params.set(key, value);
    }
    return this;
  }

  /**
   * Add multiple parameters
   */
  addParams(params: Record<string, any>): this {
    Object.entries(params).forEach(([key, value]) => {
      this.addParam(key, value);
    });
    return this;
  }

  /**
   * Build query string
   */
  build(): string {
    if (this.params.size === 0) {
      return '';
    }

    const params = new URLSearchParams();
    this.params.forEach((value, key) => {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, String(v)));
      } else {
        params.set(key, String(value));
      }
    });

    return `?${params.toString()}`;
  }
}

/**
 * Safe API call wrapper
 */
export const createSafeAPICall = async <T,>(
  fn: () => Promise<T>,
  errorHandler?: (error: any) => void
): Promise<Result<T>> => {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    errorHandler?.(error);
    return {
      success: false,
      error: {
        name: error instanceof Error ? error.name : 'APIError',
        message: error instanceof Error ? error.message : 'Unknown error',
        code: 'API_CALL_FAILED',
        category: 'api' as const,
        severity: 'medium' as const,
        timestamp: new Date(),
        originalError: error instanceof Error ? error : undefined,
      },
    };
  }
};

export default {
  QueryBuilder,
  createSafeAPICall,
};

