'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaChartBar, FaChartPie, FaChartLine } from 'react-icons/fa';
import { useReports } from '@/hooks/useReports';
import { ReportVisualizer } from '@/components/ReportVisualizer';
import { Loader } from '@/components/Loader';
import { ErrorMessage } from '@/components/ErrorMessage';

const ReportsPage = () => {
  const router = useRouter();
  const { reports, isLoading, isError } = useReports();

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorMessage message="Failed to load reports" />;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reports</h1>
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white transition-colors hover:bg-blue-600"
            onClick={() => router.push('/reports/new')}
          >
            <FaChartBar />
            New Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reports.map((report) => (
          <ReportVisualizer
            key={report.id}
            report={report}
            onEditClick={() => router.push(`/reports/${report.id}/edit`)}
          />
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;