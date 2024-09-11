import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';

interface SettingsState {
  language: string;
  theme: 'light' | 'dark';
  currency: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
  };
}

const initialState: SettingsState = {
  language: 'en',
  theme: 'light',
  currency: 'USD',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  notifications: {
    email: true,
    push: false,
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload;
    },
    setTimezone: (state, action: PayloadAction<string>) => {
      state.timezone = action.payload;
    },
    toggleEmailNotifications: (state) => {
      state.notifications.email = !state.notifications.email;
    },
    togglePushNotifications: (state) => {
      state.notifications.push = !state.notifications.push;
    },
  },
});

export const {
  setLanguage,
  toggleTheme,
  setCurrency,
  setTimezone,
  toggleEmailNotifications,
  togglePushNotifications,
} = settingsSlice.actions;

export const selectSettings = (state: RootState) => state.settings;

export default settingsSlice.reducer;