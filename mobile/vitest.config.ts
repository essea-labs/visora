import { defineConfig } from 'vitest/config';
import path from 'node:path';

// Vitest config — pure-function tests only.
// We do NOT compile/load React Native modules here. Selectors and
// constants files in src/core/constants/ are pure TS and have zero
// RN imports, so they run cleanly in Node.
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
