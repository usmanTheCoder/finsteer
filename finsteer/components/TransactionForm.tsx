'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAddTransactionMutation, useUpdateTransactionMutation } from '@/hooks/useTransactions'
import { useAccounts } from '@/hooks/useAccounts'
import { formatDate, formatCurrency } from '@/utils/format'
import { TransactionType, Transaction } from '@prisma/client'
import { FaRegCalendarAlt, FaWallet, FaPlus, FaMinus } from 'react-icons/fa'
import { IoCloseOutline } from 'react-icons/io5'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

interface TransactionFormProps {
  transaction?: Transaction
  onClose: () => void
}

const schema = yup.object().shape({
  amount: yup.number().required('Amount is required'),
  description: yup.string().required('Description is required'),
  date: yup.date().required('Date is required'),
  accountId: yup.string().required('Account is required'),
  type: yup.mixed<TransactionType>().oneOf(['INCOME', 'EXPENSE']).required('Type is required'),
})

const TransactionForm: React.FC<TransactionFormProps> = ({ transaction, onClose }) => {
  const { accounts } = useAccounts()
  const addTransaction = useAddTransactionMutation()
  const updateTransaction = useUpdateTransactionMutation()
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<Transaction>({
    resolver: yupResolver(schema),
    defaultValues: {
      amount: transaction?.amount || 0,
      description: transaction?.description || '',
      date: transaction?.date ? new Date(transaction.date) : new Date(),
      accountId: transaction?.accountId || '',
      type: transaction?.type || 'INCOME',
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const currentUser = useSelector((state: RootState) => state.auth.user)

  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true)
    try {
      if (transaction) {
        await updateTransaction.mutateAsync({ ...data, id: transaction.id })
        toast.success('Transaction updated successfully')
      } else {
        await addTransaction.mutateAsync({ ...data, userId: currentUser?.id! })
        toast.success('Transaction added successfully')
        reset()
      }
    } catch (err) {
      console.error(err)
      toast.error('Error saving transaction')
    } finally {
      setIsSubmitting(false)
    }
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
      <div className="relative z-10 max-w-lg rounded-md bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {transaction ? 'Update Transaction' : 'Add Transaction'}
          </h2>
          <IoCloseOutline className="text-2xl text-gray-500 cursor-pointer" onClick={onClose} />
        </div>
        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="amount"
                step="0.01"
                className={`block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors.amount ? 'border-red-500' : ''
                }`}
                {...register('amount')}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {Math.abs(errors.amount?.message.length || 0) > 0 && (
                  <span className="text-red-500">{errors.amount.message}</span>
                )}
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              id="description"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.description ? 'border-red-500' : ''
              }`}
              {...register('description')}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaRegCalendarAlt className="text-gray-500 sm:text-sm" />
                </div>
                <input
                  type="date"
                  id="date"
                  className={`block w-full rounded-md border-gray-300 pl-10 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.date ? 'border-red-500' : ''
                  }`}
                  {...register('date', { valueAsDate: true })}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {Math.abs(errors.date?.message.length || 0) > 0 && (
                    <span className="text-red-500">{errors.date.message}</span>
                  )}
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="account" className="block text-sm font-medium text-gray-700">
                Account
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaWallet className="text-gray-500 sm:text-sm" />
                </div>
                <select
                  id="account"
                  className={`block w-full rounded-md border-gray-300 pl-10 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.accountId ? 'border-red-500' : ''
                  }`}
                  {...register('accountId')}
                >
                  <option value="">Select an account</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {Math.abs(errors.accountId?.message.length || 0) > 0 && (
                    <span className="text-red-500">{errors.accountId.message}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <div className="mt-1 flex items-center space-x-4">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  id="income"
                  value="INCOME"
                  className="form-radio h-4 w-4 text-blue-600 cursor-pointer"
                  {...register('type')}
                />
                <span className="ml-2 text-sm text-gray-700">Income</span>
                <FaPlus className="ml-1 text-green-500" />
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  id="expense"
                  value="EXPENSE"
                  className="form-radio h-4 w-4 text-blue-600 cursor-pointer"
                  {...register('type')}
                />
                <span className="ml-2 text-sm text-gray-700">Expense</span>
                <FaMinus className="ml-1 text-red-500" />
              </label>
            </div>
            {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type.message}</p>}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {transaction ? 'Update Transaction' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TransactionForm