'use client';

import { IconType } from 'react-icons';
import { MdInsertChart } from 'react-icons/md';

interface ReportIconProps {
  size?: number;
  color?: string;
  className?: string;
}

const ReportIcon: React.FC<ReportIconProps> = ({
  size = 24,
  color = 'currentColor',
  className,
}) => {
  return (
    <MdInsertChart
      size={size}
      color={color}
      className={`inline-block ${className}`}
    />
  );
};

export default ReportIcon;