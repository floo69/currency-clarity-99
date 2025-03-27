
import React, { useState, useEffect } from 'react';
import { Camera, Settings, Info, Volume2, Vibrate, Fingerprint, Award, BadgeCheck, Cpu } from 'lucide-react';
import { AppProvider, useAppContext } from '@/context/AppContext';
import Header from '@/components/Header';
import CameraView from '@/components/CameraView';
import LoadingIndicator from '@/components/LoadingIndicator';
import ResultDisplay from '@/components/ResultDisplay';
import ErrorDisplay from '@/components/ErrorDisplay';
import SettingsPanel from '@/components/SettingsPanel';

// Add a new component for the animated hero section
const AnimatedHero = ({ onScanClick }: { onScanClick: () => void }) => {
  const { language } = useAppContext();
  
  const translations = {
    welcomeTitle: {
      english: "Currency Identification",
      hindi: "मुद्रा पहचान",
      tamil: "நாணய அடையாளம்",
      telugu: "కరెన్సీ గుర్తింపు",
      bengali: "মুদ্রা শনাক্তকরণ"
    },
    welcomeMessage: {
      english: "Scan any banknote to identify its denomination",
      hindi: "किसी भी नोट को स्कैन करके उसका मूल्य पहचानें",
      tamil: "எந்த நோட்டையும் ஸ்கேன் செய்து அதன் மதிப்பை அடையாளம் காணுங்கள்",
      telugu: "ఏదైనా బ్యాంకు నోటును స్కాన్ చేయండి",
      bengali: "যেকোন ব্যাংক নোট স্ক্যান করে এর মূল্যমান চিহ্নিত করুন"
    },
    scanCurrency: {
      english: "Scan Currency",
      hindi: "मुद्रा स्कैन करें",
      tamil: "நாணயத்தை ஸ்கேன் செய்யவும்",
      telugu: "కరెన్సీని స్కాన్ చేయండి",
      bengali: "মুদ্রা স্ক্যান করুন"
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
    },
    multiCurrency: {
      english: "Multi-Currency Support",
      hindi: "बहु-मुद्रा समर्थन",
      tamil: "பல-நாணய ஆதரவு",
      telugu: "మల్టీ-కరెన్సీ మద్దతు",
      bengali: "মাল্টি-কারেন্সি সমর্থন"
    }
  };
  
  const getText = (key: keyof typeof translations) => {
    return translations[key][language as keyof typeof translations[keyof typeof translations]] || translations[key].english;
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="flex flex-col space-y-6">
          <div className="space-y-2 max-w-lg">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight animate-fade-in">
              {getText('welcomeTitle')}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground animate-fade-in delay-100">
              {getText('welcomeMessage')}
            </p>
          </div>
          
          <button
            onClick={onScanClick}
            className="primary-button flex items-center justify-center gap-2 max-w-xs animate-fade-in delay-200"
            aria-label={getText('scanCurrency')}
          >
            <Camera className="h-6 w-6" />
            {getText('scanCurrency')}
          </button>
          
          <div className="grid grid-cols-2 gap-4 pt-8 animate-fade-in delay-300">
            <FeatureCard 
              icon={<Volume2 className="h-8 w-8 text-primary" />}
              title={getText('voiceFeedback')}
            />
            <FeatureCard 
              icon={<Vibrate className="h-8 w-8 text-primary" />}
              title={getText('vibrationAlerts')}
            />
            <FeatureCard 
              icon={<Cpu className="h-8 w-8 text-primary" />}
              title={getText('aiPowered')}
            />
            <FeatureCard 
              icon={<BadgeCheck className="h-8 w-8 text-primary" />}
              title={getText('highAccuracy')}
            />
          </div>
        </div>
        
        <div className="relative flex items-center justify-center">
          <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden glass-card animate-float">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10"></div>
            
            {/* Animated currency elements */}
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute w-32 h-32 bg-gradient-to-br from-green-500/20 to-green-700/20 rounded-xl -rotate-12 animate-float top-1/4 left-1/4"></div>
              <div className="absolute w-40 h-20 bg-gradient-to-br from-blue-500/20 to-blue-700/20 rounded-xl rotate-12 animate-bounce-subtle delay-700 bottom-1/4 right-1/4"></div>
              
              <div className="relative z-10 bg-background/40 backdrop-blur-sm rounded-xl p-6 max-w-[80%] border border-primary/20 shadow-lg animate-pulse-subtle">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Fingerprint className="h-6 w-6 text-primary" />
                  </div>
                  <div className="h-4 w-16 bg-primary/20 rounded-full"></div>
                </div>
                <div className="h-6 w-36 bg-primary/20 rounded-full mb-2"></div>
                <div className="h-4 w-24 bg-muted rounded-full mb-6"></div>
                <div className="h-20 w-full bg-muted/60 rounded-lg mb-3"></div>
                <div className="h-8 w-full bg-primary/30 rounded-full"></div>
              </div>
            </div>
          </div>
          
          {/* Corner decoration elements */}
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
        </div>
      </div>
      
      {/* Features section */}
      <div className="mt-20 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 animate-fade-in">{getText('accessibilityFeatures')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureLargeCard 
            icon={<Volume2 className="h-10 w-10 p-2 bg-primary/10 rounded-full text-primary" />}
            title={getText('voiceFeedback')}
            delay={100}
          />
          <FeatureLargeCard 
            icon={<Vibrate className="h-10 w-10 p-2 bg-primary/10 rounded-full text-primary" />}
            title={getText('vibrationAlerts')}
            delay={200}
          />
          <FeatureLargeCard 
            icon={<Award className="h-10 w-10 p-2 bg-primary/10 rounded-full text-primary" />}
            title={getText('multiCurrency')}
            delay={300}
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
  <div className="glass-card p-4 rounded-lg flex items-center gap-3 hover:shadow-md transition-shadow">
    {icon}
    <span className="font-medium">{title}</span>
  </div>
);

const FeatureLargeCard = ({ icon, title, delay = 0 }: { icon: React.ReactNode, title: string, delay?: number }) => (
  <div className={`glass-card p-6 rounded-lg text-center hover:shadow-md transition-all hover:-translate-y-1 animate-fade-in delay-${delay}`}>
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
  </div>
);

const HomeContent: React.FC = () => {
  const { status, mode, startCamera, goToHome } = useAppContext();
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
          <span className="text-white text-2xl font-bold">CurrencySight</span>
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
            className="p-4 rounded-full bg-black/40 border border-white/20 text-white hover:bg-white/10 transition-colors duration-200 focus-visible-ring"
            aria-label="Settings"
          >
            <Settings className="h-6 w-6" />
          </button>
          
          <button
            className="p-4 rounded-full bg-black/40 border border-white/20 text-white hover:bg-white/10 transition-colors duration-200 focus-visible-ring"
            aria-label="About"
          >
            <Info className="h-6 w-6" />
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
  
  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6 gap-4">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center py-4">
        <AnimatedHero onScanClick={startCamera} />
      </main>
      
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
