// PersonalDataForm.jsx
import React from "react";
import Sidebar from "../personalDataForm/components/Sidebar/Sidebar.jsx";
import MyProfile from "../personalDataForm/components/MyProfile/MyProfile.jsx";

import profileImg from "../../assets/personalDataForm/myProfile.jpg";
import { IoCameraOutline } from "react-icons/io5";

function PersonalDataForm() {
  return (
    <div className="flex flex-col lg:flex-row p-4 lg:p-5">
      {/* Sidebar */}
      <Sidebar />

      {/* RIGHT SIDE */}
<div className="flex-1 p-4 sm:p-10 mt-4 sm:mt-20">
  {/* RIGHT HEADER */}
  <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full px-10 sm:mb-0 gap-4 sm:gap-0">
    {/* PROFILE IMAGE + TEXT */}
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-4">
      <img
        src={profileImg}
        alt="profile"
        className="w-24 h-24 sm:w-30 sm:h-30 rounded-full object-cover"
      />
      <div className="text-center sm:text-left">
        <h1 className="text-[20px] font-semibold text-gray-900">
          My Profile
        </h1>
        <h5 className="text-[15px] text-gray-500">
          Real-time information and activities of your prototype.
        </h5>
      </div>
    </div>

    {/* EDIT BUTTON */}
    <div className="flex items-center gap-2 cursor-pointer text-blue-600 justify-center sm:justify-end mt-2 sm:mt-0">
      <IoCameraOutline className="w-6 h-6 text-gray-500" />
      <span className="font-medium text-gray-500">Edit</span>
    </div>
  </div>

        <MyProfile />
</div>

      </div>
    
  );
}

export default PersonalDataForm;
