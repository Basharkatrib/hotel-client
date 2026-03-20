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

import background from "../../../src/assets/ContactUs/background.png";

// إعداد الـ Leaflet Marker
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
    <div className="bg-gray-50  dark:bg-[#1e293b] flex items-center justify-center font-sans bg-gray-50 !pt-[80px] md:!pt-[120px] dark:bg-[#1e293b] flex items-center justify-center pb-7 md:pb-10 pl-7 pr-7 font-sans lg:h-[calc(100vh-85px)]]">
      <div className="relative w-full max-w-6xl bg-[#d8e4ff] md:max-w-[950px] dark:bg-gray-900 rounded-[15px] shadow-[1px_2px_25px_blue] overflow-hidden flex flex-col lg:flex-row-reverse p-4 md:p-5 gap-4 h-auto">
        {/* الصورة + الجملتين */}
        <div className="flex flex-col items-center text-center lg:hidden">
          <img
            src={background}
            alt="Contact Illustration"
            className="w-24 h-24 object-contain mb-2"
          />
          <h2 className="text-2xl font-bold text-[#4a4e69] dark:text-white mb-1">
            Get in Touch
          </h2>
          <p className="text-[#2563EB] mb-3 text-sm">
            We'd love to hear from you!
          </p>
        </div>

        {/* الفورم */}
        <div className="flex-1 bg-white/90 backdrop-blur-lg rounded-[20px] p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h1 className="text-2xl md:text-xl text-center font-bold text-[#4a4e69] mb-1">
              Contact Us
            </h1>
            <p className="text-gray-400 text-xs mb-4 text-center">
              Send us a message
            </p>

            <form className="space-y-3">
              {formFields.map((field, index) => (
                <input
                  key={index}
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 text-black border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all placeholder:text-gray-500 text-sm"
                />
              ))}

              <textarea
                placeholder="Your Message"
                rows="3"
                className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all placeholder:text-gray-500 resize-none text-sm"
              />

              <button className="w-full py-2.5 bg-[#2563EB] text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-all text-sm">
                Send Message
              </button>
            </form>
          </div>

          <div className="mt-4 pt-3 border-t border-dashed border-gray-200 flex justify-around items-center text-xs font-semibold text-gray-500">
            {quickActions.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center gap-1 cursor-pointer hover:text-indigo-600 transition-colors"
                >
                  <Icon size={20} className={item.color} />
                  <span className="text-[10px] font-bold">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* الخريطة + Contact Info */}
        <div className="flex-1 flex flex-col gap-4 justify-around">
          {/* Header Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <img
              src={background}
              alt="Contact"
              className="w-14 h-14 object-contain"
            />
            <div>
              <h2 className="text-xl font-bold text-[#4a4e69] dark:text-white">
                Get in Touch
              </h2>
              <p className="text-[#2563EB] text-sm">
                We'd love to hear from you!
              </p>
            </div>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 ">
            {contactCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-3 rounded-lg flex flex-col items-center text-center border shadow-sm"
                >
                  <div className={`${card.bg} p-2 rounded-full mb-1`}>
                    <Icon size={18} className={card.color} />
                  </div>
                  <p className="font-bold text-xs text-gray-800">
                    {card.title}
                  </p>
                  <p className="text-[10px] text-gray-500 break-all">
                    {card.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Map */}
          <div className="bg-white p-2 rounded-xl shadow-inner border h-48 overflow-hidden">
            <MapContainer
              center={position}
              zoom={13}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%", borderRadius: "0.75rem" }}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position}>
                <Popup>
                  Our Office <br /> 123 Main Street.
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
