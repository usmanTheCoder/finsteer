'use client';

import React, { useState, useEffect } from 'react';
import { useReports } from '@/hooks/useReports';
import { trpc } from '@/utils/trpc';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { AiOutlineBarChart, AiOutlinePieChart } from 'react-icons/ai';
import { BsCalendarDate } from 'react-icons/bs';
import { formatCurrency } from '@/utils/currency';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ReportVisualizer = () => {
  const [chartType, setChartType] = useState('bar');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: reportData, isLoading: isReportLoading, error: reportError } =
    trpc.reports.generateReport.useQuery(
      { start: dateRange.start, end: dateRange.end },
      { enabled: !!dateRange.start && !!dateRange.end }
    );

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    setIsLoading(isReportLoading);
    if (reportError) {
      setError(reportError.message);
    } else {
      setError(null);
    }
  }, [isReportLoading, reportError]);

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  const chartData = {
    labels: reportData?.labels || [],
    datasets: [
      {
        label: 'Transactions',
        data: reportData?.data || [],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Financial Report',
      },
    },
  };

  const renderChart = () => {
    if (chartType === 'bar') {
      return <Bar options={chartOptions} data={chartData} />;
    } else {
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">Report Visualizer</h2>
        </div>
        <div className="flex items-center">
          <div className="mr-4">
            <BsCalendarDate className="text-gray-500 text-lg" />
            <input
              type="date"
              name="start"
              value={dateRange.start}
              onChange={handleDateRangeChange}
              className="ml-2 border border-gray-300 rounded px-2 py-1"
            />
            <span className="mx-2">-</span>
            <input
              type="date"
              name="end"
              value={dateRange.end}
              onChange={handleDateRangeChange}
              className="border border-gray-300 rounded px-2 py-1"
            />
          </div>
          <div className="flex items-center">
            <AiOutlineBarChart
              className={`text-xl cursor-pointer ${
                chartType === 'bar' ? 'text-blue-500' : 'text-gray-500'
              }`}
              onClick={() => setChartType('bar')}
            />
            <AiOutlinePieChart
              className={`text-xl cursor-pointer ml-2 ${
                chartType === 'pie' ? 'text-blue-500' : 'text-gray-500'
              }`}
              onClick={() => setChartType('pie')}
            />
          </div>
        </div>
      </div>
      {renderChart()}
      {reportData && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Summary</h3>
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">Total Income:</p>
              <p className="font-semibold">
                {formatCurrency(reportData.totalIncome)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Total Expenses:</p>
              <p className="font-semibold">
                {formatCurrency(reportData.totalExpenses)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Net Balance:</p>
              <p className="font-semibold">
                {formatCurrency(reportData.netBalance)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportVisualizer;