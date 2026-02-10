import { buildMasterApiHeaders, buildMasterApiUrl } from './masterApi';

export interface PersonResponse {
  id: string;
  personNumber?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  cellPhone?: string;
  homePhone?: string;
  phone?: string;
  dateOfBirth?: string;
  sex?: string;
  age?: number;
  addressLine1?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export async function fetchPerson(personId: string) {
  const endpoint = buildMasterApiUrl(`/persons/${personId}`);

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: buildMasterApiHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to load person (${response.status})`);
  }

  return (await response.json()) as PersonResponse;
}
