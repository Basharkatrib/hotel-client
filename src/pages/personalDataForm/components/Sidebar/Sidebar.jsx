// Sidebar.jsx
import React from "react";
import profileImg from "../../../../assets/personalDataForm/myProfile.jpg";
import {
  IoPersonCircleOutline,
  IoSettingsOutline,
  IoLogOutOutline,
} from "react-icons/io5";
import { MdOutlinePayment } from "react-icons/md";
import { FaSuitcaseRolling, FaRegHeart, FaAngleDown } from "react-icons/fa6";
import { BiSupport, BiCommentDetail } from "react-icons/bi";

function Sidebar() {
  const sidebarItems = [
    { label: "Personal Data", icon: IoPersonCircleOutline },
    { label: "Payment Account", icon: MdOutlinePayment },
    { label: "Trips", icon: FaSuitcaseRolling, hasArrow: true },
    { label: "Wish Lists", icon: FaRegHeart },
    { label: "Support", icon: BiSupport },
    { label: "Reviews", icon: BiCommentDetail },
    { isDivider: true },
    { label: "Settings", icon: IoSettingsOutline },
  ];

  return (
    <div className="w-full lg:w-[296px] bg-white shadow-md p-4 lg:p-8 mb-4 lg:mb-0 rounded-lg flex flex-col justify-between">
      {/* TOP SECTION */}
      <div className="flex flex-col gap-4  mt-20">
        {/* PROFILE */}
        <div className="flex items-center gap-3">
          <img
            src={profileImg}
            alt="profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h2 className="text-[16px] font-medium">Emmily Morgan</h2>
            <h5 className="text-sm text-gray-500">Customer Operations</h5>
          </div>
        </div>

        <hr className="border-gray-300" />

        {/* MENU ITEMS */}
        <div className="flex flex-col gap-2 lg:gap-4">
          {sidebarItems.map((item, index) => {
            if (item.isDivider) return <hr key={index} className="border-gray-300" />;

            const Icon = item.icon;

            return (
              <div
                key={index}
                className="flex items-center justify-between gap-3 cursor-pointer
                  h-[52px] hover:bg-[#E8EFFC] hover:text-[#0057FF] 
                  hover:border hover:border-[#E8EFFC] rounded-lg px-3 transition"
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
      <div className="flex items-center gap-3 cursor-pointer h-[52px] hover:text-red-600 mt-4 lg:mt-0">
        <IoLogOutOutline className="text-red-500 w-6 h-6" />
        <p className="text-[16px] font-medium text-red-500">Logout</p>
      </div>
    </div>
  );
}

export default Sidebar;
