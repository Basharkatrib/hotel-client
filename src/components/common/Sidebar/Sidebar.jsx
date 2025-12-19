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
    <div className="w-full sticky top-0 h-screen  bg-white p-4 lg:p-8 mb-4 lg:mb-0 flex flex-col justify-between overflow-y-auto">
      {/* TOP SECTION */}
      <div className="flex flex-col gap-4">
        {/* PROFILE */}
        <div className="flex items-center gap-3">
          <img
            src={`${import.meta.env.VITE_API_URL}${user?.data?.user?.avatar}` || profileImg}
            alt="profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h2 className="text-[16px] font-medium">{user?.data?.user?.first_name || 'User'}</h2>
            <h5 className="text-[12px] text-gray-500">{user?.data?.user?.email || 'Customer Operations'}</h5>
          </div>
        </div>

        <hr className="border-gray-300" />

        {/* MENU ITEMS */}
        <div className="flex flex-col gap-2 lg:gap-4">
          {sidebarItems.map((item, index) => {
            if (item.isDivider) return <hr key={index} className="border-gray-300" />;

            const Icon = item.icon;
            const active = isActive(item.path || '');

            return (
              <div
                key={index}
                onClick={() => handleItemClick(item)}
                className={`flex items-center justify-between gap-3 cursor-pointer
                  p-3 rounded-lg px-3 transition
                  ${active 
                    ? 'bg-[#E8EFFC] text-[#0057FF] border border-[#E8EFFC]' 
                    : 'hover:bg-[#E8EFFC] hover:text-[#0057FF] hover:border hover:border-[#E8EFFC]'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6" />
                  <p className="text-[16px] font-medium">{item.label}</p>
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
        className="flex items-center gap-3 cursor-pointer h-[52px] hover:text-red-600 mt-4 lg:mt-0"
      >
        <IoLogOutOutline className="text-red-500 w-6 h-6" />
        <p className="text-[16px] font-medium text-red-500">Logout</p>
      </div>
    </div>
  );
}

export default Sidebar;
