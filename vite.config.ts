import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      __ENV_GROQ_API_KEY__: JSON.stringify(
        env.VITE_GROQ_API_KEY || env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY || ''
      ),
      __ENV_GEMINI_API_KEY__: JSON.stringify(
        env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || ''
      ),
      __ENV_OPENROUTER_API_KEY__: JSON.stringify(
        env.VITE_OPENROUTER_API_KEY || env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY || ''
      ),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

