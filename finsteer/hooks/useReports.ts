import { useCallback } from 'react';
import { trpc } from '../utils/trpc';
import { useAppSelector, useAppDispatch } from '../store';
import { setReports, setReportLoading, setReportError } from '../store/reportsSlice';
import { Report, ReportFilter } from '../types/reports';

export const useReports = () => {
  const dispatch = useAppDispatch();
  const { reports, loading, error } = useAppSelector((state) => state.reports);

  const { mutate: fetchReports } = trpc.reports.getReports.useMutation({
    onMutate: () => {
      dispatch(setReportLoading(true));
      dispatch(setReportError(null));
    },
    onError: (err) => {
      dispatch(setReportError(err.message));
      dispatch(setReportLoading(false));
    },
    onSuccess: (data) => {
      dispatch(setReports(data));
      dispatch(setReportLoading(false));
    },
  });

  const getReports = useCallback(
    (filters: ReportFilter) => {
      fetchReports(filters);
    },
    [fetchReports]
  );

  const { mutate: downloadReport } = trpc.reports.downloadReport.useMutation({
    onMutate: () => {
      dispatch(setReportLoading(true));
      dispatch(setReportError(null));
    },
    onError: (err) => {
      dispatch(setReportError(err.message));
      dispatch(setReportLoading(false));
    },
    onSuccess: () => {
      dispatch(setReportLoading(false));
    },
  });

  const downloadReportFile = useCallback(
    (reportId: string, format: string) => {
      downloadReport({ reportId, format });
    },
    [downloadReport]
  );

  return { reports, loading, error, getReports, downloadReportFile };
};