'use client';

import { FaCog } from 'react-icons/fa';
import { IconProps } from './types';

const SettingsIcon = ({ className, ...props }: IconProps) => {
  return (
    <FaCog
      className={`text-gray-500 transition-colors duration-300 ease-in-out hover:text-primary ${className}`}
      {...props}
    />
  );
};

export default SettingsIcon;