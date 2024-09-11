import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { RootState } from './index';
import { AccountData, CreateAccountData, UpdateAccountData } from '../types/account';
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

interface AccountsState {
  accounts: AccountData[];
  loading: boolean;
  error: string | null;
}

const initialState: AccountsState = {
  accounts: [],
  loading: false,
  error: null,
};

export const fetchAccounts = createAsyncThunk('accounts/fetchAccounts', async () => {
  const response = await api.get('/accounts');
  return response.data;
});

export const createAccount = createAsyncThunk('accounts/createAccount', async (data: CreateAccountData) => {
  const response = await api.post('/accounts', data);
  return response.data;
});

export const updateAccount = createAsyncThunk('accounts/updateAccount', async (data: UpdateAccountData) => {
  const response = await api.put(`/accounts/${data.id}`, data);
  return response.data;
});

export const deleteAccount = createAsyncThunk('accounts/deleteAccount', async (id: string) => {
  await api.delete(`/accounts/${id}`);
  return id;
});

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    resetAccounts: (state) => {
      state.accounts = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action: PayloadAction<AccountData[]>) => {
        state.loading = false;
        state.accounts = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch accounts';
      })
      .addCase(createAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAccount.fulfilled, (state, action: PayloadAction<AccountData>) => {
        state.loading = false;
        state.accounts.push(action.payload);
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create account';
      })
      .addCase(updateAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAccount.fulfilled, (state, action: PayloadAction<AccountData>) => {
        state.loading = false;
        const index = state.accounts.findIndex((account) => account.id === action.payload.id);
        if (index !== -1) {
          state.accounts[index] = action.payload;
        }
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update account';
      })
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.accounts = state.accounts.filter((account) => account.id !== action.payload);
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete account';
      })
      .addCase(HYDRATE, (state, action) => {
        return {
          ...state,
          ...action.payload.accounts,
        };
      });
  },
});

export const { resetAccounts } = accountsSlice.actions;

export const selectAccounts = (state: RootState) => state.accounts.accounts;
export const selectAccountsLoading = (state: RootState) => state.accounts.loading;
export const selectAccountsError = (state: RootState) => state.accounts.error;

export default accountsSlice.reducer;