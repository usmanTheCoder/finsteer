'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AiOutlineMenuUnfold, AiOutlineMenuFold } from 'react-icons/ai';
import { FaChartLine, FaRegMoneyBillAlt, FaRegUserCircle, FaUniversity } from 'react-icons/fa';
import { IoSettingsOutline } from 'react-icons/io5';
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const menuItems = [
    {
      name: 'Dashboard',
      icon: <FaChartLine />,
      link: '/dashboard',
    },
    {
      name: 'Accounts',
      icon: <FaUniversity />,
      link: '/accounts',
    },
    {
      name: 'Transactions',
      icon: <FaRegMoneyBillAlt />,
      link: '/transactions',
    },
    {
      name: 'Reports',
      icon: <FaRegMoneyBillAlt />,
      link: '/reports',
    },
    {
      name: 'Settings',
      icon: <IoSettingsOutline />,
      link: '/settings',
    },
  ];

  return (
    <div
      className={`fixed z-20 h-screen p-4 pt-8 bg-gray-900 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between mb-8">
        <span className="text-white font-bold text-2xl">Finsteer</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white hover:text-gray-400 focus:outline-none"
        >
          {isOpen ? <AiOutlineMenuFold size={24} /> : <AiOutlineMenuUnfold size={24} />}
        </button>
      </div>
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.name} className="mb-4">
              <Link
                href={item.link}
                className="flex items-center text-gray-400 hover:text-white transition duration-200"
              >
                <span className="mr-4">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
          {isAuthenticated && (
            <li className="mt-8">
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-400 hover:text-white transition duration-200"
              >
                <span className="mr-4">
                  <FaRegUserCircle />
                </span>
                <span>Logout</span>
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;