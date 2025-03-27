
import React, { useState, useEffect } from 'react';
import { Camera, Settings, Accessibility, Globe, Volume2, Vibrate, Cpu, BadgeCheck, DollarSign } from 'lucide-react';
import { AppProvider, useAppContext } from '@/context/AppContext';
import Header from '@/components/Header';
import CameraView from '@/components/CameraView';
import LoadingIndicator from '@/components/LoadingIndicator';
import ResultDisplay from '@/components/ResultDisplay';
import ErrorDisplay from '@/components/ErrorDisplay';
import SettingsPanel from '@/components/SettingsPanel';
import AccessibilitySettings from '@/components/AccessibilitySettings';
import FinancialAssistant from '@/components/FinancialAssistant';

// Add a new component for the animated hero section
const AnimatedHero = ({ onScanClick, onSettingsClick, onAccessibilityClick }: { 
  onScanClick: () => void, 
  onSettingsClick: () => void,
  onAccessibilityClick: () => void
}) => {
  const { language, isOnline } = useAppContext();
  
  const translations = {
    welcomeTitle: {
      english: "Currency Identification",
      hindi: "मुद्रा पहचान",
      tamil: "நாணய அடையாளம்",
      telugu: "కరెన్సీ గుర్తింపు",
      bengali: "মুদ্রা শনাক্তকরণ"
    },
    welcomeMessage: {
      english: "Empowering Financial Independence for the Visually Impaired",
      hindi: "दृष्टिबाधित लोगों के लिए वित्तीय स्वतंत्रता को सशक्त बनाना",
      tamil: "பார்வைக் குறைபாடுள்ளவர்களுக்கான நிதி சுதந்திரத்தை அதிகாரப்படுத்துதல்",
      telugu: "దృష్టి లోపం ఉన్నవారికి ఆర్థిక స్వాతంత్ర్యాన్ని బలోపేతం చేయడం",
      bengali: "দৃষ্টিহীনদের জন্য আর্থিক স্বাধীনতাকে শক্তিশালী করা"
    },
    scanCurrency: {
      english: "Scan Currency",
      hindi: "मुद्रा स्कैन करें",
      tamil: "நாணயத்தை ஸ்கேன் செய்யவும்",
      telugu: "కరెన్సీని స్కాన్ చేయండి",
      bengali: "মুদ্রা স্ক্যান করুন"
    },
    settings: {
      english: "Settings",
      hindi: "सेटिंग्स",
      tamil: "அமைப்புகள்",
      telugu: "సెట్టింగులు",
      bengali: "সেটিংস"
    },
    accessibility: {
      english: "Accessibility",
      hindi: "सुलभता",
      tamil: "அணுகல்தன்மை",
      telugu: "ప్రాప్యత",
      bengali: "অ্যাক্সেসযোগ্যতা"
    },
    offlineMode: {
      english: "Offline Mode",
      hindi: "ऑफलाइन मोड",
      tamil: "ஆஃப்லைன் முறை",
      telugu: "ఆఫ్‌లైన్ మోడ్",
      bengali: "অফলাইন মোড"
    },
    accessibilityFeatures: {
      english: "Accessibility Features",
      hindi: "सुलभता सुविधाएँ",
      tamil: "அணுகல் அம்சங்கள்",
      telugu: "ప్రాప్యత ఫీచర్లు",
      bengali: "অ্যাক্সেসিবিলিটি ফিচার"
    },
    voiceFeedback: {
      english: "Voice Feedback",
      hindi: "आवाज़ फीडबैक",
      tamil: "குரல் கருத்து",
      telugu: "వాయిస్ ఫీడ్‌బ్యాక్",
      bengali: "ভয়েস ফিডব্যাক"
    },
    vibrationAlerts: {
      english: "Vibration Alerts",
      hindi: "कंपन अलर्ट",
      tamil: "அதிர்வு எச்சரிக்கைகள்",
      telugu: "వైబ్రేషన్ అలర్ట్‌లు",
      bengali: "কম্পন সতর্কতা"
    },
    aiPowered: {
      english: "AI-Powered Recognition",
      hindi: "AI संचालित पहचान",
      tamil: "AI-இயக்கப்படும் அங்கீகாரம்",
      telugu: "AI-పవర్డ్ గుర్తింపు",
      bengali: "AI-পাওয়ারড রিকগনিশন"
    },
    highAccuracy: {
      english: "High Accuracy",
      hindi: "उच्च सटीकता",
      tamil: "உயர் துல்லியம்",
      telugu: "అధిక ఖచ్చితత్వం",
      bengali: "উচ্চ নির্ভুলতা"
    }
  };
  
  const getText = (key: keyof typeof translations) => {
    return translations[key][language as keyof typeof translations[keyof typeof translations]] || translations[key].english;
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      <div className="flex flex-col gap-8 items-center text-center">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight animate-fade-in">
            {getText('welcomeTitle')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground animate-fade-in delay-100 max-w-2xl mx-auto">
            {getText('welcomeMessage')}
          </p>
        </div>
        
        <div className="glass-card p-8 rounded-2xl w-full max-w-md flex flex-col gap-5 animate-fade-in delay-200">
          <button
            onClick={onScanClick}
            className="primary-button flex items-center justify-center gap-2"
            aria-label={getText('scanCurrency')}
          >
            <Camera className="h-6 w-6" />
            {getText('scanCurrency')}
          </button>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onSettingsClick}
              className="secondary-button py-3 flex items-center justify-center gap-2"
              aria-label={getText('settings')}
            >
              <Settings className="h-5 w-5" />
              {getText('settings')}
            </button>
            
            <button
              onClick={onAccessibilityClick}
              className="secondary-button py-3 flex items-center justify-center gap-2"
              aria-label={getText('accessibility')}
            >
              <Accessibility className="h-5 w-5" />
              {getText('accessibility')}
            </button>
          </div>
          
          <button
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg border transition-colors
              ${!isOnline 
                ? 'bg-destructive/10 text-destructive border-destructive/20' 
                : 'bg-muted/50 text-muted-foreground border-muted hover:bg-muted'
              }`}
            disabled={!isOnline}
          >
            <Globe className="h-5 w-5" />
            {getText('offlineMode')}
            <div className={`ml-2 h-2 w-2 rounded-full ${!isOnline ? 'bg-destructive animate-pulse' : 'bg-green-500'}`}></div>
          </button>
        </div>
        
        {/* Currency symbol background decoration */}
        <div className="relative w-full h-40 overflow-hidden opacity-20 mt-8">
          <div className="absolute -top-8 -left-8 text-6xl font-bold text-primary/30">$</div>
          <div className="absolute top-2 left-1/4 text-7xl font-bold text-primary/20">€</div>
          <div className="absolute top-10 right-1/4 text-8xl font-bold text-primary/25">£</div>
          <div className="absolute -bottom-10 right-10 text-9xl font-bold text-primary/15">¥</div>
          <div className="absolute bottom-4 left-1/3 text-6xl font-bold text-primary/20">₹</div>
        </div>
      </div>
    </div>
  );
};

const HomeContent: React.FC = () => {
  const { 
    status, 
    mode, 
    startCamera, 
    goToHome, 
    goToSettings,
    goToAccessibility
  } = useAppContext();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Handle wearable mode special rendering
  if (mounted && mode === 'wearable' && status === 'idle') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 animate-fade-in">
        <div 
          className="glass-card bg-black/40 border-white/20 p-6 rounded-full mb-4 animate-pulse-subtle cursor-pointer hover:bg-black/50 transition-colors"
          onClick={() => {
            goToHome();
          }}
          role="button"
          aria-label="Go to home page"
        >
          <span className="text-white text-2xl font-bold">CurrencySence</span>
        </div>
        
        <button
          onClick={startCamera}
          className="wearable-button group relative overflow-hidden animate-scale-in"
          aria-label="Scan Currency"
        >
          <span className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></span>
          <div className="flex flex-col items-center">
            <Camera className="h-10 w-10 mb-2" />
            <span className="text-gradient">Scan Currency</span>
          </div>
        </button>
        
        <div className="mt-8 flex gap-4">
          <button
            onClick={goToSettings}
            className="p-4 rounded-full bg-black/40 border border-white/20 text-white hover:bg-white/10 transition-colors duration-200 focus-visible-ring"
            aria-label="Settings"
          >
            <Settings className="h-6 w-6" />
          </button>
          
          <button
            onClick={goToAccessibility}
            className="p-4 rounded-full bg-black/40 border border-white/20 text-white hover:bg-white/10 transition-colors duration-200 focus-visible-ring"
            aria-label="Accessibility"
          >
            <Accessibility className="h-6 w-6" />
          </button>
        </div>
      </div>
    );
  }
  
  if (status === 'camera') {
    return (
      <div className="min-h-screen flex flex-col p-4 md:p-6 gap-4">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center">
          <CameraView />
        </main>
      </div>
    );
  }
  
  if (status === 'processing') {
    return (
      <div className="min-h-screen flex flex-col p-4 md:p-6 gap-4">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center">
          <LoadingIndicator />
        </main>
      </div>
    );
  }
  
  if (status === 'result') {
    return (
      <div className="min-h-screen flex flex-col p-4 md:p-6 gap-4">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-8">
          <ResultDisplay />
        </main>
      </div>
    );
  }
  
  if (status === 'error') {
    return (
      <div className="min-h-screen flex flex-col p-4 md:p-6 gap-4">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center">
          <ErrorDisplay />
        </main>
      </div>
    );
  }
  
  if (status === 'settings') {
    return (
      <div className="min-h-screen flex flex-col p-4 md:p-6 gap-4">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-8">
          <SettingsPanel />
        </main>
      </div>
    );
  }
  
  if (status === 'accessibility') {
    return (
      <div className="min-h-screen flex flex-col p-4 md:p-6 gap-4">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-8">
          <AccessibilitySettings />
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6 gap-4">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center py-4">
        <AnimatedHero 
          onScanClick={startCamera} 
          onSettingsClick={goToSettings} 
          onAccessibilityClick={goToAccessibility}
        />
      </main>
      
      {/* Financial Assistant */}
      <FinancialAssistant />
      
      {/* Floating action button for quick access */}
      <button
        onClick={startCamera}
        className="floating-action-button"
        aria-label="Scan Currency"
      >
        <Camera className="h-6 w-6" />
      </button>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <AppProvider>
      <HomeContent />
    </AppProvider>
  );
};

export default Index;
