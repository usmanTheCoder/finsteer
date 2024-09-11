'use client';

import React from 'react';
import { FaExchangeAlt } from 'react-icons/fa';

interface TransactionIconProps extends React.SVGAttributes<SVGElement> {
  variant?: 'income' | 'expense';
}

const TransactionIcon: React.FC<TransactionIconProps> = ({
  variant = 'income',
  ...props
}) => {
  const color = variant === 'income' ? 'text-green-500' : 'text-red-500';

  return (
    <FaExchangeAlt
      className={`${color} transition-colors duration-200 ease-in-out ${props.className}`}
      {...props}
    />
  );
};

export default TransactionIcon;