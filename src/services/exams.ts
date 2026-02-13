import { buildMasterApiHeaders, buildMasterApiUrl } from './masterApi';

interface CollectionResponse<T> {
  Items?: T[];
  items?: T[];
  nextPageLink?: string | null;
}

export interface LabResultItem {
  panelId: string;
  personId: string;
  orderId: string;
  resultDescription?: string;
  observationValue?: string | null;
  abnormality?: string | null;
  observationResultStatus?: string;
  units?: string | null;
  referenceRange?: string | null;
  observationDateTime?: string;
  orderCreateTimestamp?: string;
  testDescription?: string;
  ngTestDescription?: string;
  orderStatus?: string;
}

export interface LabOrderItem {
  id: string;
  personId: string;
  testDescription?: string;
  testStatus?: string;
  nextgenStatus?: string;
  orderDate?: string;
  expectedResultDate?: string;
  intrfMessage?: string | null;
}

const DEFAULT_RESULTS_TOP = 500;

export async function fetchLabResultsByPerson(personId: string) {
  const endpoint = buildMasterApiUrl(`/persons/${personId}/chart/lab/results`, {
    $top: DEFAULT_RESULTS_TOP,
  });

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: buildMasterApiHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to load lab results (${response.status})`);
  }

  const payload = (await response.json()) as CollectionResponse<LabResultItem>;
  return payload.Items ?? payload.items ?? [];
}

export async function fetchLabOrdersByPerson(personId: string) {
  const endpoint = buildMasterApiUrl(`/persons/${personId}/chart/lab/orders`);

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: buildMasterApiHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to load lab orders (${response.status})`);
  }

  const payload = (await response.json()) as CollectionResponse<LabOrderItem>;
  return payload.Items ?? payload.items ?? [];
}
