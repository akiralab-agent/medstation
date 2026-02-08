export interface LocationItem {
  id: string;
  name: string;
  isDeleted: boolean;
  isSchedulable: boolean;
}

interface LocationsResponse {
  items?: LocationItem[];
}

const DEFAULT_API_KEY_HEADER = 'x-api-key';

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const buildHeaders = () => {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

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
};

export async function fetchLocations() {
  const baseUrl = import.meta.env.VITE_MASTER_API_BASE_URL?.trim();
  if (!baseUrl) {
    throw new Error('Missing VITE_MASTER_API_BASE_URL environment variable');
  }

  const endpoint = `${trimTrailingSlash(baseUrl)}/master/locations`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: buildHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to load locations (${response.status})`);
  }

  const payload = (await response.json()) as LocationsResponse;
  const items = payload.items ?? [];

  return items
    .filter((item) => item.isSchedulable && !item.isDeleted)
    .sort((a, b) => a.name.localeCompare(b.name));
}
