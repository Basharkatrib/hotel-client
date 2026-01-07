// Sidebar.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import profileImg from "../../../assets/personalDataForm/myProfile.jpg";
import {
  IoPersonCircleOutline,
  IoHomeOutline,
  IoSettingsOutline,
  IoLogOutOutline,
} from "react-icons/io5";
import { MdOutlinePayment } from "react-icons/md";
import { FaSuitcaseRolling, FaRegHeart, FaAngleDown } from "react-icons/fa6";
import { BiSupport, BiCommentDetail } from "react-icons/bi";
import { logout as logoutAction } from '../../../store/slices/authSlice';
import { useLogoutMutation } from '../../../services/api';
import { toast } from 'react-toastify';

function Sidebar({ onClose, user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [logoutMutation] = useLogoutMutation();

  const sidebarItems = [
    {
      label: "Home",
      icon: IoHomeOutline,
      path: "/",
      route: "/"
    },
    {
      label: "Personal Data",
      icon: IoPersonCircleOutline,
      path: "/my-profile",
      route: "/my-profile"
    },
    {
      label: "Trips",
      icon: FaSuitcaseRolling,
      path: "/my-bookings",
      route: "/my-bookings"
    },
    {
      label: "Wish Lists",
      icon: FaRegHeart,
      path: "/favorites",
      route: "/favorites"
    },
    { isDivider: true },

  ];

  const handleItemClick = (item) => {
    if (item.route) {
      navigate(item.route);
      // Close sidebar on mobile after navigation
      if (onClose) {
        onClose();
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(logoutAction());
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      // Even if API fails, logout locally
      dispatch(logoutAction());
      toast.error('Logout failed, but you have been logged out locally');
      navigate('/');
    }
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="w-full sticky top-0 h-screen bg-white dark:bg-gray-900 p-4 lg:p-8 mb-4 lg:mb-0 flex flex-col justify-between overflow-y-auto border-r border-transparent dark:border-gray-800 transition-colors duration-300">
      {/* TOP SECTION */}
      <div className="flex flex-col gap-4">
        {/* PROFILE */}
        <div className="flex items-center gap-3">
          <img
            src={`${import.meta.env.VITE_API_URL}${user?.data?.user?.avatar}` || profileImg}
            alt="profile"
            className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/20"
          />
          <div>
            <h2 className="text-[16px] font-bold text-gray-900 dark:text-white">{user?.data?.user?.first_name || 'User'}</h2>
            <h5 className="text-[12px] text-gray-500 dark:text-gray-400 font-medium">{user?.data?.user?.email || 'Customer Operations'}</h5>
          </div>
        </div>

        <hr className="border-gray-300 dark:border-gray-800" />

        {/* MENU ITEMS */}
        <div className="flex flex-col gap-2 lg:gap-3">
          {sidebarItems.map((item, index) => {
            if (item.isDivider) return <hr key={index} className="border-gray-300 dark:border-gray-800" />;

            const Icon = item.icon;
            const active = isActive(item.path || '');

            return (
              <div
                key={index}
                onClick={() => handleItemClick(item)}
                className={`flex items-center justify-between gap-3 cursor-pointer
                  p-3 rounded-xl transition-all duration-300
                  ${active
                    ? 'bg-[#E8EFFC] dark:bg-blue-900/30 text-[#0057FF] dark:text-blue-400 border border-[#E8EFFC] dark:border-blue-800/50 shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-[#E8EFFC] dark:hover:bg-gray-800 hover:text-[#0057FF] dark:hover:text-blue-400'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6" />
                  <p className="text-[15px] font-bold">{item.label}</p>
                </div>
                {item.hasArrow && <FaAngleDown />}
              </div>
            );
          })}
        </div>
      </div>

      {/* LOGOUT */}
      <div
        onClick={handleLogout}
        className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-300 group mt-4 lg:mt-0"
      >
        <IoLogOutOutline className="text-red-500 w-6 h-6 group-hover:scale-110 transition-transform" />
        <p className="text-[15px] font-bold text-red-500">Logout</p>
      </div>
    </div>
  );
}

export default Sidebar;
