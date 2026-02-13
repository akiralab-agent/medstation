# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Environment variables

Create a `.env` file based on `.env.example`.

- `VITE_MASTER_API_BASE_URL`: Required. Base URL for the master API (used by `GET /master/locations`).
- `VITE_MEDCARD_API_BASE_URL`: Optional. Base URL override for MedCard routes. Defaults to `VITE_MASTER_API_BASE_URL`.
- `VITE_TELEHEALTH_LOCATION_ID`: Required. Telehealth location ID (hidden from In-person and used for Telemedicine searches).
- `VITE_AVAILABILITY_CATEGORY_ID`: Required. Category ID used in `POST /appointments/availability`.
- `VITE_AVAILABILITY_EVENT_ID`: Required. Event ID used in `POST /appointments/availability`.
- `VITE_MASTER_API_BEARER_TOKEN`: Optional bearer token.
- `VITE_MEDCARD_BEARER_TOKEN`: Optional MedCard bearer token. Defaults to `VITE_MASTER_API_BEARER_TOKEN`.
- `VITE_MASTER_API_KEY`: Optional API key.
- `VITE_MASTER_API_KEY_HEADER`: Optional API key header name (default: `x-api-key`).
- `VITE_PAYMENT_PROCEDURE_CODE`: Optional procedure code used to resolve the payment amount from `GET /master/procedures` (default: `99214`).
- `VITE_INSTAMED_PAYMENTS_PATH`: Optional path or absolute URL for `POST` payment creation (default: `/instamed/payments`).
- `VITE_INSTAMED_CORPORATE_ID`: Required for InstaMed Secure Token.
- `VITE_INSTAMED_ENVIRONMENT`: Optional InstaMed script environment (default: `UAT`).
- `VITE_INSTAMED_DISPLAY_MODE`: Optional script display mode (default: `incontext`).
- `VITE_INSTAMED_MOBILE_DISPLAY_MODE`: Optional mobile display mode (default: `incontext`).
- `VITE_INSTAMED_ADD_CARD_EMAIL`: Optional email sent to `addCard(...)` (default: `imqa@instamed.net`).
- `VITE_INSTAMED_ADD_CARD_WIDTH`: Optional card popup width (default: `400`).
- `VITE_INSTAMED_ADD_CARD_HEIGHT`: Optional card popup height (default: `600`).
- `VITE_INSTAMED_JQUERY_URL`: Optional jQuery script URL used by InstaMed helper.
- `VITE_INSTAMED_TOKEN_SCRIPT_URL`: Optional InstaMed token script URL.
- `VITE_INSTAMED_HELPER_SCRIPT_URL`: Optional InstaMed helper script URL.
- `VITE_AVAILABILITY_DURATION_MINUTES`: Optional availability duration (default: `15`).
- `VITE_AVAILABILITY_TIME_RANGE_START`: Optional start time in `HHmm` (default: `0800`).
- `VITE_AVAILABILITY_TIME_RANGE_END`: Optional end time in `HHmm` (default: `1700`).
- `VITE_FEATURE_HEALTH_PAGE_ENABLED`: Optional feature flag for Health page/menu/route (default: `false`).
- `VITE_FEATURE_HEALTH_INSURANCE_ENABLED`: Optional feature flag for Health Insurance service type (default: `false`).
- `VITE_FEATURE_CARE_CREDIT_ENABLED`: Optional feature flag for Care Credit payment option (default: `false`).
- `VITE_FEATURE_PROFILE_MY_PROGRAMS_ENABLED`: Optional feature flag for Profile -> My Programs item/route (default: `false`).
- `VITE_FEATURE_PROFILE_DASHBOARD_SETTINGS_ENABLED`: Optional feature flag for Profile -> Dashboard Settings item/route (default: `false`).
- `VITE_FEATURE_PROFILE_CONFIRM_IDENTITY_ENABLED`: Optional feature flag for Profile -> Confirm Identity item/route (default: `false`).
- `VITE_FEATURE_PROFILE_CHANGE_PASSWORD_ENABLED`: Optional feature flag for Profile -> Change Password item/route (default: `false`).
- `VITE_FEATURE_PROFILE_TERMS_OF_USE_ENABLED`: Optional feature flag for Profile -> Term of Use item/route (default: `false`).
- `VITE_FEATURE_PROFILE_DELETE_ACCOUNT_ENABLED`: Optional feature flag for Profile -> Delete Account item/route (default: `false`).
- `VITE_FEATURE_PROFILE_NOTIFICATIONS_ENABLED`: Optional feature flag for Profile -> Notifications item/route (default: `false`).
- `VITE_FEATURE_PROFILE_PERSONAL_DATA_READ_ONLY_ENABLED`: Optional feature flag for Profile -> Personal Data read-only mode (hides save button) (default: `true`).
- `VITE_FEATURE_USER_MENU_SETTINGS_ENABLED`: Optional feature flag for Navbar user menu -> Settings item (default: `false`).

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
