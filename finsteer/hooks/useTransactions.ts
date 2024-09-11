import { useState, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../store';
import { addTransaction, removeTransaction, updateTransaction } from '../store/transactionsSlice';
import { trpc } from '../utils/trpc';
import { Transaction } from '@prisma/client';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';

export const useTransactions = () => {
  const { transactions, isLoading, error } = useAppSelector((state) => state.transactions);
  const dispatch = useAppDispatch();
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { mutate: createTransaction } = trpc.transactions.create.useMutation({
    onSuccess: (data) => {
      dispatch(addTransaction(data));
      setIsCreating(false);
    },
    onError: (err) => {
      console.error(err);
      setIsCreating(false);
    },
  });

  const { mutate: deleteTransaction } = trpc.transactions.delete.useMutation({
    onSuccess: (data) => {
      dispatch(removeTransaction(data.id));
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const { mutate: updateTransactionMutation } = trpc.transactions.update.useMutation({
    onSuccess: (data) => {
      dispatch(updateTransaction(data));
      setIsEditing(false);
    },
    onError: (err) => {
      console.error(err);
      setIsEditing(false);
    },
  });

  const handleCreateTransaction = useCallback(
    (transaction: Omit<Transaction, 'id'>) => {
      setIsCreating(true);
      createTransaction(transaction);
    },
    [createTransaction]
  );

  const handleDeleteTransaction = useCallback(
    (id: string) => {
      deleteTransaction({ id });
    },
    [deleteTransaction]
  );

  const handleUpdateTransaction = useCallback(
    (transaction: Transaction) => {
      setIsEditing(true);
      updateTransactionMutation(transaction);
    },
    [updateTransactionMutation]
  );

  const formattedTransactions = transactions.map((transaction) => ({
    ...transaction,
    amount: formatCurrency(transaction.amount),
    date: formatDate(transaction.date),
  }));

  return {
    transactions: formattedTransactions,
    isLoading,
    error,
    isCreating,
    isEditing,
    handleCreateTransaction,
    handleDeleteTransaction,
    handleUpdateTransaction,
  };
};