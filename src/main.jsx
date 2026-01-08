import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store/store'
import './index.css'
import 'react-toastify/dist/ReactToastify.css'
import App from './App.jsx'

// طلب CSRF cookie قبل تحميل التطبيق (للمصادقة عبر cookies)
// مع Vite proxy، نستخدم المسار النسبي
fetch('/sanctum/csrf-cookie', {
  method: 'GET',
  credentials: 'include',
}).catch((err) => {
  console.warn('Failed to fetch CSRF cookie:', err);
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>,
)
