import React from 'react';
import { LayoutDashboard, BarChart3, Headphones, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Subscribe = () => {
  return (
    // الخلفية الأساسية تتغير حسب الوضع
    <section className=" transition-colors duration-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row gap-10">
        
        {/* القسم الأيسر - محتوى النصوص */}
        <div className="flex-[0.8] flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest mb-4 w-fit border border-blue-100/50 dark:border-blue-800/30">
            EXCLUSIVE OPPORTUNITY
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-slate-800 dark:text-white leading-tight mb-4">
            A Journey of <br />
            <span className="text-blue-600 dark:text-blue-500 italic">Luxury</span>
          </h1>
          <p className="text-slate-400 dark:text-white text-sm leading-relaxed mb-8 max-w-xs">
            An elite management system designed for visionary hospitality leaders globally.
          </p>
          <div className="flex items-center gap-4 mb-10">
            <Link to="partner">
            <button className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-6 py-3 rounded-2xl text-sm font-medium flex items-center gap-2 shadow-md shadow-blue-100 dark:shadow-none transition-all active:scale-95">
              Register Now
              <ArrowRight size={16} />
            </button>
            </Link>
          </div>
        </div>

        {/* القسم الأيمن - شبكة الكروت (Dark Mode Ready) */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          
          {/* كرت 1 - Smart Dashboard */}
          <div className="bg-white dark:bg-slate-900/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex flex-col gap-3 transition-all duration-300 hover:shadow-xl dark:hover:bg-slate-800/80 transform-gpu will-change-transform">
            <div className="bg-blue-50 dark:bg-blue-900/20 w-10 h-10 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
              <LayoutDashboard size={20} />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Smart Dashboard</h3>
            <p className="text-[11px] text-slate-400 dark:text-white leading-normal">Full control from one screen.</p>
          </div>

          <div className="rounded-[2rem] overflow-hidden relative shadow-lg transform-gpu will-change-transform border border-transparent dark:border-slate-800">
            <img 
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=400" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              alt="Hotel"
            />
            <div className="absolute inset-0 bg-black/10 dark:bg-black/40 transition-colors pointer-events-none" />
          </div>

          {/* كرت 3 - Analytics */}
          <div className="bg-white dark:bg-slate-900/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex flex-col gap-3 transition-all duration-300 hover:shadow-xl dark:hover:bg-slate-800/80 transform-gpu will-change-transform">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 w-10 h-10 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <BarChart3 size={20} />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Analytics</h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-normal dark:text-white">Real-time behavior tracking.</p>
          </div>

          {/* كرت 4 - Support (نفس لون الصورة الغامقة) */}
          <div className="bg-slate-900 dark:bg-blue-600 p-6 rounded-[2rem] text-white flex flex-col gap-3 shadow-lg transition-all duration-300 hover:-translate-y-1 transform-gpu will-change-transform border border-slate-800 dark:border-blue-500">
            <div className="bg-white/10 w-10 h-10 rounded-xl flex items-center justify-center text-white">
              <Headphones size={20} />
            </div>
            <h3 className="text-sm font-bold">24/7 Support</h3>
            <p className="text-[11px] text-blue-100/70 dark:text-white/80 leading-normal">We guide you every step.</p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Subscribe;