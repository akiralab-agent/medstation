const DEFAULT_API_KEY_HEADER = 'x-api-key';

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

export function getMasterApiBaseUrl() {
  const baseUrl = import.meta.env.VITE_MASTER_API_BASE_URL?.trim();
  if (!baseUrl) {
    throw new Error('Missing VITE_MASTER_API_BASE_URL environment variable');
  }

  return trimTrailingSlash(baseUrl);
}

export function buildMasterApiHeaders(contentType?: string) {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (contentType) {
    headers['Content-Type'] = contentType;
  }

  const bearerToken = import.meta.env.VITE_MASTER_API_BEARER_TOKEN?.trim();
  if (bearerToken) {
    headers.Authorization = `Bearer ${bearerToken}`;
  }

  const apiKey = import.meta.env.VITE_MASTER_API_KEY?.trim();
  if (apiKey) {
    const apiKeyHeader = import.meta.env.VITE_MASTER_API_KEY_HEADER?.trim() || DEFAULT_API_KEY_HEADER;
    headers[apiKeyHeader] = apiKey;
  }

  return headers;
}

export function buildMasterApiUrl(path: string, query?: Record<string, string | number | null | undefined>) {
  const url = new URL(path.replace(/^\/+/, ''), `${getMasterApiBaseUrl()}/`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        return;
      }
      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
}
