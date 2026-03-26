import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite keeps the React frontend fast and simple to run during development.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
});
