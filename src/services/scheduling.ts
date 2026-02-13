import { buildMasterApiHeaders, buildMasterApiUrl } from './masterApi';

export interface ResourceItem {
  id: string;
  resourceDisplayName: string;
  isDeleted: boolean;
}

interface ResourcesResponse {
  Items?: ResourceItem[];
  items?: ResourceItem[];
}

export interface ResourceFilters {
  city?: string;
  state?: string;
  address?: string;
  locationId?: string;
  resourceId?: string;
  top?: number;
}

export interface AvailabilitySlot {
  resourceId: string;
  startDateTime: string;
  resourceName?: string;
}

interface AvailabilityRequest {
  date: Date;
  locationIds: string[];
  resourceIds: string[];
  mode?: 'inperson' | 'telemedicine';
}

type AvailabilityMode = 'inperson' | 'telemedicine';

const DEFAULT_TOP = 1000;
const DEFAULT_DURATION_MINUTES = 15;
const DEFAULT_TIME_RANGE_START = '0800';
const DEFAULT_TIME_RANGE_END = '1700';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const toLocalDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getRequiredAvailabilityEnv = (key: keyof ImportMetaEnv, fallbackKey?: keyof ImportMetaEnv) => {
  const value = import.meta.env[key]?.trim();
  if (value) {
    return value;
  }

  if (fallbackKey) {
    const fallbackValue = import.meta.env[fallbackKey]?.trim();
    if (fallbackValue) {
      return fallbackValue;
    }
  }

  const fallbackHint = fallbackKey ? ` or ${fallbackKey}` : '';
  throw new Error(`Missing ${key}${fallbackHint} environment variable`);
};

const getAvailabilityModeConfig = (mode: AvailabilityMode) => {
  if (mode === 'telemedicine') {
    return {
      categoryId: getRequiredAvailabilityEnv(
        'VITE_AVAILABILITY_TELEHEALTH_CATEGORY_ID',
        'VITE_AVAILABILITY_CATEGORY_ID'
      ),
      eventId: getRequiredAvailabilityEnv(
        'VITE_AVAILABILITY_TELEHEALTH_EVENT_ID',
        'VITE_AVAILABILITY_EVENT_ID'
      ),
    };
  }

  return {
    categoryId: getRequiredAvailabilityEnv(
      'VITE_AVAILABILITY_INPERSON_CATEGORY_ID',
      'VITE_AVAILABILITY_CATEGORY_ID'
    ),
    eventId: getRequiredAvailabilityEnv(
      'VITE_AVAILABILITY_INPERSON_EVENT_ID',
      'VITE_AVAILABILITY_EVENT_ID'
    ),
  };
};

const getAvailabilityConfig = (mode: AvailabilityMode) => ({
  ...getAvailabilityModeConfig(mode),
  durationMinutes: Number(import.meta.env.VITE_AVAILABILITY_DURATION_MINUTES || DEFAULT_DURATION_MINUTES),
  timeRangeStart: import.meta.env.VITE_AVAILABILITY_TIME_RANGE_START?.trim() || DEFAULT_TIME_RANGE_START,
  timeRangeEnd: import.meta.env.VITE_AVAILABILITY_TIME_RANGE_END?.trim() || DEFAULT_TIME_RANGE_END,
});

const pickString = (record: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }

  return undefined;
};

const pickNumber = (record: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return undefined;
};

const pickStringArray = (record: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = record[key];
    if (!Array.isArray(value)) {
      continue;
    }

    const items = value
      .filter((entry): entry is string => typeof entry === 'string')
      .map((entry) => entry.trim())
      .filter(Boolean);

    if (items.length > 0) {
      return items;
    }
  }

  return [];
};

const normalizeDateAndTime = (dateValue: string, timeValue: string) => {
  if (!dateValue.trim() || !timeValue.trim()) {
    return undefined;
  }

  const cleanDate = dateValue.trim();
  const cleanTime = timeValue.trim();

  if (/^\d{4}$/.test(cleanTime)) {
    return `${cleanDate}T${cleanTime.slice(0, 2)}:${cleanTime.slice(2, 4)}:00`;
  }

  if (/^\d{2}:\d{2}$/.test(cleanTime)) {
    return `${cleanDate}T${cleanTime}:00`;
  }

  if (/^\d{2}:\d{2}:\d{2}$/.test(cleanTime)) {
    return `${cleanDate}T${cleanTime}`;
  }

  return undefined;
};

