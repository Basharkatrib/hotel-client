// MyProfile.jsx
import React, { useEffect, useState, useRef } from "react";
import { X, Save, Camera, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetUserQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useDeleteAvatarMutation,
} from "@/services/api";

const column1Fields = [
  {
    name: "first_name",
    label: "First Name",
    type: "text",
    placeholder: "Emmily",
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "em***an@gmail.com",
    readOnly: true,
  },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    options: [
      { label: "Gender", value: "" },
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
      { label: "Other", value: "other" },
    ],
  },
  {
    name: "birthday",
    label: "Birthday",
    type: "date",
    placeholder: "1997-06-17",
  },
  {
    name: "address",
    label: "Address",
    type: "text",
    placeholder: "123 Main Street, Spring",
  },
];

const column2Fields = [
  {
    name: "last_name",
    label: "Last Name",
    type: "text",
    placeholder: "Morgan",
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "text",
    placeholder: "(+34) 000 000 000",
  },
  {
    name: "country",
    label: "Country",
    type: "select",
    options: [
      { label: "Select country", value: "" },
      { label: "United States", value: "United States" },
      { label: "Canada", value: "Canada" },
      { label: "Spain", value: "Spain" },
    ],
  },
  { name: "zip_code", label: "Zip Code", type: "text", placeholder: "90210" },
];

function renderField(field, value, onChange) {


  if (field.type === "select") {
    return (
      <select
        className="w-full border border-gray-300 dark:border-gray-700 rounded-lg py-2.5 px-4 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      >
        {field.options.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }
  return (
    <input
      type={field.type}
      placeholder={field.placeholder}
      className="w-full border border-gray-300 dark:border-gray-700 rounded-lg py-2.5 px-4 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      readOnly={field.readOnly}
    />
  );
}

function MyProfile() {
  const { data, isLoading } = useGetUserQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();
  const [uploadAvatar, { isLoading: isUploading }] = useUploadAvatarMutation();
  const [deleteAvatar, { isLoading: isDeletingAvatar }] = useDeleteAvatarMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    avatar: "",
    phone: "",
    gender: "",
    birthday: "",
    address: "",
    country: "",
    zip_code: "",
  });

  useEffect(() => {
    const u = data?.data?.user;
    if (!u) return;

    setFormData({
      first_name: u.first_name || "",
      last_name: u.last_name || "",
      email: u.email || "",
      avatar: u.avatar || "",
      phone: u.phone || "",
      gender: u.gender || "",
      birthday: u.birthday ? String(u.birthday).substring(0, 10) : "",
      address: u.address || "",
      country: u.country || "",
      zip_code: u.zip_code || "",
    });
  }, [data]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData).unwrap();
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Failed to update profile", err);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await uploadAvatar(file).unwrap();
      const newAvatar = res?.data?.avatar || res?.avatar;
      if (newAvatar) {
        setFormData((prev) => ({ ...prev, avatar: newAvatar }));
        toast.success("Profile photo updated");
      }
    } catch (err) {
      console.error("Failed to upload avatar", err);
      toast.error("Failed to upload avatar. Please try again.");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAvatarDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAvatar = async () => {
    try {
      await deleteAvatar().unwrap();
      setFormData((prev) => ({ ...prev, avatar: "" }));
      toast.success("Profile photo removed");
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Failed to delete avatar", err);
      toast.error("Failed to delete profile photo.");
    }
  };

  return (
    <div className="w-full relative">
      <form
        className="bg-white dark:bg-card rounded-xl transition-colors duration-300"
        onSubmit={handleSubmit}
      >
        <div className="flex w-full items-center justify-between px-6 pt-6 pb-4">
          <div className="relative bg-blue-600 w-25 h-25 rounded-full dark:bg-gray-800 flex items-center justify-center text-2xl font-semibold text-white dark:text-gray-400">
            {formData.avatar ? (
              <>
                <img
                  src={formData.avatar.startsWith('http') ? formData.avatar : `${import.meta.env.VITE_API_URL || ''}${formData.avatar}`}
                  alt="Profile avatar"
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
                {/* Trash icon overlay when hovering or always? Let's do a top-right overlay */}
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="cursor-pointer absolute -top-1 -right-1 z-40 flex h-8 w-8 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-800 shadow-sm hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                  title="Delete profile photo"
                >
                  <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                </button>
              </>
            ) : (
              <span>
                {(formData.first_name?.[0] || "U").toUpperCase()}
              </span>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer absolute -bottom-1 -right-1 z-40 flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Upload profile photo"
              disabled={isUploading}
            >
              <Camera className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="cursor-pointer hidden"
              onChange={handleAvatarFileChange}
            />
          </div>

          {/* Right: Edit button aligned to far right */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white shadow-sm transition-all duration-300"
            title="Change profile photo"
            disabled={isUploading}
          >
            <Camera className="w-4 h-4" />
            <span>Edit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 px-6 pb-4">
          {/* Column 1 */}
          <div className="flex flex-col space-y-4">
            {column1Fields.map((field, idx) => {
              if (field.label === "Gender") {
                const birthdayField = column1Fields.find(
                  (f) => f.label === "Birthday"
                );
                return (
                  <div
                    key={idx}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12"
                  >
                    <div className="flex flex-col space-y-1">
                      <label className="text-[16px] font-medium text-gray-700 dark:text-gray-300">
                        {field.label}
                      </label>
                      {renderField(field, formData[field.name], (value) =>
                        handleChange(field.name, value)
                      )}
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="text-[16px] font-medium text-gray-700 dark:text-gray-300">
                        {birthdayField.label}
                      </label>
                      {renderField(
                        birthdayField,
                        formData[birthdayField.name],
                        (value) => handleChange(birthdayField.name, value)
                      )}
                    </div>
                  </div>
                );
              }
              if (field.label === "Birthday") return null;
              return (
                <div key={idx} className="flex flex-col space-y-1 mb-12">
                  <label className="text-[16px] font-medium text-gray-700 dark:text-gray-300">
                    {field.label}
                  </label>
                  {renderField(field, formData[field.name], (value) =>
                    handleChange(field.name, value)
                  )}
                </div>
              );
            })}
          </div>

          {/* Column 2 */}
          <div className="flex flex-col space-y-4">
            {column2Fields.map((field, idx) => (
              <div key={idx} className="flex flex-col space-y-1 mb-12">
                <label className="text-[16px] font-medium text-gray-700 dark:text-gray-300">
                  {field.label}
                </label>
                {renderField(field, formData[field.name], (value) =>
                  handleChange(field.name, value)
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <hr className="border-t border-gray-200 dark:border-gray-800" />

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 pb-3">
          <button className="cursor-pointer flex items-center justify-center px-6 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg shadow-sm font-semibold w-full sm:w-auto transition-all duration-300">
            <X className="w-5 h-5 mr-2" />
            Discard
          </button>
          <button className="cursor-pointer flex items-center justify-center px-6 py-2.5 border text-blue-700 dark:text-blue-400 border-blue-600 dark:border-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white rounded-lg shadow-md font-semibold w-full sm:w-auto transition-all duration-300">
            <Save className="w-5 h-5 mr-2" />
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 overflow-hidden"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Delete Photo?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                  Are you sure you want to remove your profile picture? This action cannot be undone.
                </p>
                <div className="flex w-full gap-3">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmDeleteAvatar}
                    disabled={isDeletingAvatar}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg shadow-red-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isDeletingAvatar ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MyProfile;
