/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MASTER_API_BASE_URL?: string;
  readonly VITE_MEDCARD_API_BASE_URL?: string;
  readonly VITE_TELEHEALTH_LOCATION_ID?: string;
  readonly VITE_MASTER_API_BEARER_TOKEN?: string;
  readonly VITE_MEDCARD_BEARER_TOKEN?: string;
  readonly VITE_MASTER_API_KEY?: string;
  readonly VITE_MASTER_API_KEY_HEADER?: string;
  readonly VITE_PAYMENT_PROCEDURE_CODE?: string;
  readonly VITE_INSTAMED_PAYMENTS_PATH?: string;
  readonly VITE_INSTAMED_CORPORATE_ID?: string;
  readonly VITE_INSTAMED_ENVIRONMENT?: string;
  readonly VITE_INSTAMED_DISPLAY_MODE?: string;
  readonly VITE_INSTAMED_MOBILE_DISPLAY_MODE?: string;
  readonly VITE_INSTAMED_ADD_CARD_EMAIL?: string;
  readonly VITE_INSTAMED_ADD_CARD_WIDTH?: string;
  readonly VITE_INSTAMED_ADD_CARD_HEIGHT?: string;
  readonly VITE_INSTAMED_JQUERY_URL?: string;
  readonly VITE_INSTAMED_TOKEN_SCRIPT_URL?: string;
  readonly VITE_INSTAMED_HELPER_SCRIPT_URL?: string;
  readonly VITE_AVAILABILITY_CATEGORY_ID?: string;
  readonly VITE_AVAILABILITY_EVENT_ID?: string;
  readonly VITE_AVAILABILITY_DURATION_MINUTES?: string;
  readonly VITE_AVAILABILITY_TIME_RANGE_START?: string;
  readonly VITE_AVAILABILITY_TIME_RANGE_END?: string;
  readonly VITE_SHOW_SPECIALTY_SELECTOR?: string;
  readonly VITE_FEATURE_HEALTH_PAGE_ENABLED?: string;
  readonly VITE_FEATURE_HEALTH_INSURANCE_ENABLED?: string;
  readonly VITE_FEATURE_CARE_CREDIT_ENABLED?: string;
  readonly VITE_FEATURE_PROFILE_MY_PROGRAMS_ENABLED?: string;
  readonly VITE_FEATURE_PROFILE_DASHBOARD_SETTINGS_ENABLED?: string;
  readonly VITE_FEATURE_PROFILE_CONFIRM_IDENTITY_ENABLED?: string;
  readonly VITE_FEATURE_PROFILE_CHANGE_PASSWORD_ENABLED?: string;
  readonly VITE_FEATURE_PROFILE_TERMS_OF_USE_ENABLED?: string;
  readonly VITE_FEATURE_PROFILE_DELETE_ACCOUNT_ENABLED?: string;
  readonly VITE_FEATURE_PROFILE_NOTIFICATIONS_ENABLED?: string;
  readonly VITE_FEATURE_PROFILE_PERSONAL_DATA_READ_ONLY_ENABLED?: string;
  readonly VITE_FEATURE_USER_MENU_SETTINGS_ENABLED?: string;
  readonly VITE_PERSON_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
