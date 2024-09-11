'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { RootState } from '@/store';
import { deleteAccount, updateAccount } from '@/store/accountsSlice';
import { openModal } from '@/store/modalSlice';
import { AccountType } from '@/types/accounts';
import ConfirmationModal from './ConfirmationModal';
import AccountForm from './AccountForm';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';

const AccountList: React.FC = () => {
  const dispatch = useDispatch();
  const accounts = useSelector((state: RootState) => state.accounts.accounts);
  const isLoading = useSelector((state: RootState) => state.accounts.isLoading);
  const error = useSelector((state: RootState) => state.accounts.error);
  const [editingAccount, setEditingAccount] = useState<AccountType | null>(null);

  const handleDeleteAccount = (account: AccountType) => {
    dispatch(openModal('deleteAccount', account));
  };

  const handleEditAccount = (account: AccountType) => {
    setEditingAccount(account);
  };

  const handleCancelEdit = () => {
    setEditingAccount(null);
  };

  const handleUpdateAccount = (updatedAccount: AccountType) => {
    dispatch(updateAccount(updatedAccount));
    setEditingAccount(null);
  };

  const handleConfirmDelete = (account: AccountType) => {
    dispatch(deleteAccount(account.id));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Accounts</h2>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center"
          onClick={() => dispatch(openModal('addAccount'))}
        >
          <FaPlus className="mr-2" />
          Add Account
        </button>
      </div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : accounts.length === 0 ? (
        <p className="text-gray-500">No accounts found.</p>
      ) : (
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Balance</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id} className="odd:bg-gray-100">
                <td className="px-4 py-2">{account.name}</td>
                <td className="px-4 py-2">{account.type}</td>
                <td className="px-4 py-2">{account.balance}</td>
                <td className="px-4 py-2 flex justify-end">
                  <button
                    className="text-blue-500 hover:text-blue-600 mr-2"
                    onClick={() => handleEditAccount(account)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDeleteAccount(account)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {editingAccount && (
        <AccountForm
          account={editingAccount}
          onCancel={handleCancelEdit}
          onSubmit={handleUpdateAccount}
        />
      )}
      <ConfirmationModal
        modalType="deleteAccount"
        title="Delete Account"
        message="Are you sure you want to delete this account?"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default AccountList;