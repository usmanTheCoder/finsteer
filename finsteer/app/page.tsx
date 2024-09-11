'use client';

import Link from 'next/link';
import { useSession } from '@/hooks/useAuth';
import { FaChartLine, FaWallet, FaExchangeAlt, FaChartBar, FaCog } from 'react-icons/fa';
import DashboardStats from '@/components/DashboardStats';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Loader from '@/components/Loader';
import ErrorMessage from '@/components/ErrorMessage';

const HomePage = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <Loader />;
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <ErrorMessage message="You must be logged in to access this page." />
        <Link href="/auth/login" className="mt-4 text-blue-500 hover:underline">
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={session?.user} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
          <DashboardStats />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8">
            <Link
              href="/accounts"
              className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md px-6 py-8 hover:shadow-lg transition duration-300 ease-in-out"
            >
              <FaWallet className="text-4xl text-blue-500 mb-4" />
              <h2 className="text-xl font-semibold">Accounts</h2>
              <p className="text-gray-500 text-center">Manage your accounts and balances.</p>
            </Link>
            <Link
              href="/transactions"
              className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md px-6 py-8 hover:shadow-lg transition duration-300 ease-in-out"
            >
              <FaExchangeAlt className="text-4xl text-blue-500 mb-4" />
              <h2 className="text-xl font-semibold">Transactions</h2>
              <p className="text-gray-500 text-center">Record and track your financial transactions.</p>
            </Link>
            <Link
              href="/reports"
              className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md px-6 py-8 hover:shadow-lg transition duration-300 ease-in-out"
            >
              <FaChartBar className="text-4xl text-blue-500 mb-4" />
              <h2 className="text-xl font-semibold">Reports</h2>
              <p className="text-gray-500 text-center">Generate comprehensive financial reports.</p>
            </Link>
            <Link
              href="/settings"
              className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md px-6 py-8 hover:shadow-lg transition duration-300 ease-in-out"
            >
              <FaCog className="text-4xl text-blue-500 mb-4" />
              <h2 className="text-xl font-semibold">Settings</h2>
              <p className="text-gray-500 text-center">Configure your account and preferences.</p>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;