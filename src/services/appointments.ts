import { buildMasterApiHeaders, getMasterApiBaseUrl } from './masterApi';

export interface AppointmentItem {
  id: string;
  personId?: string;
  appointmentDateTime?: string;
  appointmentDate?: string;
  beginTime?: string;
  endTime?: string;
  locationName?: string;
  resourceName?: string;
  resourceDisplayName?: string | null;
  eventName?: string;
  status?: string;
  workflowStatus?: string;
  isTelemedicine?: boolean;
  virtualVisitLink?: string | null;
  renderingProviderFirstName?: string;
  renderingProviderMiddleName?: string;
  renderingProviderLastName?: string;
  [key: string]: unknown;
}

interface AppointmentsResponse {
  Items?: AppointmentItem[];
  items?: AppointmentItem[];
}

interface AppointmentResponse extends Partial<AppointmentItem> {
  Item?: AppointmentItem;
}

export async function fetchAppointmentsByPerson(personId: string) {
  const baseUrl = getMasterApiBaseUrl();
  const filter = encodeURIComponent(`PersonId eq guid'${personId}'`);
  const url = `${baseUrl}/appointments?${encodeURIComponent('$filter')}=${filter}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: buildMasterApiHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to load appointments (${response.status})`);
  }

  const payload = (await response.json()) as AppointmentsResponse;
  return payload.Items ?? payload.items ?? [];
}

export async function fetchAppointmentById(appointmentId: string, personId?: string) {
  const baseUrl = getMasterApiBaseUrl();
  const detailUrl = `${baseUrl}/appointments/${appointmentId}`;

  const detailResponse = await fetch(detailUrl, {
    method: 'GET',
    headers: buildMasterApiHeaders(),
  });

  if (detailResponse.ok) {
    const payload = (await detailResponse.json()) as AppointmentResponse;
    return payload.Item ?? (payload as AppointmentItem);
  }

  const filters = [`Id eq guid'${appointmentId}'`];
  if (personId) {
    filters.push(`PersonId eq guid'${personId}'`);
  }
  const filter = encodeURIComponent(filters.join(' and '));
  const fallbackUrl = `${baseUrl}/appointments?${encodeURIComponent('$filter')}=${filter}`;

  const fallbackResponse = await fetch(fallbackUrl, {
    method: 'GET',
    headers: buildMasterApiHeaders(),
  });

  if (!fallbackResponse.ok) {
    throw new Error(`Failed to load appointment (${fallbackResponse.status})`);
  }

  const fallbackPayload = (await fallbackResponse.json()) as AppointmentsResponse;
  const items = fallbackPayload.Items ?? fallbackPayload.items ?? [];
  return items[0] ?? null;
}
