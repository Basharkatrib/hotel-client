import React from "react";
import logoHotel from "../../../assets/Home/footer/Logo-hotel.svg";
import vector from "../../../assets/Home/footer/Vector.png";
import appleBlack from "../../../assets/Home/footer/apple-black.svg";
import googlePlay from "../../../assets/Home/footer/googlePlay.png";
import payment from "../../../assets/Home/footer/Payment Method.png";
import payment1 from "../../../assets/Home/footer/Payment Method (1).png";
import payment2 from "../../../assets/Home/footer/Payment Method (2).png";
import payment3 from "../../../assets/Home/footer/Payment Method (3).png";
import payment4 from "../../../assets/Home/footer/Payment Method (4).png";
import payment5 from "../../../assets/Home/footer/Payment Method (5).png";
import payment6 from "../../../assets/Home/footer/Payment Method (6).png";

import footerSections from "../Footer/Data/Data.js";

const Footer = () => {
  return (
    <footer
      className="
        bg-white dark:bg-card/95
        text-black dark:text-white
        pt-12
        backdrop-blur-xl
        border-t border-gray-200 dark:border-gray-800
        shadow-[0_-6px_16px_rgba(0,0,0,0.08)]
        dark:shadow-none
      "
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 mb-[80px]">
          {/* LEFT SECTION */}
          <div className="flex flex-col gap-8 w-full lg:w-1/3 items-start text-left">
            <div className="flex flex-col gap-3">
              <img
                src={logoHotel}
                alt="logo"
                className="w-28 md:w-32 mb-[10px]"
              />
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed max-w-xs">
                We help you find and book the perfect stay from cozy guesthouses
                to top hotels—with ease, trust, and the best deals.
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <h4 className="text-blue-700 dark:text-[rgba(153,189,255,1)] text-base md:text-lg font-semibold">
                Download Our App
              </h4>

              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <button className="flex items-center gap-3 bg-black/5 dark:bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-md hover:bg-black/10 dark:hover:bg-white/20 transition w-full sm:w-auto">
                  <img
                    src={appleBlack} // الصورة الافتراضية النهارية
                    alt="App Store"
                    className="w-7 h-7 dark:hidden" // تظهر بالنهار فقط
                  />
                  <img
                    src={vector} // الصورة الليلي
                    alt="App Store"
                    className="w-7 h-7 hidden dark:inline-block" // تظهر بالليل فقط
                  />                  <div className="flex flex-col text-left">
                    <p className="text-[10px] text-gray-600 dark:text-gray-300">
                      Download in the
                    </p>
                    <h2 className="text-sm font-semibold">App Store</h2>
                  </div>
                </button>

                <button className="flex items-center gap-3 bg-black/5 dark:bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-md hover:bg-black/10 dark:hover:bg-white/20 transition w-full sm:w-auto">
                  <img src={googlePlay} alt="Google Play" className="w-8 h-8" />
                  <div className="flex flex-col text-left">
                    <p className="text-[10px] text-gray-600 dark:text-gray-300">
                      GET IT ON
                    </p>
                    <h2 className="text-sm font-semibold">Google Play</h2>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="grid w-full lg:w-2/3 max-[500px]:grid-cols-1 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {footerSections.map((section, index) => (
              <div key={index} className="flex flex-col">
                <h2 className="text-blue-700 font-semibold text-base mb-2">
                  {section.title}
                </h2>

                {section.links.map((link, i) => (
                  <a
                    href=""
                    key={i}
                    className="
    text-sm
    text-gray-700 dark:text-gray-200
    leading-12

    hover:text-transparent
    hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-700
    hover:bg-clip-text

    dark:hover:text-[rgba(153,189,255,1)]
    dark:hover:bg-none
    dark:hover:bg-clip-text

    transition-all duration-300
  "
                  >
                    {link}
                  </a>
                ))}

                {section.socialIcons && (
                  <div className="flex items-center gap-3 mt-2">
                    {section.socialIcons.map((Icon, i) => (
                      <div
                        key={i}
                        className="p-2 bg-black/5 dark:bg-white/10 backdrop-blur-sm rounded-md"
                      >
                        <Icon className="text-black dark:text-white text-sm" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <hr className="mb-5 border-gray-300 dark:border-white/20" />

        <div className="py-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h6 className="text-black dark:text-white text-center sm:text-left">
              © 2025 VAYKA. All rights reserved.
            </h6>

            <div className="flex gap-2 flex-wrap justify-center">
              {[
                payment,
                payment1,
                payment2,
                payment3,
                payment4,
                payment5,
                payment6,
              ].map((img, i) => (
                <img key={i} className="w-[35px] h-[24px]" src={img} alt="" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
