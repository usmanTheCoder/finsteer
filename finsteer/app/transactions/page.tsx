'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@utils/trpc';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import TransactionList from '@components/TransactionList';
import TransactionForm from '@components/TransactionForm';
import ConfirmationModal from '@components/ConfirmationModal';
import Loader from '@components/Loader';
import ErrorMessage from '@components/ErrorMessage';
import { formatCurrency, formatDate } from '@utils/formatting';

export default function TransactionsPage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const { data: transactions, isLoading, error } = trpc.transactions.getAll.useQuery();
  const { mutate: createTransaction } = trpc.transactions.create.useMutation({
    onSuccess: () => router.refresh(),
  });
  const { mutate: updateTransaction } = trpc.transactions.update.useMutation({
    onSuccess: () => {
      setEditingTransaction(null);
      setShowForm(false);
      router.refresh();
    },
  });
  const { mutate: deleteTransaction } = trpc.transactions.delete.useMutation({
    onSuccess: () => {
      setTransactionToDelete(null);
      setShowDeleteModal(false);
      router.refresh();
    },
  });

  const handleCreateTransaction = (data) => {
    createTransaction(data);
  };

  const handleUpdateTransaction = (data) => {
    updateTransaction({ ...data, id: editingTransaction.id });
  };

  const handleDeleteTransaction = () => {
    deleteTransaction({ id: transactionToDelete.id });
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
          onClick={() => setShowForm(true)}
        >
          <FaPlus className="mr-2" /> New Transaction
        </button>
      </div>

      {transactions.length > 0 ? (
        <TransactionList
          transactions={transactions}
          onEdit={(transaction) => {
            setEditingTransaction(transaction);
            setShowForm(true);
          }}
          onDelete={(transaction) => {
            setTransactionToDelete(transaction);
            setShowDeleteModal(true);
          }}
        />
      ) : (
        <p>No transactions found.</p>
      )}

      {showForm && (
        <TransactionForm
          onSubmit={editingTransaction ? handleUpdateTransaction : handleCreateTransaction}
          initialValues={editingTransaction}
          onClose={() => {
            setShowForm(false);
            setEditingTransaction(null);
          }}
        />
      )}

      {showDeleteModal && (
        <ConfirmationModal
          title="Delete Transaction"
          message={`Are you sure you want to delete the transaction from ${formatDate(
            transactionToDelete.date
          )} for ${formatCurrency(transactionToDelete.amount)}?`}
          onConfirm={handleDeleteTransaction}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
}