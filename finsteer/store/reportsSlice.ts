import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';
import { reportingApi } from '../services/api';
import { Report, ReportFilters } from '../types';

interface ReportsState {
  reports: Report[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ReportsState = {
  reports: [],
  isLoading: false,
  error: null,
};

export const fetchReports = createAsyncThunk<Report[], ReportFilters>(
  'reports/fetchReports',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await reportingApi.fetchReports(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearReports: (state) => {
      state.reports = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action: PayloadAction<Report[]>) => {
        state.isLoading = false;
        state.reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReports } = reportsSlice.actions;

export const selectReports = (state: RootState) => state.reports.reports;
export const selectReportsLoading = (state: RootState) => state.reports.isLoading;
export const selectReportsError = (state: RootState) => state.reports.error;

export default reportsSlice.reducer;