const getItemsCollection = (payload: unknown) => {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (!isRecord(payload)) {
    return [];
  }
  const items = payload.Items ?? payload.items ?? payload.Slots ?? payload.slots;
  return Array.isArray(items) ? items : [];
};

const normalizeId = (value: string) => value.trim().toLowerCase();

const mapAvailabilitySlots = (item: unknown): AvailabilitySlot[] => {
  if (!isRecord(item)) {
    return [];
  }

  const appointmentCount = pickNumber(item, ['appointmentCount', 'AppointmentCount']);
  if (appointmentCount !== undefined && appointmentCount > 0) {
    return [];
  }

  const resourceIds = pickStringArray(item, ['resourceIds', 'ResourceIds']);
  const resourceNames = pickStringArray(item, ['resourceNames', 'ResourceNames']);
  if (resourceIds.length === 0) {
    const resourceId = pickString(item, ['resourceId', 'ResourceId']);
    if (resourceId) {
      resourceIds.push(resourceId);
    }
  }

  if (resourceIds.length === 0) {
    const resourceValue = item.resource ?? item.Resource;
    if (isRecord(resourceValue)) {
      const resourceId = pickString(resourceValue, ['id', 'Id']);
      if (resourceId) {
        resourceIds.push(resourceId);
      }
    }
  }

  let startDateTime = pickString(item, [
    'appointmentDateTime',
    'AppointmentDateTime',
    'startDateTime',
    'StartDateTime',
    'dateTime',
    'DateTime',
    'start',
    'Start',
  ]);

  if (!startDateTime) {
    const dateValue = pickString(item, ['date', 'Date']);
    const timeValue = pickString(item, ['time', 'Time', 'startTime', 'StartTime']);
    if (dateValue && timeValue) {
      startDateTime = normalizeDateAndTime(dateValue, timeValue);
    }
  }

  if (resourceIds.length === 0 || !startDateTime) {
    return [];
  }

  return resourceIds.map((resourceId, index) => {
    const resourceName = resourceNames[index] || resourceNames[0];
    return {
      resourceId: normalizeId(resourceId),
      startDateTime,
      resourceName,
    };
  });
};

export async function fetchResourcesByLocation(filters: ResourceFilters) {
  const endpoint = buildMasterApiUrl('/resources/by-location', {
    city: filters.city,
    state: filters.state,
    address: filters.address,
    locationId: filters.locationId,
    resourceId: filters.resourceId,
    top: filters.top ?? DEFAULT_TOP,
  });

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: buildMasterApiHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to load resources (${response.status})`);
  }

  const payload = (await response.json()) as ResourcesResponse;
  const items = payload.Items ?? payload.items ?? [];

  return items
    .filter((item) => !item.isDeleted)
    .sort((a, b) => a.resourceDisplayName.localeCompare(b.resourceDisplayName));
}

export async function fetchAvailabilityForDate(request: AvailabilityRequest) {
  if (request.locationIds.length === 0 || request.resourceIds.length === 0) {
    return [] as AvailabilitySlot[];
  }

  const mode: AvailabilityMode = request.mode === 'telemedicine' ? 'telemedicine' : 'inperson';
  const config = getAvailabilityConfig(mode);
  const date = toLocalDate(request.date);

  const payload = {
    CategoryId: config.categoryId,
    DateRangeEnd: `${date}T23:59:59`,
    DateRangeStart: `${date}T00:00:00`,
    DaysOfWeek: [1, 2, 3, 4, 5, 6, 7],
    DurationMinutes: config.durationMinutes,
    EventId: config.eventId,
    GroupResourcesBySlot: false,
    LocationIds: request.locationIds,
    ResourceIds: request.resourceIds,
    RestrictResultsBy: 0,
    TimeRangeEnd: config.timeRangeEnd,
    TimeRangeStart: config.timeRangeStart,
  };

  const response = await fetch(buildMasterApiUrl('/appointments/availability'), {
    method: 'POST',
    headers: buildMasterApiHeaders('application/json'),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to load availability (${response.status})`);
  }

  const rawPayload = (await response.json()) as unknown;
  const rawSlots = getItemsCollection(rawPayload);

  const parsedSlots = rawSlots
    .flatMap(mapAvailabilitySlots)
    .sort((a, b) => a.startDateTime.localeCompare(b.startDateTime));

  const seen = new Set<string>();
  const uniqueSlots = parsedSlots.filter((slot) => {
    const key = `${normalizeId(slot.resourceId)}|${slot.startDateTime}`;
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });

  return uniqueSlots;
}
