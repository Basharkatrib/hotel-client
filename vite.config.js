import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Optimize build
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
    },
    // Code splitting - better chunking strategy
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React core
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-vendor';
          }
          // React Router
          if (id.includes('node_modules/react-router')) {
            return 'router-vendor';
          }
          // Redux
          if (id.includes('node_modules/@reduxjs') || id.includes('node_modules/redux')) {
            return 'redux-vendor';
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
    // Enable source maps only in dev
    sourcemap: false,
    // Target modern browsers for smaller bundles
    target: 'es2015',
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-redux',
      '@reduxjs/toolkit',
    ],
    exclude: ['swiper'], // Exclude swiper to force lazy loading
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // Performance optimizations
  server: {
    hmr: {
      overlay: false,
    },
  },
})
