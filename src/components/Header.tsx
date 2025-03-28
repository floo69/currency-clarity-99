
import React, { useState, useEffect } from 'react';
import { Moon, Sun, Settings, Languages, Home, HelpCircle, Menu, X, WifiOff } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import ModeToggle from './ModeToggle';
import LanguageSelector from './LanguageSelector';

const Header: React.FC = () => {
  const { isDarkMode, toggleDarkMode, status, goToHome, goToSettings, language, isOnline } = useAppContext();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const translations = {
    settings: {
      english: "Settings",
      hindi: "सेटिंग्स",
      tamil: "அமைப்புகள்",
      telugu: "సెట్టింగులు",
      bengali: "সেটিংস"
    },
    help: {
      english: "Help",
      hindi: "मदद",
      tamil: "உதவி",
      telugu: "సహాయం",
      bengali: "সাহায্য"
    },
    menu: {
      english: "Menu",
      hindi: "मेनू",
      tamil: "மெனு",
      telugu: "మెను",
      bengali: "মেনু"
    },
    closeMenu: {
      english: "Close menu",
      hindi: "मेनू बंद करें",
      tamil: "மெனுவை மூடு",
      telugu: "మెను మూసివేయండి",
      bengali: "মেনু বন্ধ করুন"
    },
    offlineMode: {
      english: "Offline Mode",
      hindi: "ऑफलाइन मोड",
      tamil: "ஆஃப்லைன் முறை",
      telugu: "ఆఫ్‌లైన్ మోడ్",
      bengali: "অফলাইন মোড"
    }
  };
  
  const getText = (key: keyof typeof translations) => {
    return translations[key][language as keyof typeof translations[keyof typeof translations]] || translations[key].english;
  };
  
  // Track scroll to add shadow when scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header 
      className={`glass-card p-4 md:p-6 flex justify-between items-center animate-slide-down sticky top-0 z-50
                 ${scrolled ? 'shadow-md' : ''}`}
    >
      <div>
        <button 
          onClick={goToHome}
          className="focus-visible-ring text-xl md:text-2xl font-bold flex items-center gap-2 group"
          aria-label="Go to home"
        >
          <span className="relative">
            <span className="absolute -left-1 -top-1 w-8 h-8 bg-primary/20 rounded-full scale-75 group-hover:scale-100 transition-transform duration-300"></span>
            <span className="relative">Currency</span>
          </span>
          <span className="text-primary">Sense</span>
        </button>
      </div>
      
      {/* Desktop navigation */}
      <div className="hidden md:flex items-center gap-4 md:gap-6">
        {!isOnline && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-destructive/10 text-destructive rounded-full text-sm animate-pulse">
            <WifiOff className="h-4 w-4" />
            <span>{getText('offlineMode')}</span>
          </div>
        )}
        
        <button
          onClick={goToSettings}
          className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-muted transition-colors"
          aria-label={getText('settings')}
        >
          <Settings className="h-5 w-5" />
          <span>{getText('settings')}</span>
        </button>
        
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-muted transition-colors"
          aria-label={getText('help')}
        >
          <HelpCircle className="h-5 w-5" />
          <span>{getText('help')}</span>
        </button>
        
        <div className="h-6 w-px bg-border"></div>
        
        <button
          className="icon-button"
          onClick={toggleDarkMode}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? (
            <Sun className="h-6 w-6" />
          ) : (
            <Moon className="h-6 w-6" />
          )}
        </button>
        
        <LanguageSelector />
        
        <ModeToggle />
      </div>
      
      {/* Mobile menu button */}
      <div className="md:hidden flex items-center gap-2">
        {!isOnline && (
          <div className="flex items-center gap-1 px-2 py-1 bg-destructive/10 text-destructive rounded-full text-xs animate-pulse">
            <WifiOff className="h-3 w-3" />
          </div>
        )}
        
        <button
          className="icon-button"
          onClick={toggleDarkMode}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? (
            <Sun className="h-6 w-6" />
          ) : (
            <Moon className="h-6 w-6" />
          )}
        </button>
        
        <button
          className="icon-button"
          onClick={() => setMobileMenuOpen(true)}
          aria-label={getText('menu')}
          aria-expanded={mobileMenuOpen}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
      
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden animate-fade-in">
          <div className="fixed inset-y-0 right-0 w-full max-w-xs p-6 glass-card border-l overflow-y-auto animate-slide-in-right">
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={goToHome}
                className="focus-visible-ring text-xl font-bold"
                aria-label="Go to home"
              >
                <span className="text-primary">CurrencySense</span>
              </button>
              
              <button
                className="icon-button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label={getText('closeMenu')}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <nav className="flex flex-col gap-4">
              <button
                onClick={() => {
                  goToHome();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
              >
                <Home className="h-5 w-5" />
                <span className="text-lg">Home</span>
              </button>
              
              <button
                onClick={() => {
                  goToSettings();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
              >
                <Settings className="h-5 w-5" />
                <span className="text-lg">{getText('settings')}</span>
              </button>
              
              <button
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
              >
                <HelpCircle className="h-5 w-5" />
                <span className="text-lg">{getText('help')}</span>
              </button>
              
              <div className="h-px bg-border my-2"></div>
              
              <div className="px-4 py-2">
                <p className="text-sm text-muted-foreground mb-2">Language</p>
                <LanguageSelector />
              </div>
              
              <div className="px-4 py-2">
                <p className="text-sm text-muted-foreground mb-2">Interface Mode</p>
                <ModeToggle />
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
