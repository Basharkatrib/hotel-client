import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage
import { combineReducers } from '@reduxjs/toolkit';
import { api } from '../services/api';
import '../services/hotelsApi';
import '../services/bookingsApi';
import '../services/paymentsApi';
import '../services/favoritesApi';
import '../services/reviewsApi';
import '../services/partnerApi';
import authReducer from './slices/authSlice';

// إعدادات Redux Persist
// إعدادات Redux Persist للـ auth slice لاستثناء التوكن
const authPersistConfig = {
  key: 'auth',
  storage,
  blacklist: ['token'], // لا نخزن التوكن في localStorage نهائياً
};

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth'], 
};

// دمج الـ reducers مع حماية الـ auth
const appReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  auth: persistReducer(authPersistConfig, authReducer),
});

// Root reducer with global reset functionality
const rootReducer = (state, action) => {
  // Clear all state on logout or purge
  if (action.type === 'auth/logout' || action.type === 'PURGE') {
    // We keep some specific parts if needed, but for hotel app, full reset is safer
    storage.removeItem('persist:root'); // Clear main persistence
    storage.removeItem('persist:auth'); // Clear auth persistence
    state = undefined;
  }
  return appReducer(state, action);
};

// إنشاء persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// إنشاء Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

