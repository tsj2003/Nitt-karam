import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

// Khanda Image Component - Using the actual image file
const KhandaLogo: React.FC<{ className?: string }> = ({ className = "h-8 w-8" }) => (
  <img 
    src="/image.png" 
    alt="Khanda - Sikh Symbol"
    className={className}
  />
);

interface HeaderProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleDarkMode, isDarkMode }) => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'glass shadow-2xl py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Left side - Logo and Brand */}
        <div className="flex items-center group">
          <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-4 rounded-3xl shadow-2xl mr-6 transform group-hover:scale-110 transition-all duration-300">
            <KhandaLogo className="h-12 w-12" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
              Nitt Karam
            </h1>
            <p className="text-white/70 text-lg font-medium">
              Premium Task Management
            </p>
          </div>
        </div>
        
        {/* Center - App Tagline with Khanda Symbol */}
        <div className="hidden xl:flex items-center">
          <div className="text-center">
            {/* Small Khanda Symbol above the tagline */}
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-3 rounded-2xl shadow-xl transform hover:scale-110 transition-all duration-300">
                <img 
                  src="/image.png" 
                  alt="Khanda - Sikh Symbol"
                  className="h-6 w-6"
                />
              </div>
            </div>
            <p className="text-white/90 font-bold mb-2 text-xl">
              Premium Task Management
            </p>
            <p className="text-white/70 text-base">
              Organize • Plan • Achieve
            </p>
          </div>
        </div>
        
        {/* Right side - Dark Mode Toggle */}
        <div className="flex items-center">
          <button
            onClick={toggleDarkMode}
            className="glass px-6 py-3 rounded-2xl text-white font-semibold transition-all duration-300 hover:bg-white/20 hover:scale-105 active:scale-95 flex items-center space-x-2"
          >
            {isDarkMode ? (
              <>
                <Sun className="h-5 w-5" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="h-5 w-5" />
                <span>Dark</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;