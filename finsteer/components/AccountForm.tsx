'use client';

import * as React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AccountSchema, AccountType } from '../utils/validation';
import { FaUniversity, FaCreditCard, FaWallet } from 'react-icons/fa';
import { trpc } from '../utils/trpc';
import { useDispatch } from 'react-redux';
import { addAccount } from '../store/accountsSlice';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';

type AccountFormProps = {
  defaultValues?: Partial<AccountType>;
  onSuccess?: () => void;
};

const AccountForm: React.FC<AccountFormProps> = ({ defaultValues, onSuccess }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AccountType>({
    resolver: zodResolver(AccountSchema),
    defaultValues,
  });
  const dispatch = useDispatch();
  const { mutateAsync, isLoading, error } = trpc.useMutation('accounts.createAccount', {
    onSuccess: (account) => {
      dispatch(addAccount(account));
      if (onSuccess) onSuccess();
    },
  });

  const onSubmit: SubmitHandler<AccountType> = async (data) => {
    await mutateAsync(data);
  };

  const renderIcon = (accountType: string) => {
    switch (accountType) {
      case 'Bank':
        return <FaUniversity className="text-2xl text-gray-600" />;
      case 'Credit Card':
        return <FaCreditCard className="text-2xl text-gray-600" />;
      case 'Cash':
        return <FaWallet className="text-2xl text-gray-600" />;
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {isLoading && <Loader />}
      {error && <ErrorMessage error={error} />}

      <div className="flex items-center space-x-2">
        {renderIcon(defaultValues?.accountType || 'Bank')}
        <input
          {...register('accountName')}
          placeholder="Account Name"
          className={`flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.accountName ? 'border-red-500' : 'border-gray-300'
          }`}
        />
      </div>
      {errors.accountName && <span className="text-red-500">{errors.accountName.message}</span>}

      <div>
        <select
          {...register('accountType')}
          className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.accountType ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="Bank">Bank</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Cash">Cash</option>
        </select>
      </div>
      {errors.accountType && <span className="text-red-500">{errors.accountType.message}</span>}

      <input
        {...register('initialBalance', { valueAsNumber: true })}
        type="number"
        placeholder="Initial Balance"
        className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors.initialBalance ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {errors.initialBalance && <span className="text-red-500">{errors.initialBalance.message}</span>}

      <input
        {...register('currency')}
        placeholder="Currency (e.g., USD)"
        className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors.currency ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {errors.currency && <span className="text-red-500">{errors.currency.message}</span>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Saving...' : defaultValues ? 'Update Account' : 'Create Account'}
      </button>
    </form>
  );
};

export default AccountForm;