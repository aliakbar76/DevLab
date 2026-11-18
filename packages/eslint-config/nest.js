import globals from 'globals';
import { baseConfig } from './base.js';

/** @type {import('eslint').Linter.Config[]} */
export const nestConfig = [
  ...baseConfig,
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Nest DI relies on runtime class references preserved by emitDecoratorMetadata.
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
];
