// MyProfile.jsx
import React, { useEffect, useState, useRef } from "react";
import { X, Save, Camera } from "lucide-react";
import { toast } from "react-toastify";
import { useGetUserQuery, useUpdateProfileMutation, useUploadAvatarMutation } from "@/services/api";

const column1Fields = [
  { name: "first_name", label: "First Name", type: "text", placeholder: "Emmily" },
  { name: "email", label: "Email Address", type: "email", placeholder: "em***an@gmail.com", readOnly: true },
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
  { name: "birthday", label: "Birthday", type: "date", placeholder: "1997-06-17" },
  { name: "address", label: "Address", type: "text", placeholder: "123 Main Street, Spring" },
];

const column2Fields = [
  { name: "last_name", label: "Last Name", type: "text", placeholder: "Morgan" },
  { name: "phone", label: "Phone Number", type: "text", placeholder: "(+34) 000 000 000" },
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
        className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-900 bg-white"
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
      className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-900 bg-white"
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
    // الـ API بيرجع الشكل: { status, data: { user: {...} } }
    // لذلك نقرأ من data.data.user وليس data.user مباشرة
    const u = data?.data?.user || data?.user;

    if (u) {
      setFormData((prev) => ({
        ...prev,
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
      }));
    }
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
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="w-full">
      <form className="bg-white rounded-xl" onSubmit={handleSubmit}>
        {/* Avatar + Edit button row */}
        <div className="flex w-full items-center justify-between px-6 pt-6 pb-4">
          {/* Left: avatar with small camera icon */}
          <div className="relative w-25 h-25 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-semibold text-gray-600">
            {formData.avatar ? (
              <img
                src={`${import.meta.env.VITE_API_URL}${formData.avatar}`}
                alt="Profile avatar"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span>
                {(formData.first_name?.[0] || "") + (formData.last_name?.[0] || "") || "U"}
              </span>
            )}

            {/* Small camera button on avatar */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 z-40 flex h-8 w-8 items-center justify-center rounded-full bg-white border border-gray-300 shadow hover:bg-gray-100"
              title="Upload profile photo"
              disabled={isUploading}
            >
              <Camera className="w-4 h-4 text-gray-700" />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleAvatarFileChange}
            />
          </div>

          {/* Right: Edit button aligned to far right */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 shadow-sm"
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
                const birthdayField = column1Fields.find(f => f.label === "Birthday");
                return (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                    <div className="flex flex-col space-y-1">
                      <label className="text-[16px] font-medium text-gray-700">{field.label}</label>
                      {renderField(
                        field,
                        formData[field.name],
                        (value) => handleChange(field.name, value)
                      )}
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="text-[16px] font-medium text-gray-700">{birthdayField.label}</label>
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
                  <label className="text-[16px] font-medium text-gray-700">{field.label}</label>
                  {renderField(
                    field,
                    formData[field.name],
                    (value) => handleChange(field.name, value)
                  )}
                </div>
              );
            })}
          </div>

          {/* Column 2 */}
          <div className="flex flex-col space-y-4">
            {column2Fields.map((field, idx) => (
              <div key={idx} className="flex flex-col space-y-1 mb-12">
                <label className="text-[16px] font-medium text-gray-700">{field.label}</label>
                {renderField(
                  field,
                  formData[field.name],
                  (value) => handleChange(field.name, value)
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <hr className="border-t border-gray-200" />

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 pb-3">
          <button className="flex items-center justify-center px-6 py-2.5 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg shadow-sm font-semibold w-full sm:w-auto">
            <X className="w-5 h-5 mr-2" />
            Discard
          </button>
          <button className="flex items-center justify-center px-6 py-2.5 border text-blue-700 border-blue-600 hover:bg-blue-700 hover:text-white rounded-lg shadow-md font-semibold w-full sm:w-auto">
            <Save className="w-5 h-5 mr-2" />
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MyProfile;
