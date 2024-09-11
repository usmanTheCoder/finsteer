'use client'

import { useAppSelector } from '@/hooks/redux';
import { selectAccounts, selectTransactions } from '@/store/selectors';
import { formatCurrency } from '@/utils/currency';
import { FaMoneyBillAlt, FaMoneyCheckAlt, FaChartLine } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { trpc } from '@/utils/trpc';
import Loader from './Loader';

interface DashboardStatsProps {
  className?: string;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ className }) => {
  const accounts = useAppSelector(selectAccounts);
  const transactions = useAppSelector(selectTransactions);
  const [totalBalance, setTotalBalance] = useState(0);
  const [netIncome, setNetIncome] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { data: recentTransactions, isLoading: isLoadingRecentTransactions } = trpc.transaction.getRecentTransactions.useQuery();

  useEffect(() => {
    const calculateTotalBalance = () => {
      const balance = accounts.reduce((total, account) => total + account.balance, 0);
      setTotalBalance(balance);
    };

    const calculateNetIncome = () => {
      const income = transactions.reduce((total, transaction) => {
        if (transaction.type === 'income') {
          return total + transaction.amount;
        } else {
          return total - transaction.amount;
        }
      }, 0);
      setNetIncome(income);
    };

    calculateTotalBalance();
    calculateNetIncome();
    setIsLoading(false);
  }, [accounts, transactions]);

  if (isLoading || isLoadingRecentTransactions) {
    return <Loader />;
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
        <FaMoneyBillAlt className="text-4xl text-green-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Total Balance</h2>
        <p className="text-lg text-gray-600">{formatCurrency(totalBalance)}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
        <FaMoneyCheckAlt className="text-4xl text-blue-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Net Income</h2>
        <p className="text-lg text-gray-600">{formatCurrency(netIncome)}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
        <FaChartLine className="text-4xl text-purple-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Recent Transactions</h2>
        {recentTransactions && (
          <ul className="text-gray-600">
            {recentTransactions.slice(0, 3).map((transaction) => (
              <li key={transaction.id} className="flex justify-between">
                <span>{transaction.description}</span>
                <span>{formatCurrency(transaction.amount)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DashboardStats;