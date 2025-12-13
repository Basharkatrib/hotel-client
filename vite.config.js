import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Fix for React 19 compatibility issues
      // jsxRuntime is automatic by default in @vitejs/plugin-react v5+
      // Ensure React is properly available to all modules
      babel: {
        plugins: [],
      },
    }), 
    tailwindcss()
  ],
  build: {
    // Use esbuild instead of terser for better React 19 compatibility
    minify: 'esbuild',
    // Code splitting - better chunking strategy
    rollupOptions: {
      // External dependencies that should not be bundled
      external: [],
      output: {
        // Ensure proper chunk loading order
        // React must load before any library that depends on it
        manualChunks: (id) => {
          // React core - ensure React and ReactDOM are together
          // CRITICAL: React must be loaded first, before any library that uses it
          // Include all React-related modules in the same chunk
          if (
            id.includes('node_modules/react') || 
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react/jsx-runtime') ||
            id.includes('node_modules/react/jsx-dev-runtime')
          ) {
            return 'react-vendor';
          }
          // Redux - CRITICAL: All Redux packages must be in the same chunk
          // This fixes the "Cannot set properties of undefined" error
          // IMPORTANT: Keep Redux separate from React to ensure proper loading order
          if (
            id.includes('node_modules/@reduxjs') || 
            id.includes('node_modules/redux') ||
            id.includes('node_modules/react-redux') ||
            id.includes('node_modules/redux-persist') ||
            id.includes('node_modules/use-sync-external-store')
          ) {
            return 'redux-vendor';
          }
          // React Router - depends on React, so keep separate
          if (id.includes('node_modules/react-router')) {
            return 'router-vendor';
          }
          // Swiper - separate chunk for lazy loading
          if (id.includes('node_modules/swiper')) {
            return 'swiper-vendor';
          }
          // Icons - large library
          if (id.includes('node_modules/react-icons')) {
            return 'icons-vendor';
          }
          // Framer Motion
          if (id.includes('node_modules/framer-motion')) {
            return 'motion-vendor';
          }
          // Leaflet/Map
          if (id.includes('node_modules/leaflet') || id.includes('node_modules/react-leaflet')) {
            return 'map-vendor';
          }
          // Form libraries
          if (id.includes('node_modules/formik') || id.includes('node_modules/yup')) {
            return 'form-vendor';
          }
          // Date libraries
          if (id.includes('node_modules/date-fns') || id.includes('node_modules/react-datepicker')) {
            return 'date-vendor';
          }
          // Stripe
          if (id.includes('node_modules/@stripe')) {
            return 'stripe-vendor';
          }
          // Other node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        // Optimize chunk file names
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'css/[name]-[hash][extname]';
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return 'images/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 500,
    // Enable source maps in production for debugging (can disable later)
    sourcemap: true, // Change to false after fixing the issue
    // Target modern browsers for smaller bundles
    target: 'es2020', // Updated for better React 19 support
    // CommonJS options
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react-router-dom',
      'react-redux',
      '@reduxjs/toolkit',
      'redux-persist',
      'use-sync-external-store',
    ],
    exclude: ['swiper'], // Exclude swiper to force lazy loading
    // Force pre-bundling for React 19
    esbuildOptions: {
      target: 'es2020',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    // Ensure proper module resolution
    dedupe: ['react', 'react-dom'],
  },
  // Performance optimizations
  server: {
    hmr: {
      overlay: false,
    },
  },
})
