'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { GrFormNext, GrFormPrevious } from 'react-icons/gr';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/authSlice';
import { loginUser } from '@/utils/auth';
import { validateEmail, validatePassword } from '@/utils/validation';
import ErrorMessage from '@/components/ErrorMessage';
import Loader from '@/components/Loader';

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formStep, setFormStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      const userData = await loginUser(email, password);
      dispatch(setUser(userData));
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const renderEmailStep = () => (
    <>
      <div className="mb-6">
        <label htmlFor="email" className="block mb-2 font-semibold">
          Email
        </label>
        <div className="relative">
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
          />
          <FaEnvelope className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <button
        type="button"
        className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
        onClick={() => setFormStep(2)}
      >
        Next <GrFormNext className="inline ml-2" />
      </button>
    </>
  );

  const renderPasswordStep = () => (
    <>
      <div className="mb-6">
        <label htmlFor="password" className="block mb-2 font-semibold">
          Password
        </label>
        <div className="relative">
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
            value={password}
            onChange={handlePasswordChange}
          />
          <FaLock className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          className="px-4 py-2 font-semibold text-white bg-gray-500 rounded-md hover:bg-gray-600"
          onClick={() => setFormStep(1)}
        >
          <GrFormPrevious className="inline mr-2" /> Back
        </button>
        <button
          type="submit"
          className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Login
        </button>
      </div>
    </>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Log in to your account
        </h2>
        {error && <ErrorMessage message={error} />}
        <form onSubmit={handleLogin}>
          {formStep === 1 ? renderEmailStep() : renderPasswordStep()}
        </form>
        {loading && <Loader />}
        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account?{' '}
          <a
            href="/auth/register"
            className="font-semibold text-blue-500 hover:text-blue-600"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;