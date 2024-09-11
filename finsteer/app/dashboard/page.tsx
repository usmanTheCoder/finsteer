'use client';
import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { fetchAccounts, fetchTransactions, selectDashboardStats } from '@/store/slices/dashboardSlice';
import { AiOutlineLineChart, AiOutlineDollarCircle, AiOutlineTransaction, AiOutlineCalendar } from 'react-icons/ai';
import { motion } from 'framer-motion';
import DashboardStats from '@/components/DashboardStats';
import TransactionList from '@/components/TransactionList';
import AccountList from '@/components/AccountList';
import ReportVisualizer from '@/components/ReportVisualizer';
import LoadingSpinner from '@/components/LoadingSpinner';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { accounts, transactions, isLoading, dashboardStats } = useAppSelector(selectDashboardStats);

  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchTransactions());
  }, [dispatch]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center"
        >
          <AiOutlineLineChart size={32} className="text-blue-500" />
          <h2 className="text-xl font-bold mt-2">Net Worth</h2>
          <p className="text-lg font-semibold mt-1">${dashboardStats.netWorth.toLocaleString()}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center"
        >
          <AiOutlineDollarCircle size={32} className="text-green-500" />
          <h2 className="text-xl font-bold mt-2">Total Income</h2>
          <p className="text-lg font-semibold mt-1">${dashboardStats.totalIncome.toLocaleString()}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center"
        >
          <AiOutlineTransaction size={32} className="text-red-500" />
          <h2 className="text-xl font-bold mt-2">Total Expenses</h2>
          <p className="text-lg font-semibold mt-1">${dashboardStats.totalExpenses.toLocaleString()}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1 }}
          className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center"
        >
          <AiOutlineCalendar size={32} className="text-purple-500" />
          <h2 className="text-xl font-bold mt-2">Last Updated</h2>
          <p className="text-lg font-semibold mt-1">{dashboardStats.lastUpdated.toLocaleDateString()}</p>
        </motion.div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2">
          <TransactionList transactions={transactions} />
        </div>
        <div>
          <AccountList accounts={accounts} />
        </div>
      </div>
      <div>
        <ReportVisualizer transactions={transactions} />
      </div>
    </div>
  );
};

export default Dashboard;