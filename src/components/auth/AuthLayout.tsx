import React from 'react';
import logoImage from 'figma:asset/991ae2b932337e09452e4b99d1ed6a73c11299d5.png';
import { AuthSlider } from './AuthSlider';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  backButton?: React.ReactNode;
}

export function AuthLayout({ children, title, subtitle, backButton }: AuthLayoutProps) {
  // Read dark mode preference from localStorage
  React.useEffect(() => {
    const savedMode = localStorage.getItem('qp_dark_mode');
    if (savedMode === 'true') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <div className="min-h-screen flex w-full bg-white overflow-hidden font-sans transition-colors duration-300">
      {/* Left Side - Slider (Hidden on mobile) */}
      <div className="hidden lg:block w-1/2 relative bg-[#0E2250] transition-colors duration-300">
         <AuthSlider />
         
         {/* Logo Overlay on Slider */}
         <div className="absolute top-8 left-8 z-20 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <img src={logoImage} alt="QPON.lk" className="h-8 w-auto brightness-0 invert" />
         </div>
         
         <div className="absolute bottom-8 right-8 z-20 text-right">
             <p className="text-xs text-white/40 font-medium">© 2026 QPON Merchant Portal</p>
         </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 xl:p-20 bg-gray-50/30 relative transition-colors duration-300">
         {/* Mobile Logo */}
         <div className="lg:hidden absolute top-6 left-6">
             <img src={logoImage} alt="QPON.lk" className="h-8 w-auto dark:brightness-0 dark:invert transition-all duration-300" />
         </div>

        <div className="w-full max-w-md space-y-8 bg-white dark:bg-gradient-to-br dark:from-[#0A0A0A] dark:to-[#141414] p-8 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-black/50 border border-gray-100 dark:border-[#2A2A2A] transition-colors duration-300">
          {backButton && (
            <div className="mb-6">
              {backButton}
            </div>
          )}
          
          <div className="text-center lg:text-left space-y-2">
            <h1 className="text-3xl font-bold text-[#0E2250] dark:text-white tracking-tight transition-colors duration-300">{title}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-base transition-colors duration-300">{subtitle}</p>
          </div>

          {children}
        </div>
        
        {/* Mobile Footer */}
        <div className="mt-8 text-center lg:hidden">
             <p className="text-xs text-gray-400 dark:text-gray-500 transition-colors duration-300">© 2025 QPON.lk Merchant Portal</p>
        </div>
      </div>
    </div>
  );
}