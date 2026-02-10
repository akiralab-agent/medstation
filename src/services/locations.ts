import { buildMasterApiHeaders, buildMasterApiUrl } from './masterApi';

export interface LocationItem {
  id: string;
  name: string;
  isDeleted: boolean;
  isSchedulable: boolean;
}

interface LocationsResponse {
  items?: LocationItem[];
}

export async function fetchLocations() {
  const endpoint = buildMasterApiUrl('/master/locations');

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: buildMasterApiHeaders(),
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
