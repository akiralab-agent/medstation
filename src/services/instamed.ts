import { buildMasterApiHeaders, buildMasterApiUrl } from './masterApi';

export interface CreateInstamedPaymentPayload {
  token: string;
  expiration: string;
  cvn: string;
  amount: number;
  currency: string;
  description?: string;
  person_id?: string | null;
  external_reference?: string | null;
}

export interface CreateInstamedPaymentResponse {
  transaction_id?: string;
  status?: string;
  detail?: string;
  message?: string;
  [key: string]: unknown;
}

const DEFAULT_INSTAMED_PAYMENTS_PATH = '/instamed/payments';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const getInstamedPaymentsEndpoint = () => {
  const pathOrUrl = import.meta.env.VITE_INSTAMED_PAYMENTS_PATH?.trim() || DEFAULT_INSTAMED_PAYMENTS_PATH;
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  return buildMasterApiUrl(pathOrUrl);
};

export async function createInstamedPayment(payload: CreateInstamedPaymentPayload) {
  const response = await fetch(getInstamedPaymentsEndpoint(), {
    method: 'POST',
    headers: buildMasterApiHeaders('application/json'),
    body: JSON.stringify(payload),
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
      const detail = parsedBody.detail || parsedBody.message;
      if (typeof detail === 'string' && detail.trim()) {
        throw new Error(detail);
      }
    }

    if (typeof parsedBody === 'string' && parsedBody.trim()) {
      throw new Error(parsedBody);
    }

    throw new Error(`Failed to create InstaMed payment (${response.status})`);
  }

  return (isRecord(parsedBody) ? parsedBody : {}) as CreateInstamedPaymentResponse;
}
