import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  HelpCircle,
  Headset,
  Send,
  Loader2,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

import background from "../../../src/assets/ContactUs/background.webp";
import { useSendContactMessageMutation } from "../../services/api";
import { useTheme } from "../../context/ThemeContext";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const position = [30.0444, 31.2357];

const quickActions = [
  { icon: MessageCircle, label: "Live Chat" },
  { icon: HelpCircle, label: "FAQs" },
  { icon: Headset, label: "Support" },
];

const contactCards = [
  {
    icon: Phone,
    title: "Call Us",
    value: "+1 234 567 890",
    href: "tel:+1234567890",
  },
  {
    icon: Mail,
    title: "Email Us",
    value: "info@example.com",
    href: "mailto:info@example.com",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    value: "123 Main Street, City",
    href: null,
  },
];

const formFields = [
  { name: "name", type: "text", placeholder: "Your Name" },
  { name: "email", type: "email", placeholder: "Your Email" },
  { name: "subject", type: "text", placeholder: "Subject" },
];

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm";

const ContactUs = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [sendContactMessage, { isLoading }] = useSendContactMessageMutation();
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    try {
      const response = await sendContactMessage(formData).unwrap();
      if (response.status) {
        setStatus({ type: "success", message: "Your message has been sent!" });
        setFormData({ name: "", email: "", subject: "", message: "" });
      }
    } catch (err) {
      setStatus({
        type: "error",
        message: err.data?.message || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 mb-4">
            <img
              src={background}
              alt=""
              className="w-10 h-10 object-contain"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
            Get in Touch
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
            We'd love to hear from you. Send a message and our team will get
            back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
              {contactCards.map((card) => {
                const Icon = card.icon;
                const content = (
                  <>
                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                      <Icon size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">
                        {card.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 break-all mt-0.5">
                        {card.value}
                      </p>
                    </div>
                  </>
                );

                const className =
                  "flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-card border border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300";

                return card.href ? (
                  <a key={card.title} href={card.href} className={`${className} hover:border-blue-200 dark:hover:border-blue-800`}>
                    {content}
                  </a>
                ) : (
                  <div key={card.title} className={className}>
                    {content}
                  </div>
                );
              })}
            </div>

            <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-white dark:bg-card shadow-sm h-56 sm:h-64 relative z-0 transition-colors duration-300">
              <MapContainer
                key={theme}
                center={position}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url={
                    theme === "dark"
                      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  }
                />
                <Marker position={position}>
                  <Popup>Our Office</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white dark:bg-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8 transition-colors duration-300">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Send us a message
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Fill out the form and we'll reply shortly.
            </p>

            {status.message && (
              <div
                className={`mb-5 p-3 rounded-xl text-sm font-medium text-center ${
                  status.type === "success"
                    ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800"
                }`}
              >
                {status.message}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {formFields.map((field) => (
                <input
                  key={field.name}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              ))}

              <textarea
                name="message"
                placeholder="Your Message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
                className={`${inputClass} resize-none`}
              />

              <button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer w-full py-3.5 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-dashed border-gray-200 dark:border-gray-800 flex justify-around items-center">
              {quickActions.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex flex-col items-center gap-2 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800">
                      <Icon size={18} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-[11px] font-semibold tracking-wide">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
