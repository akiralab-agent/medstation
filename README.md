# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Environment variables

Create a `.env` file based on `.env.example`.

- `VITE_MASTER_API_BASE_URL`: Required. Base URL for the master API (used by `GET /master/locations`).
- `VITE_TELEHEALTH_LOCATION_ID`: Required. Telehealth location ID (hidden from In-person and used for Telemedicine searches).
- `VITE_AVAILABILITY_CATEGORY_ID`: Required. Category ID used in `POST /appointments/availability`.
- `VITE_AVAILABILITY_EVENT_ID`: Required. Event ID used in `POST /appointments/availability`.
- `VITE_MASTER_API_BEARER_TOKEN`: Optional bearer token.
- `VITE_MASTER_API_KEY`: Optional API key.
- `VITE_MASTER_API_KEY_HEADER`: Optional API key header name (default: `x-api-key`).
- `VITE_AVAILABILITY_DURATION_MINUTES`: Optional availability duration (default: `15`).
- `VITE_AVAILABILITY_TIME_RANGE_START`: Optional start time in `HHmm` (default: `0800`).
- `VITE_AVAILABILITY_TIME_RANGE_END`: Optional end time in `HHmm` (default: `1700`).

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
