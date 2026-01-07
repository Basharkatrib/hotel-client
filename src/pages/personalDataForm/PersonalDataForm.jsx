// PersonalDataForm.jsx
import React from "react";
import MyProfile from "../personalDataForm/components/MyProfile/MyProfile.jsx";
import profileImg from "../../assets/personalDataForm/myProfile.jpg";
import { IoCameraOutline } from "react-icons/io5";

function PersonalDataForm() {
  return (
    <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 pt-6 px-4 sm:px-6 transition-colors duration-300">

      <MyProfile />
    </div>
  );
}

export default PersonalDataForm;
