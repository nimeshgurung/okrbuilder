# OKR Builder Frontend

A React-based frontend for the AI-Powered OKR Builder application.

## Features

- **Interactive OKR Management**: Create, edit, and track Objectives and Key Results
- **Real-time Progress Tracking**: Visual progress bars and completion indicators
- **Material UI Design**: Clean, professional interface with responsive design
- **CopilotKit Integration**: AI-powered assistance for OKR creation and management

## Components

- **OKRBuilder**: Main container component with state management
- **ObjectiveCard**: Individual objective display with expandable key results
- **KeyResultItem**: Editable key result with progress tracking

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Make sure the backend is running on `http://localhost:4000`

## Technologies Used

- React 19 with TypeScript
- Material UI for components and theming
- CopilotKit for AI integration
- Vite for build tooling

## Project Structure

```
src/
├── components/
│   ├── OKRBuilder.tsx      # Main OKR management component
│   ├── ObjectiveCard.tsx   # Individual objective display
│   ├── KeyResultItem.tsx   # Key result editing component
│   └── index.ts           # Component exports
├── App.tsx                # Main app with theme and CopilotKit setup
└── main.tsx              # React app entry point
```

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
