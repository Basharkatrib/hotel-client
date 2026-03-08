import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'fcm_notifications';

// Load notifications from localStorage
const loadNotifications = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save notifications to localStorage
const saveNotifications = (notifications) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch (e) {
    console.warn('Failed to save notifications to localStorage:', e);
  }
};

const initialState = {
  notifications: loadNotifications(),
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const notification = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        title: action.payload.title || 'Notification',
        body: action.payload.body || '',
        data: action.payload.data || {},
        read: false,
        created_at: new Date().toISOString(),
      };
      state.notifications.unshift(notification); // newest first
      // Keep max 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
      saveNotifications(state.notifications);
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
        saveNotifications(state.notifications);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => { n.read = true; });
      saveNotifications(state.notifications);
    },
    clearNotifications: (state) => {
      state.notifications = [];
      saveNotifications(state.notifications);
    },
  },
});

export const { addNotification, markAsRead, markAllAsRead, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;

// Selectors
export const selectNotifications = (state) => state.notifications.notifications;
export const selectUnreadCount = (state) => state.notifications.notifications.filter(n => !n.read).length;
