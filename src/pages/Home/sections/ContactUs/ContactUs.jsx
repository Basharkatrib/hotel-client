import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  HelpCircle,
  Headset,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

import background from "../../../../../src/assets/ContactUs/background.png";

// إعداد أيقونة الماركر الافتراضية
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const position = [30.0444, 31.2357];

const formFields = [
  { type: "text", placeholder: "Your Name" },
  { type: "email", placeholder: "Your Email" },
  { type: "text", placeholder: "Subject" },
];

const quickActions = [
  { icon: MessageCircle, label: "Live Chat", color: "text-indigo-600" },
  { icon: HelpCircle, label: "FAQs", color: "text-blue-600" },
  { icon: Headset, label: "Support", color: "text-blue-600" },
];

const contactCards = [
  {
    icon: Phone,
    title: "Call Us",
    value: "+1 234 567 890",
    bg: "bg-indigo-100",
    color: "text-blue-600",
  },
  {
    icon: Mail,
    title: "Email Us",
    value: "info@example.com",
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    value: "123 Main Street, City",
    bg: "bg-pink-100",
    color: "text-pink-600",
  },
];

const ContactUs = () => {
  return (
    <div className="bg-gray-50 dark:bg-[#1e293b] flex items-center justify-center p-4 font-sans pt-[96px]">
      <div className="relative w-full max-w-5xl bg-[#d8e4ff] rounded-[15px] shadow-[1px_2px_35px_blue] overflow-hidden flex flex-col md:flex-row p-6 md:p-12 gap-8">
        
        {/* نصوص العنوان للموبايل فقط - تظهر أول شيء */}
        <div className="block md:hidden order-1 text-center">
          <h2 className="text-3xl font-bold text-[#4a4e69] mb-1">Get in Touch</h2>
          <p className="text-[#2563EB] mb-4">We'd love to hear from you!</p>
        </div>

        {/* صورة الموبايل */}
        <div className="w-full md:hidden flex items-center justify-center z-10 order-2">
          <img src={background} alt="Contact Illustration" className="max-h-48 object-contain w-[270px]" />
        </div>

        {/* الفورم */}
        <div className="flex-1 bg-white/90 backdrop-blur-lg rounded-[32px] p-8 shadow-xl z-10 order-3 md:order-2">
          <h1 className="text-3xl font-bold text-[#4a4e69] mb-1">Contact Us</h1>
          <p className="text-gray-400 text-sm mb-8">Send us a message</p>

          <form className="space-y-4">
            {formFields.map((field, index) => (
              <input
                key={index}
                type={field.type}
                placeholder={field.placeholder}
                className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-black focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all placeholder:text-gray-500"
              />
            ))}

            <textarea
              placeholder="Your Message"
              rows="4"
              className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-black focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all placeholder:text-gray-500 resize-none"
            />

            <button className="w-full py-4 bg-[#2563EB] text-white font-bold rounded-2xl shadow-lg hover:shadow-indigo-200 hover:scale-[1.01] active:scale-95 transition-all">
              Send Message
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-dashed border-gray-200 flex justify-between items-center text-xs font-semibold text-gray-500">
            {quickActions.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex flex-col items-center gap-1 cursor-pointer hover:text-indigo-600 transition-colors">
                  <Icon size={30} className={item.color} />
                  <span className="text-xs md:text-base font-bold">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* القسم الأيسر (يصبح تحت في الموبايل وبجانب الفورم في الديسكتوب) */}
        <div className="flex-1 z-10 flex flex-col order-4 md:order-1">
          <div className="hidden md:flex relative w-full h-48 mb-8 items-center justify-center">
            <img src={background} alt="Contact Illustration" className="max-h-full max-w-full object-contain w-[270px]" />
          </div>

          {/* نصوص العنوان للديسكتوب فقط */}
          <div className="hidden md:block">
            <h2 className="text-4xl font-bold text-[#4a4e69] mb-2">Get in Touch</h2>
            <p className="text-[#2563EB] mb-8">We'd love to hear from you!</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {contactCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={index}
                  className="bg-white backdrop-blur-md p-4 rounded-2xl flex flex-col items-center text-center border border-white/40 shadow-sm"
                >
                  <div className={`${card.bg} p-2 rounded-full mb-2`}>
                    <Icon size={25} className={card.color} />
                  </div>
                  <p className="font-bold text-sm text-gray-800">{card.title}</p>
                  <p className="text-[10px] text-gray-500 break-all">{card.value}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-white p-2 rounded-3xl shadow-inner border border-white/50 h-48 overflow-hidden">
            <MapContainer
              center={position}
              zoom={13}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%", borderRadius: "1.5rem" }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position}>
                <Popup>Our Office <br /> 123 Main Street.</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;