import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      dedupe: ['react', 'react-dom'],
    },
    build: {
      sourcemap: false,
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
          ws: true,
          configure: (proxy, _options) => {
            proxy.on('proxyRes', (proxyRes, req, res) => {
              // تعديل cookies لتكون متوافقة مع localhost
              const setCookieHeaders = proxyRes.headers['set-cookie'];
              if (setCookieHeaders) {
                proxyRes.headers['set-cookie'] = setCookieHeaders.map(cookie => {
                  // إزالة Domain attribute أو تعديله إلى localhost
                  let modified = cookie.replace(/Domain=[^;]+/gi, '');
                  // التأكد من SameSite=Lax
                  if (!modified.includes('SameSite')) {
                    modified += '; SameSite=Lax';
                  } else {
                    modified = modified.replace(/SameSite=None/gi, 'SameSite=Lax');
                  }
                  return modified;
                });
              }
            });
          },
        },
        '/sanctum': {
          target: env.VITE_API_URL || 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
          configure: (proxy, _options) => {
            proxy.on('proxyRes', (proxyRes, req, res) => {
              const setCookieHeaders = proxyRes.headers['set-cookie'];
              if (setCookieHeaders) {
                proxyRes.headers['set-cookie'] = setCookieHeaders.map(cookie => {
                  let modified = cookie.replace(/Domain=[^;]+/gi, '');
                  if (!modified.includes('SameSite')) {
                    modified += '; SameSite=Lax';
                  } else {
                    modified = modified.replace(/SameSite=None/gi, 'SameSite=Lax');
                  }
                  return modified;
                });
              }
            });
          },
        },
      },
    },
  }
})
