// MyProfile.jsx
import React from "react";
import { X, Save } from "lucide-react";

const column1Fields = [
  { label: "First Name", type: "text", placeholder: "Emmily" },
  { label: "Email Address", type: "email", placeholder: "em***an@gmail.com" },
  { label: "Gender", type: "select", options: ["♂♀ Gender", "♂ Male", "♀ Female", "⚥ Other"] },
  { label: "Birthday", type: "date", placeholder: "1997-06-17" },
  { label: "Address", type: "text", placeholder: "123 Main Street, Spring" },
];

const column2Fields = [
  { label: "Last Name", type: "text", placeholder: "Morgan" },
  { label: "Phone Number", type: "text", placeholder: "(+34) 000 000 000" },
  { label: "Country", type: "select", options: ["🌍 United States", "🇨🇦 Canada", "🇪🇸 Spain"] },
  { label: "Zip Code", type: "text", placeholder: "90210" },
];

function renderField(field) {
  if (field.type === "select") {
    return (
      <select className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-900 bg-white">
        {field.options.map((opt, idx) => (
          <option key={idx}>{opt}</option>
        ))}
      </select>
    );
  }
  return (
    <input
      type={field.type}
      placeholder={field.placeholder}
      className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-900 bg-white"
    />
  );
}

function MyProfile() {
  return (
    <div className="w-full">
      <div className="bg-white rounded-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
          {/* Column 1 */}
          <div className="flex flex-col space-y-4">
            {column1Fields.map((field, idx) => {
              if (field.label === "Gender") {
                const birthdayField = column1Fields.find(f => f.label === "Birthday");
                return (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                    <div className="flex flex-col space-y-1">
                      <label className="text-[16px] font-medium text-gray-700">{field.label}</label>
                      {renderField(field)}
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="text-[16px] font-medium text-gray-700">{birthdayField.label}</label>
                      {renderField(birthdayField)}
                    </div>
                  </div>
                );
              }
              if (field.label === "Birthday") return null;
              return (
                <div key={idx} className="flex flex-col space-y-1 mb-12">
                  <label className="text-[16px] font-medium text-gray-700">{field.label}</label>
                  {renderField(field)}
                </div>
              );
            })}
          </div>

          {/* Column 2 */}
          <div className="flex flex-col space-y-4">
            {column2Fields.map((field, idx) => (
              <div key={idx} className="flex flex-col space-y-1 mb-12">
                <label className="text-[16px] font-medium text-gray-700">{field.label}</label>
                {renderField(field)}
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
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
