import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import { IoMenu, IoClose } from 'react-icons/io5';
import { useGetUserQuery } from '@/services/api';

const AccountLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: user } = useGetUserQuery();
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <div className="w-full">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-transparent dark:border-gray-800"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? (
            <IoClose className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          ) : (
            <IoMenu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          )}
        </button>

        {/* Backdrop for Mobile */}
        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
            onClick={closeSidebar}
          />
        )}

        <div className="flex flex-col lg:flex-row">
          {/* Sidebar */}
          <div
            className={`
              fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
              transform transition-transform duration-300 ease-in-out
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
              lg:shrink-0
            `}
          >
            <Sidebar onClose={closeSidebar} user={user} />
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full bg-white dark:bg-gray-950 transition-colors duration-300">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
