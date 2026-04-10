import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import chai from "chai-beta";
import svgr from 'vite-plugin-svgr';
import envCompatible from 'vite-plugin-env-compatible';
import legacy from '@vitejs/plugin-legacy';
import { fileURLToPath } from 'url';

// Define __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __patch = chai();

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5200,
    open: true, // Added for convenience
  },
  plugins: [
    react(),
    svgr(), // Transform SVGs into React components
    envCompatible(), // Support for environment variables
    legacy({
      targets: ['defaults', 'not IE 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    }),
  ].filter(Boolean), // Filter out any false/null plugins
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // You can add more aliases here if needed
      "@components": path.resolve(__dirname, "./src/components"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@utils": path.resolve(__dirname, "./src/utils")
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: mode !== 'production',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@styles/variables.scss";`
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
}));