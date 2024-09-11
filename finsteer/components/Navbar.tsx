'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { FaBars, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { AiOutlineHome, AiOutlineUser, AiOutlineTransaction, AiOutlineAreaChart, AiOutlineSetting } from 'react-icons/ai';
import { IoMdLogOut } from 'react-icons/io';
import { RootState } from '@/store';
import { logout } from '@/store/authSlice';
import { toggleSidebar } from '@/store/settingsSlice';
import useAuth from '@/hooks/useAuth';

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { pathname } = useRouter();
  const { isSidebarOpen } = useSelector((state: RootState) => state.settings);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    setShowUserMenu(false);
  }, [pathname]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const toggleSidebarHandler = () => {
    dispatch(toggleSidebar());
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 bg-white shadow-md">
      <div className="flex items-center">
        <button className="mr-2 text-xl text-gray-600 hover:text-gray-800 focus:outline-none" onClick={toggleSidebarHandler}>
          <FaBars />
        </button>
        <Link href="/dashboard" className="flex items-center">
          <img src="/logo.png" alt="FinSteer" className="h-8 mr-2" />
          <span className="text-xl font-semibold text-gray-800">FinSteer</span>
        </Link>
      </div>
      <div className="relative">
        <button
          className="flex items-center text-gray-600 hover:text-gray-800 focus:outline-none"
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          <FaUserCircle className="text-2xl" />
          <span className="ml-2">{user?.name}</span>
        </button>
        {showUserMenu && (
          <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg">
            <Link
              href="/profile"
              className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100"
            >
              <AiOutlineUser className="mr-2" />
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
            >
              <IoMdLogOut className="mr-2" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;