// PersonalDataForm.jsx
import React from "react";
import MyProfile from "../personalDataForm/components/MyProfile/MyProfile.jsx";
import profileImg from "../../assets/personalDataForm/myProfile.jpg";
import { IoCameraOutline } from "react-icons/io5";

function PersonalDataForm() {
  return (
    <div className="w-full bg-white border border-gray-200 pt-6 px-4 sm:px-6">
      {/* RIGHT HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full sm:mb-4 gap-3">
        {/* PROFILE IMAGE + TEXT */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
          <img
            src={profileImg}
            alt="profile"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
          />
          <div className="text-center sm:text-left">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              My Profile
            </h1>
            <h5 className="text-xs sm:text-sm text-gray-500">
              Real-time information and activities of your prototype.
            </h5>
          </div>
        </div>

        {/* EDIT BUTTON */}
        <div className="flex items-center gap-1.5 cursor-pointer text-blue-600 justify-center sm:justify-end">
          <IoCameraOutline className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-500">Edit</span>
        </div>
      </div>

      <MyProfile />
    </div>
  );
}

export default PersonalDataForm;
