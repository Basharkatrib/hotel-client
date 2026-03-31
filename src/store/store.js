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
import { hotelsApi } from '../services/hotelsApi';
import { bookingsApi } from '../services/bookingsApi';
import { paymentsApi } from '../services/paymentsApi';
import { favoritesApi } from '../services/favoritesApi';
import { reviewsApi } from '../services/reviewsApi';
import { partnerApi } from '../services/partnerApi';
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
  [hotelsApi.reducerPath]: hotelsApi.reducer,
  [bookingsApi.reducerPath]: bookingsApi.reducer,
  [paymentsApi.reducerPath]: paymentsApi.reducer,
  [favoritesApi.reducerPath]: favoritesApi.reducer,
  [reviewsApi.reducerPath]: reviewsApi.reducer,
  [partnerApi.reducerPath]: partnerApi.reducer,
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
    }).concat(api.middleware, hotelsApi.middleware, bookingsApi.middleware, paymentsApi.middleware, favoritesApi.middleware, reviewsApi.middleware, partnerApi.middleware),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

