'use client';

import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className }) => {
  return (
    <div
      className={`flex items-center bg-red-100 text-red-700 px-4 py-3 rounded-md ${className}`}
      role="alert"
    >
      <FaExclamationTriangle className="mr-2 h-5 w-5" />
      <span className="font-medium">{message}</span>
    </div>
  );
};

export default ErrorMessage;