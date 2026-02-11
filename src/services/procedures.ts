import { buildMasterApiHeaders, buildMasterApiUrl } from './masterApi';

interface ProcedureItem {
  serviceItemId?: string;
  code?: string;
  description?: string;
  currentPrice?: number | string | null;
  currentPriceFacility?: number | string | null;
  isDeleted?: boolean;
}

interface ProceduresResponse {
  items?: ProcedureItem[];
}

export interface ProcedurePrice {
  amount: number;
  code: string;
  description?: string;
}

const DEFAULT_PAYMENT_PROCEDURE_CODE = '99214';

const toValidNumber = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
};

const normalizeCode = (value: string | undefined) => value?.trim().toUpperCase() ?? '';

const getProcedureCodeFromEnv = () =>
  normalizeCode(import.meta.env.VITE_PAYMENT_PROCEDURE_CODE?.trim()) || DEFAULT_PAYMENT_PROCEDURE_CODE;

export async function fetchProcedurePrice() {
  const endpoint = buildMasterApiUrl('/master/procedures');
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: buildMasterApiHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to load procedures (${response.status})`);
  }

  const payload = (await response.json()) as ProceduresResponse;
  const items = payload.items ?? [];
  const procedureCode = getProcedureCodeFromEnv();

  const activeItems = items.filter((item) => !item.isDeleted);
  const selectedItem =
    activeItems.find((item) => {
      const itemCode = normalizeCode(item.code);
      const itemServiceId = normalizeCode(item.serviceItemId);
      return itemCode === procedureCode || itemServiceId === procedureCode;
    }) ?? activeItems[0];

  if (!selectedItem) {
    throw new Error('No procedures available');
  }

  const amount =
    toValidNumber(selectedItem.currentPrice) ?? toValidNumber(selectedItem.currentPriceFacility);

  if (amount === undefined) {
    throw new Error('Procedure price is unavailable');
  }

  return {
    amount,
    code: normalizeCode(selectedItem.code) || normalizeCode(selectedItem.serviceItemId) || procedureCode,
    description: selectedItem.description,
  } as ProcedurePrice;
}
