'use client';

import { CSSProperties, FC, useEffect, useState } from 'react';
import { BsSpinner } from 'react-icons/bs';

interface LoaderProps {
  fullScreen?: boolean;
  customStyle?: CSSProperties;
}

const Loader: FC<LoaderProps> = ({ fullScreen = false, customStyle }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const spinnerClasses = `animate-spin text-primary-500 ${fullScreen ? 'h-12 w-12' : 'h-8 w-8'}`;

  return (
    <div
      className={`flex items-center justify-center ${fullScreen ? 'fixed inset-0 z-50 bg-black bg-opacity-50' : ''}`}
      style={customStyle}
    >
      <BsSpinner className={spinnerClasses} />
    </div>
  );
};

export default Loader;