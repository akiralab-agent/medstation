import { buildMasterApiHeaders, getMasterApiBaseUrl } from './masterApi';

export interface AppointmentItem {
  id: string;
  personId?: string;
  appointmentDateTime?: string;
  locationName?: string;
  resourceName?: string;
  eventName?: string;
  status?: string;
  isTelemedicine?: boolean;
  [key: string]: unknown;
}

interface AppointmentsResponse {
  Items?: AppointmentItem[];
  items?: AppointmentItem[];
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
