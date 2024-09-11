'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import { trpc } from '@utils/trpc';
import { ConfirmationModal, ErrorMessage, Loader } from '@components';
import { validateEmail, validatePassword } from '@utils/validation';

const RegisterPage = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const { mutate, isLoading, error } = trpc.auth.register.useMutation({
    onSuccess: () => {
      setShowModal(true);
    },
  });

  const handleRegister = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmPasswordError = password !== confirmPassword ? 'Passwords do not match' : '';
    const usernameError = username.trim().length < 3 ? 'Username must be at least 3 characters' : '';

    setEmailError(emailError);
    setPasswordError(passwordError);
    setConfirmPasswordError(confirmPasswordError);
    setUsernameError(usernameError);

    if (!emailError && !passwordError && !confirmPasswordError && !usernameError) {
      mutate({ email, username, password });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    router.push('/auth/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email
            <FaEnvelope className="inline ml-2 text-gray-500" />
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              emailError ? 'border-red-500' : ''
            }`}
            placeholder="Enter your email"
          />
          {emailError && <ErrorMessage message={emailError} />}
        </div>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 font-bold mb-2">
            Username
            <FaUser className="inline ml-2 text-gray-500" />
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              usernameError ? 'border-red-500' : ''
            }`}
            placeholder="Enter your username"
          />
          {usernameError && <ErrorMessage message={usernameError} />}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
            Password
            <FaLock className="inline ml-2 text-gray-500" />
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              passwordError ? 'border-red-500' : ''
            }`}
            placeholder="Enter your password"
          />
          {passwordError && <ErrorMessage message={passwordError} />}
        </div>
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-gray-700 font-bold mb-2">
            Confirm Password
            <FaLock className="inline ml-2 text-gray-500" />
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              confirmPasswordError ? 'border-red-500' : ''
            }`}
            placeholder="Confirm your password"
          />
          {confirmPasswordError && <ErrorMessage message={confirmPasswordError} />}
        </div>
        <button
          onClick={handleRegister}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          disabled={isLoading}
        >
          {isLoading ? <Loader /> : 'Register'}
        </button>
        {error && <ErrorMessage message={error.message} />}
      </div>
      <ConfirmationModal
        show={showModal}
        title="Registration Successful"
        message="Your account has been created. You can now log in."
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default RegisterPage;