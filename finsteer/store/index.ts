import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import accountsSlice from "./accountsSlice";
import transactionsSlice from "./transactionsSlice";
import reportsSlice from "./reportsSlice";
import settingsSlice from "./settingsSlice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    accounts: accountsSlice.reducer,
    transactions: transactionsSlice.reducer,
    reports: reportsSlice.reducer,
    settings: settingsSlice.reducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;