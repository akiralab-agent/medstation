import { getMasterApiBaseUrl } from './masterApi';

type HttpMethod = 'GET' | 'POST';

type QueryValue = string | number | boolean | null | undefined;

interface MedcardRequestOptions {
  method?: HttpMethod;
  token?: string;
  body?: unknown;
  query?: Record<string, QueryValue>;
}

export interface MedcardPayload {
  success?: boolean;
  data?: unknown;
  message?: string;
  detail?: string;
  [key: string]: unknown;
}

export interface MedcardSearchCardsParams {
  personName?: string;
  cardNumber?: string;
  limit?: number;
}

export interface MedcardPeopleParams {
  page?: number;
  limit?: number;
}

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const pickString = (record: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }

  return undefined;
};

export function getMedcardApiBaseUrl() {
  const explicitBaseUrl = import.meta.env.VITE_MEDCARD_API_BASE_URL?.trim();
  if (explicitBaseUrl) {
    return trimTrailingSlash(explicitBaseUrl);
  }

  return getMasterApiBaseUrl();
}

function getDefaultMedcardToken() {
  const medcardToken = import.meta.env.VITE_MEDCARD_BEARER_TOKEN?.trim();
  if (medcardToken) {
    return medcardToken;
  }

  return import.meta.env.VITE_MASTER_API_BEARER_TOKEN?.trim();
}

function resolveMedcardToken(token?: string) {
  const resolvedToken = token?.trim() || getDefaultMedcardToken();
  if (!resolvedToken) {
    throw new Error('Missing MedCard bearer token. Set VITE_MEDCARD_BEARER_TOKEN or pass token explicitly.');
  }

  return resolvedToken;
}

function buildMedcardUrl(path: string, query?: Record<string, QueryValue>) {
  const normalizedPath = path.replace(/^\/+/, '');
  const url = new URL(`medcard/${normalizedPath}`, `${getMedcardApiBaseUrl()}/`);

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

async function medcardRequest<T extends MedcardPayload>(path: string, options: MedcardRequestOptions = {}) {
  const method = options.method ?? 'GET';
  const endpoint = buildMedcardUrl(path, options.query);
  const headers: Record<string, string> = {
    Accept: 'application/json',
    Authorization: `Bearer ${resolveMedcardToken(options.token)}`,
  };

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(endpoint, {
    method,
    headers,
    ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
  });

  const rawBody = await response.text();
  let parsedBody: unknown = {};

  if (rawBody.trim()) {
    try {
      parsedBody = JSON.parse(rawBody) as unknown;
    } catch {
      parsedBody = rawBody;
    }
  }

  if (!response.ok) {
    if (isRecord(parsedBody)) {
      const message = pickString(parsedBody, ['detail', 'message', 'error']);
      if (message) {
        throw new Error(message);
      }
    }

    if (typeof parsedBody === 'string' && parsedBody.trim()) {
      throw new Error(parsedBody);
    }

    throw new Error(`MedCard request failed (${response.status})`);
  }

  if (isRecord(parsedBody) && parsedBody.success === false) {
    throw new Error(parsedBody.message?.toString() || 'Erro retornado pela MedCard');
  }

  return parsedBody as T;
}

export const medcardApi = {
  searchCards: (params: MedcardSearchCardsParams = {}, token?: string) =>
    medcardRequest<MedcardPayload>('cards/search', {
      token,
      query: {
        personName: params.personName,
        cardNumber: params.cardNumber,
        limit: params.limit,
      },
    }),

  getCardDetails: (cardNumber: string, token?: string) =>
    medcardRequest<MedcardPayload>(`cards/${cardNumber}`, {
      token,
    }),

  getPeople: (params: MedcardPeopleParams = {}, token?: string) =>
    medcardRequest<MedcardPayload>('people', {
      token,
      query: {
        page: params.page,
        limit: params.limit,
      },
    }),

  getSubscriptionProducts: (token?: string) =>
    medcardRequest<MedcardPayload>('products/subscriptions', {
      token,
    }),

  getSubscriptionProductDetails: (subscriptionId: string, token?: string) =>
    medcardRequest<MedcardPayload>(`products/subscriptions/${subscriptionId}`, {
      token,
    }),

  requestPaymentLink: (payload: Record<string, unknown>, token?: string) =>
    medcardRequest<MedcardPayload>('payment/requestPaymentLink', {
      method: 'POST',
      token,
      body: payload,
    }),

  getEnvironmentInfo: (token?: string) =>
    medcardRequest<MedcardPayload>('system/env', {
      token,
    }),
};
