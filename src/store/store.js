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
import authReducer from './slices/authSlice';

// إعدادات Redux Persist
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth'], // فقط auth slice سيتم حفظه
};

// دمج الـ reducers
const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  [hotelsApi.reducerPath]: hotelsApi.reducer,
  [bookingsApi.reducerPath]: bookingsApi.reducer,
  [paymentsApi.reducerPath]: paymentsApi.reducer,
  auth: authReducer,
});

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
    }).concat(api.middleware, hotelsApi.middleware, bookingsApi.middleware, paymentsApi.middleware),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

