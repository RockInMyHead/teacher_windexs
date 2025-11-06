/**
 * API Client для запросов через прокси
 * Автоматически использует текущий домен/хост
 */

export const getApiUrl = (path: string): string => {
  const origin = window.location.origin;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${origin}/api${cleanPath}`;
};

export const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = getApiUrl(endpoint);
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  });

  return response;
};

// Специфические методы для основных API
export const chatCompletions = async (body: any): Promise<Response> => {
  return apiCall('/chat/completions', {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

export const imagesGenerations = async (body: any): Promise<Response> => {
  return apiCall('/images/generations', {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

export const audioSpeech = async (body: any): Promise<Response> => {
  return apiCall('/audio/speech', {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

export const listModels = async (): Promise<Response> => {
  return apiCall('/models', {
    method: 'GET',
  });
};

export const health = async (): Promise<Response> => {
  return apiCall('/health', {
    method: 'GET',
  });
};

