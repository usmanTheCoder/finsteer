'use client';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaUserCircle, FaKey } from 'react-icons/fa';
import { BiEdit } from 'react-icons/bi';
import { IoIosArrowBack } from 'react-icons/io';
import { updateUserSettings, selectUserSettings } from '@/store/settingsSlice';
import { UserSettings, ConfirmationModal, Loader, ErrorMessage } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { validatePassword } from '@/utils/validation';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { user, updateUser } = useAuth();
  const userSettings = useSelector(selectUserSettings);
  const [editMode, setEditMode] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [formData, setFormData] = useState({ ...userSettings });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    try {
      await updateUser({ ...formData });
      dispatch(updateUserSettings(formData));
      setEditMode(false);
      setError('');
    } catch (err) {
      setError('Failed to update settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditMode = () => {
    setEditMode(true);
    setFormData({ ...userSettings });
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setFormData({ ...userSettings });
  };

  const handleConfirmModal = () => {
    setConfirmModal(true);
  };

  const handleCloseModal = () => {
    setConfirmModal(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Settings</h2>
            {!editMode && (
              <button
                type="button"
                onClick={handleEditMode}
                className="flex items-center text-indigo-600 hover:text-indigo-800 focus:outline-none"
              >
                <BiEdit className="mr-2" />
                Edit
              </button>
            )}
          </div>

          {editMode ? (
            <>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUserCircle className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input block w-full pl-10 sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaKey className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="form-input block w-full pl-10 sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <IoIosArrowBack className="mr-2 h-5 w-5" aria-hidden="true" />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Settings
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FaUserCircle className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{userSettings.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FaKey className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Password</p>
                    <p className="text-sm text-gray-500">********</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleConfirmModal}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Account
              </button>
            </>
          )}
        </div>
      </div>

      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}

      {confirmModal && (
        <ConfirmationModal
          title="Delete Account"
          message="Are you sure you want to permanently delete your account? This action cannot be undone."
          onConfirm={() => {}}
          onCancel={handleCloseModal}
        />
      )}
    </div>
  );
};

export default SettingsPage;