import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { trpc } from '../utils/trpc';
import { Account } from '@prisma/client';
import { toast } from 'react-toastify';

export const useAccounts = () => {
  const queryClient = useQueryClient();

  const { data: accounts, isLoading: isLoadingAccounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => trpc.accounts.getAll.query(),
  });

  const addAccountMutation = useMutation({
    mutationFn: (account: Omit<Account, 'id'>) => trpc.accounts.create.mutate(account),
    onSuccess: () => {
      queryClient.invalidateQueries(['accounts']);
      toast.success('Account created successfully');
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const updateAccountMutation = useMutation({
    mutationFn: (account: Account) => trpc.accounts.update.mutate(account),
    onSuccess: () => {
      queryClient.invalidateQueries(['accounts']);
      toast.success('Account updated successfully');
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: (id: string) => trpc.accounts.delete.mutate({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries(['accounts']);
      toast.success('Account deleted successfully');
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const addAccount = useCallback(
    async (account: Omit<Account, 'id'>) => {
      await addAccountMutation.mutateAsync(account);
    },
    [addAccountMutation],
  );

  const updateAccount = useCallback(
    async (account: Account) => {
      await updateAccountMutation.mutateAsync(account);
    },
    [updateAccountMutation],
  );

  const deleteAccount = useCallback(
    async (id: string) => {
      await deleteAccountMutation.mutateAsync(id);
    },
    [deleteAccountMutation],
  );

  return {
    accounts,
    isLoadingAccounts,
    addAccount,
    updateAccount,
    deleteAccount,
  };
};