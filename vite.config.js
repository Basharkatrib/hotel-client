import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'

// Plugin to inject environment variables into public/firebase-messaging-sw.js
function injectFirebaseConfigPlugin(env) {
  return {
    name: 'inject-firebase-config',
    // 1. For development (dev server)
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/firebase-messaging-sw.js') {
          const swPath = path.resolve(__dirname, 'public/firebase-messaging-sw.js');
          let content = fs.readFileSync(swPath, 'utf-8');

          // Replace VITE_ strings with env values
          Object.keys(env).forEach(key => {
            if (key.startsWith('VITE_FIREBASE_')) {
              content = content.replace(key, env[key]);
            }
          });

          res.setHeader('Content-Type', 'application/javascript');
          res.end(content);
          return;
        }
        next();
      });
    },
    // 2. For production (after build)
    closeBundle() {
      const swPath = path.resolve(__dirname, 'dist/firebase-messaging-sw.js');
      if (fs.existsSync(swPath)) {
        let content = fs.readFileSync(swPath, 'utf-8');
        Object.keys(env).forEach(key => {
          if (key.startsWith('VITE_FIREBASE_')) {
            content = content.replace(key, env[key]);
          }
        });
        fs.writeFileSync(swPath, content);
        console.log('--- Firebase Config Injected into Service Worker ---');
      }
    }
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      tailwindcss(),
      injectFirebaseConfigPlugin(env)
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
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      },
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
          ws: true,
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
