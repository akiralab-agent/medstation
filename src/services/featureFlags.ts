const isEnabled = (value: string | undefined) => value?.trim().toLowerCase() === 'true';

export const isCareCreditEnabled = () =>
  isEnabled(import.meta.env.VITE_FEATURE_CARE_CREDIT_ENABLED);

export const isHealthInsuranceEnabled = () =>
  isEnabled(import.meta.env.VITE_FEATURE_HEALTH_INSURANCE_ENABLED);

export const isHealthPageEnabled = () =>
  isEnabled(import.meta.env.VITE_FEATURE_HEALTH_PAGE_ENABLED);

export const isProfileMyProgramsEnabled = () =>
  isEnabled(import.meta.env.VITE_FEATURE_PROFILE_MY_PROGRAMS_ENABLED);

export const isProfileDashboardSettingsEnabled = () =>
  isEnabled(import.meta.env.VITE_FEATURE_PROFILE_DASHBOARD_SETTINGS_ENABLED);

export const isProfileConfirmIdentityEnabled = () =>
  isEnabled(import.meta.env.VITE_FEATURE_PROFILE_CONFIRM_IDENTITY_ENABLED);

export const isProfileChangePasswordEnabled = () =>
  isEnabled(import.meta.env.VITE_FEATURE_PROFILE_CHANGE_PASSWORD_ENABLED);

export const isProfileTermsOfUseEnabled = () =>
  isEnabled(import.meta.env.VITE_FEATURE_PROFILE_TERMS_OF_USE_ENABLED);

export const isProfileDeleteAccountEnabled = () =>
  isEnabled(import.meta.env.VITE_FEATURE_PROFILE_DELETE_ACCOUNT_ENABLED);

export const isProfileNotificationsEnabled = () =>
  isEnabled(import.meta.env.VITE_FEATURE_PROFILE_NOTIFICATIONS_ENABLED);

export const isProfilePersonalDataReadOnlyEnabled = () =>
  isEnabled(import.meta.env.VITE_FEATURE_PROFILE_PERSONAL_DATA_READ_ONLY_ENABLED);

export const isUserMenuSettingsEnabled = () =>
  isEnabled(import.meta.env.VITE_FEATURE_USER_MENU_SETTINGS_ENABLED);
