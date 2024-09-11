'use client';

import React, { forwardRef } from 'react';
import { FaWallet } from 'react-icons/fa';

interface AccountIconProps extends React.SVGProps<SVGSVGElement> {}

const AccountIcon = forwardRef<SVGSVGElement, AccountIconProps>((props, ref) => (
  <FaWallet ref={ref} {...props} />
));

AccountIcon.displayName = 'AccountIcon';

export default AccountIcon;