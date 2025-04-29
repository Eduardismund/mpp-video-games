import {defineConfig} from 'vitest/config';
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  test: {
    globals: true,
    environment: 'jsdom',
    exclude: ['src/main.jsx'],
    include: ['src/__test__/**/*.test.{js,jsx,ts,tsx}'],
    coverage: {
      include: [
        'src/**/*.{js,jsx,ts,tsx}'
      ],
      exclude: [
        'src/main.jsx',
        'src/__test__/**',
      ],
    },
  }
});
