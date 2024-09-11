'use client'

import React, { useState } from 'react'
import { useTransactions } from '@/hooks/useTransactions'
import { AiFillEdit, AiFillDelete } from 'react-icons/ai'
import { BiFilterAlt } from 'react-icons/bi'
import { TransactionType } from '@prisma/client'
import { formatDate, formatCurrency } from '@/utils/formatting'
import { ConfirmationModal } from './ConfirmationModal'
import { Loader } from './Loader'
import { ErrorMessage } from './ErrorMessage'
import { trpc } from '@/utils/trpc'

export const TransactionList = () => {
  const [filterType, setFilterType] = useState<TransactionType | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null)

  const { data, isLoading, isError, error } = useTransactions(filterType)

  const { mutate: deleteTransaction } = trpc.transactions.deleteTransaction.useMutation()

  const handleDeleteTransaction = (id: string) => {
    setTransactionToDelete(id)
    setShowModal(true)
  }

  const confirmDeleteTransaction = () => {
    if (transactionToDelete) {
      deleteTransaction({ id: transactionToDelete })
    }
    setShowModal(false)
    setTransactionToDelete(null)
  }

  const handleFilterChange = (type: TransactionType | null) => {
    setFilterType(type)
  }

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return <ErrorMessage error={error} />
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Transactions</h2>
        <div className="flex items-center">
          <button
            className={`mr-2 py-1 px-2 rounded-md ${
              filterType === null ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => handleFilterChange(null)}
          >
            All
          </button>
          <button
            className={`mr-2 py-1 px-2 rounded-md ${
              filterType === TransactionType.INCOME ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => handleFilterChange(TransactionType.INCOME)}
          >
            Income
          </button>
          <button
            className={`mr-2 py-1 px-2 rounded-md ${
              filterType === TransactionType.EXPENSE ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => handleFilterChange(TransactionType.EXPENSE)}
          >
            Expense
          </button>
          <BiFilterAlt className="text-gray-500" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left">Type</th>
              <th className="py-3 px-6 text-left">Amount</th>
              <th className="py-3 px-6 text-left">Account</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {data?.map((transaction) => (
              <tr key={transaction.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{formatDate(transaction.date)}</td>
                <td className="py-3 px-6 text-left">{transaction.description}</td>
                <td className="py-3 px-6 text-left">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      transaction.type === TransactionType.INCOME
                        ? 'bg-green-200 text-green-800'
                        : 'bg-red-200 text-red-800'
                    }`}
                  >
                    {transaction.type}
                  </span>
                </td>
                <td className="py-3 px-6 text-left">
                  {formatCurrency(transaction.amount, transaction.account.currency)}
                </td>
                <td className="py-3 px-6 text-left">{transaction.account.name}</td>
                <td className="py-3 px-6 text-center">
                  <div className="flex justify-center items-center">
                    <button className="mr-2 text-yellow-500 hover:text-yellow-700">
                      <AiFillEdit size={20} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteTransaction(transaction.id)}
                    >
                      <AiFillDelete size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmationModal
        show={showModal}
        onConfirm={confirmDeleteTransaction}
        onCancel={() => setShowModal(false)}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction?"
      />
    </div>
  )
}