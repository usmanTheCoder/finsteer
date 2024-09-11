'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import { updateUserSettings, selectUserSettings, selectUserSettingsStatus } from '../store/settingsSlice';
import { validateEmail, validatePassword } from '../utils/validation';
import ConfirmationModal from './ConfirmationModal';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';

const UserSettings = () => {
  const dispatch = useDispatch();
  const userSettings = useSelector(selectUserSettings);
  const userSettingsStatus = useSelector(selectUserSettingsStatus);

  const [username, setUsername] = useState(userSettings.username);
  const [email, setEmail] = useState(userSettings.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setUsername(userSettings.username);
    setEmail(userSettings.email);
  }, [userSettings]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError(validateEmail(e.target.value) ? '' : 'Invalid email address');
  };

  const handleCurrentPasswordChange = (e) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    setPasswordError(validatePassword(e.target.value) ? '' : 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
  };

  const handleConfirmNewPasswordChange = (e) => {
    setConfirmNewPassword(e.target.value);
    setConfirmPasswordError(e.target.value === newPassword ? '' : 'Passwords do not match');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailError && !passwordError && !confirmPasswordError) {
      setIsLoading(true);
      setIsError(false);

      try {
        await dispatch(updateUserSettings({
          username,
          email,
          currentPassword,
          newPassword,
        }));
        setShowConfirmation(true);
      } catch (err) {
        setIsError(true);
        setErrorMessage(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-2xl font-bold">User Settings</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="flex items-center space-x-2">
            <FaUser className="text-gray-500" />
            <span>Username</span>
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
        </div>

        <div>
          <label htmlFor="email" className="flex items-center space-x-2">
            <FaEnvelope className="text-gray-500" />
            <span>Email</span>
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            className={`border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 w-full`}
          />
          {emailError && <ErrorMessage message={emailError} />}
        </div>

        <div>
          <label htmlFor="currentPassword" className="flex items-center space-x-2">
            <FaLock className="text-gray-500" />
            <span>Current Password</span>
          </label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={handleCurrentPasswordChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="flex items-center space-x-2">
            <FaLock className="text-gray-500" />
            <span>New Password</span>
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={handleNewPasswordChange}
            className={`border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 w-full`}
          />
          {passwordError && <ErrorMessage message={passwordError} />}
        </div>

        <div>
          <label htmlFor="confirmNewPassword" className="flex items-center space-x-2">
            <FaLock className="text-gray-500" />
            <span>Confirm New Password</span>
          </label>
          <input
            type="password"
            id="confirmNewPassword"
            value={confirmNewPassword}
            onChange={handleConfirmNewPasswordChange}
            className={`border ${confirmPasswordError ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 w-full`}
          />
          {confirmPasswordError && <ErrorMessage message={confirmPasswordError} />}
        </div>

        <button
          type="submit"
          disabled={isLoading || emailError || passwordError || confirmPasswordError}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader size="sm" /> : 'Update Settings'}
        </button>
      </form>

      {isError && <ErrorMessage message={errorMessage} />}

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={handleConfirmationClose}
        title="Success"
        message="Your user settings have been updated successfully."
      />
    </div>
  );
};

export default UserSettings;