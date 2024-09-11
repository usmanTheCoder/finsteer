import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '.';
import { Transaction, TransactionFilters } from '../types';
import { formatDate } from '../utils/date';

interface TransactionsState {
  data: Transaction[];
  loading: boolean;
  error: string | null;
  filters: TransactionFilters;
}

const initialState: TransactionsState = {
  data: [],
  loading: false,
  error: null,
  filters: {
    startDate: null,
    endDate: null,
    accountId: null,
    category: null,
  },
};

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (filters: TransactionFilters, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/transactions', { params: filters });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createTransaction = createAsyncThunk(
  'transactions/createTransaction',
  async (transaction: Transaction, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/transactions', transaction);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async (transaction: Transaction, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/transactions/${transaction.id}`, transaction);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (transactionId: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/transactions/${transactionId}`);
      return transactionId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<TransactionFilters>) => {
      state.filters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error fetching transactions';
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.data.findIndex((transaction) => transaction.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.data = state.data.filter((transaction) => transaction.id !== action.payload);
      });
  },
});

export const selectTransactions = (state: RootState) => state.transactions.data;
export const selectTransactionsLoading = (state: RootState) => state.transactions.loading;
export const selectTransactionsError = (state: RootState) => state.transactions.error;
export const selectTransactionFilters = (state: RootState) => state.transactions.filters;

export const { setFilters } = transactionsSlice.actions;
export default transactionsSlice.reducer;