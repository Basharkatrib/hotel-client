import React, { useState, useRef } from "react";
import {
  Building2,
  UserRound,
  FileText,
  Upload,
  CheckCircle2,
  HelpCircle,
  X,
  ChevronDown,
} from "lucide-react";

const PartnerForm = () => {
  const [formData, setFormData] = useState({
    hotelName: "",
    propertyAddress: "",
    legalName: "",
    jobTitle: "",
    email: "",
    phone: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState({
    businessLicense: false,
    vatCertificate: false,
    insuranceCertificate: false,
    representativeId: false,
  });

  const [isAgreed, setIsAgreed] = useState(false);

  const handleInputChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleFileUploadStatus = (field, isUploaded) => {
    setUploadedFiles((prev) => ({ ...prev, [field]: isUploaded }));
  };

  const isStep1Complete =
    formData.hotelName.trim() !== "" && formData.propertyAddress.trim() !== "";

  const isStep2Complete =
    formData.legalName.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.phone.trim() !== "";

  const isStep3Complete =
    uploadedFiles.businessLicense &&
    uploadedFiles.vatCertificate &&
    uploadedFiles.insuranceCertificate &&
    uploadedFiles.representativeId;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1e293b] pb-12 lg:pb-6 pt-24 px-4 sm:px-6 lg:px-8 font-sans text-slate-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white mb-4">
            Apply to become a Vayka Partner
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Join our exclusive network of premium hospitality providers. Please
            complete the professional registration form below to begin the
            verification process.
          </p>
        </div>

        {/* Stepper Progress */}
        <div className="relative mb-16 px-4">
          {/* حاوية الدوائر */}
          <div className="relative z-10 flex justify-between items-center w-full">
            <StepItem
              number="1"
              label="HOTEL INFO"
              active={isStep1Complete}
              position="start"
            />
            <StepItem
              number="2"
              label="REPRESENTATIVE"
              active={isStep2Complete}
              position="center"
            />
            <StepItem
              number="3"
              label="DOCUMENTS"
              active={isStep3Complete}
              position="end"
            />
          </div>
        </div>

        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          {/* Section 1: Hotel Information */}
          <SectionWrapper
            icon={
              <Building2
                className="text-blue-600 dark:text-blue-400"
                size={20}
              />
            }
            title="Hotel Information"
            subtitle="Basic operational details of your property."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup
                label="Legal Hotel Name"
                placeholder="e.g. Grand Vista Resort & Spa"
                value={formData.hotelName}
                onChange={(e) => handleInputChange(e, "hotelName")}
              />
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Property Type
                </label>
                <div className="relative">
                  <select className="w-full p-3 bg-gray-100 dark:bg-gray-800 dark:text-white border-none rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                    <option>Boutique Hotel</option>
                    <option>Resort</option>
                    <option>Apartment</option>
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-3.5 text-slate-400"
                    size={18}
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <InputGroup
                  label="Full Property Address"
                  placeholder="Street, City, State, Postal Code"
                  value={formData.propertyAddress}
                  onChange={(e) => handleInputChange(e, "propertyAddress")}
                />
              </div>
            </div>
          </SectionWrapper>

          {/* Section 2: Legal Representative */}
          <SectionWrapper
            icon={
              <UserRound
                className="text-blue-600 dark:text-blue-400"
                size={20}
              />
            }
            title="Legal Representative"
            subtitle="The primary point of contact for legal matters."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup
                label="Full Legal Name"
                value={formData.legalName}
                onChange={(e) => handleInputChange(e, "legalName")}
              />
              <InputGroup
                label="Job Title"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange(e, "jobTitle")}
              />
              <InputGroup
                label="Email Address"
                value={formData.email}
                onChange={(e) => handleInputChange(e, "email")}
              />
              <InputGroup
                label="Direct Phone Number"
                value={formData.phone}
                onChange={(e) => handleInputChange(e, "phone")}
              />
            </div>
          </SectionWrapper>

          {/* Section 3: Required Documents */}
          <SectionWrapper
            icon={
              <FileText
                className="text-blue-600 dark:text-blue-400"
                size={20}
              />
            }
            title="Required Documents"
            subtitle="Upload high-quality scans of the following legal documents."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UploadBox
                label="Business License"
                formats="PDF, JPG, PNG (MAX 5MB)"
                onFileChange={(status) =>
                  handleFileUploadStatus("businessLicense", status)
                }
              />
              <UploadBox
                label="VAT Certificate"
                formats="PDF, JPG, PNG (MAX 5MB)"
                onFileChange={(status) =>
                  handleFileUploadStatus("vatCertificate", status)
                }
              />
              <UploadBox
                label="Insurance Certificate"
                formats="PDF, JPG, PNG (MAX 5MB)"
                onFileChange={(status) =>
                  handleFileUploadStatus("insuranceCertificate", status)
                }
              />
              <UploadBox
                label="Representative ID"
                formats="PASSPORT OR NATIONAL ID"
                onFileChange={(status) =>
                  handleFileUploadStatus("representativeId", status)
                }
              />
            </div>
          </SectionWrapper>

          {/* Terms & Submit Section */}
          <div className="bg-gray-100/80 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="mt-1 rounded text-blue-600 focus:ring-blue-500 h-5 w-5"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                I hereby certify that the information provided is accurate and
                that I am authorized to register this property on the Vayka
                platform. I agree to the{" "}
                <a
                  href="#"
                  className="text-blue-600 dark:text-blue-400 underline"
                >
                  Partner Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-blue-600 dark:text-blue-400 underline"
                >
                  Privacy Policy
                </a>
                .
              </span>
            </label>

            <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    hotelName: "",
                    propertyAddress: "",
                    legalName: "",
                    jobTitle: "",
                    email: "",
                    phone: "",
                  });
                  setIsAgreed(false);
                  setUploadedFiles({
                    businessLicense: false,
                    vatCertificate: false,
                    insuranceCertificate: false,
                    representativeId: false,
                  });
                }}
                className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={
                  !isStep1Complete ||
                  !isStep2Complete ||
                  !isStep3Complete ||
                  !isAgreed
                }
                className={`px-10 py-3 font-bold rounded-xl transition-all shadow-lg ${
                  isStep1Complete &&
                  isStep2Complete &&
                  isStep3Complete &&
                  isAgreed
                    ? "bg-blue-700 text-white hover:bg-blue-800 shadow-blue-200 dark:shadow-none"
                    : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-600 cursor-not-allowed shadow-none"
                }`}
              >
                Submit Application
              </button>
            </div>
          </div>
        </form>
        {/* Support Banner */}
        <div className="mt-12 bg-blue-600 dark:bg-blue-700 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 dark:bg-blue-600 rounded-full -mr-20 -mt-20 opacity-50"></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex gap-6 items-start">
              <div className="bg-white/20 p-3 rounded-full">
                <CheckCircle2 size={32} />
              </div>
              <div className="max-w-md">
                <h3 className="text-2xl font-bold mb-2">Ready to submit?</h3>
                <p className="text-blue-100 leading-relaxed">
                  Our verification team typically reviews applications within
                  24-48 business hours. You'll receive an email notification
                  once your status is updated.
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 w-full lg:w-80">
              <div className="flex items-center gap-3 mb-4">
                <HelpCircle size={20} />
                <span className="font-semibold">Need assistance?</span>
              </div>
              <p className="text-sm text-blue-100 mb-4">
                Our partner support team is available 24/7 to help you.
              </p>
              <button className="w-full py-3 bg-white text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition-colors">
                Chat with Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const StepItem = ({ number, label, active, position }) => {
  const alignmentClass =
    position === "start"
      ? "items-start text-left"
      : position === "end"
      ? "items-end text-right"
      : "items-center text-center";

  return (
    <div className={`relative flex flex-col ${alignmentClass} flex-1`}>
      {/* الدائرة */}
      <div className="relative flex items-center justify-center w-full">
        {/* خط يسار */}
        {position !== "start" && (
          <div
            className={`absolute left-0 top-1/2 -translate-y-1/2 h-[2px] w-1/2 ${
              active ? "bg-blue-700" : "bg-gray-200 dark:bg-gray-700"
            }`}
          />
        )}

        {/* خط يمين */}
        {position !== "end" && (
          <div
            className={`absolute right-0 top-1/2 -translate-y-1/2 h-[2px] w-1/2 ${
              active ? "bg-blue-700" : "bg-gray-200 dark:bg-gray-700"
            }`}
          />
        )}

        {/* الدائرة نفسها */}
        <div
          className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
            active
              ? "bg-blue-700 text-white scale-110 shadow-lg"
              : "bg-gray-200 dark:bg-gray-900 text-gray-500 dark:text-white"
          }`}
        >
          {active ? <CheckCircle2 size={20} /> : number}
        </div>
      </div>

      {/* الليبل */}
      <span
        className={`flex items-center justify-center w-full text-[10px] font-bold tracking-wider mt-2 ${
          active
            ? "text-blue-700 dark:text-blue-400"
            : "text-gray-500 dark:text-white"
        }`}
      >
        {label}
      </span>
    </div>
  );
};

const SectionWrapper = ({ icon, title, subtitle, children }) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
    <div className="flex items-center gap-4 mb-8">
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          {title}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
    </div>
    {children}
  </div>
);

const InputGroup = ({ label, placeholder = "", value, onChange }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
      {label}
    </label>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-3 bg-gray-100 dark:bg-gray-800 dark:text-white border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
    />
  </div>
);

const UploadBox = ({ label, formats, onFileChange }) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      onFileChange(true);
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onFileChange(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </label>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {selectedFile ? (
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm h-[116px]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <CheckCircle2
                className="text-blue-600 dark:text-blue-400"
                size={20}
              />
            </div>
            <div>
              <p className="text-sm font-medium dark:text-white truncate max-w-[150px] sm:max-w-[200px]">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 uppercase">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • UPLOADED
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemoveFile}
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <div
          onClick={handleBoxClick}
          className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center gap-2 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-500 transition-all cursor-pointer group"
        >
          <Upload
            className="text-slate-400 group-hover:text-blue-500 transition-colors"
            size={24}
          />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Drag & drop or{" "}
            <span className="text-blue-600 dark:text-blue-400 font-semibold underline">
              Select File
            </span>
          </p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wide">
            {formats}
          </p>
        </div>
      )}
    </div>
  );
};

export default PartnerForm;
