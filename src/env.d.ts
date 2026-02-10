/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MASTER_API_BASE_URL?: string;
  readonly VITE_TELEHEALTH_LOCATION_ID?: string;
  readonly VITE_MASTER_API_BEARER_TOKEN?: string;
  readonly VITE_MASTER_API_KEY?: string;
  readonly VITE_MASTER_API_KEY_HEADER?: string;
  readonly VITE_AVAILABILITY_CATEGORY_ID?: string;
  readonly VITE_AVAILABILITY_EVENT_ID?: string;
  readonly VITE_AVAILABILITY_DURATION_MINUTES?: string;
  readonly VITE_AVAILABILITY_TIME_RANGE_START?: string;
  readonly VITE_AVAILABILITY_TIME_RANGE_END?: string;
  readonly VITE_SHOW_SPECIALTY_SELECTOR?: string;
  readonly VITE_PERSON_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
