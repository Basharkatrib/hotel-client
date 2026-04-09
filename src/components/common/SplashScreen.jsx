import React, { useEffect } from "react";
import { motion } from "framer-motion";
import logo from "../../assets/Home/navbar/Logo-hotel.svg";

const SplashScreen = ({ finishLoading }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      finishLoading();
    }, 2500); // 2.5 seconds
    return () => clearTimeout(timer);
  }, [finishLoading]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-[#0f172a]"
    >
      <div className="relative flex flex-col items-center">
        {/* Animated Background Ring */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-32 h-32 bg-blue-500/10 rounded-full blur-xl"
        />
        
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        >
          <img src={logo} alt="Vayka Logo" className="h-20 w-auto relative z-10" />
        </motion.div>

        {/* Loading bar */}
        <div className="mt-8 w-48 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden relative z-10">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{
              duration: 2,
              ease: "easeInOut",
            }}
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 w-full"
          />
        </div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400 tracking-widest uppercase"
        >
          Loading Vayka...
        </motion.p>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
