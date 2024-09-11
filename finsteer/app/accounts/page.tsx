'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/utils/trpc';
import Loader from '@/components/Loader';
import ErrorMessage from '@/components/ErrorMessage';
import AccountList from '@/components/AccountList';
import AccountForm from '@/components/AccountForm';
import { FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { setAccounts, selectAccounts } from '@/store/accountsSlice';
import { AnimatePresence, motion } from 'framer-motion';

const AccountsPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const accounts = useSelector(selectAccounts);
  const [isCreating, setIsCreating] = useState(false);

  const { data, isLoading, error } = trpc.accounts.getAllAccounts.useQuery(undefined, {
    onSuccess: (data) => {
      dispatch(setAccounts(data));
    },
  });

  useEffect(() => {
    const handleRouteChange = () => setIsCreating(false);
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage>{error.message}</ErrorMessage>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Accounts</h1>
        <button
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200"
          onClick={() => setIsCreating(true)}
        >
          <FaPlus />
          New Account
        </button>
      </div>
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <AccountForm onClose={() => setIsCreating(false)} />
          </motion.div>
        )}
      </AnimatePresence>
      <AccountList accounts={accounts} />
    </div>
  );
};

export default AccountsPage;