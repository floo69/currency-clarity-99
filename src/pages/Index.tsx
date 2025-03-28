
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Banknote, Camera, BadgeIndianRupee, Sparkles, Check } from 'lucide-react';
import Header from '@/components/Header';
import CameraView from '@/components/CameraView';
import ResultDisplay from '@/components/ResultDisplay';
import ErrorDisplay from '@/components/ErrorDisplay';
import LoadingIndicator from '@/components/LoadingIndicator';
import SettingsPanel from '@/components/SettingsPanel';
import AccessibilitySettings from '@/components/AccessibilitySettings';
import FinancialAssistant from '@/components/FinancialAssistant';

const Index = () => {
  const { status, startCamera, language } = useAppContext();
  
  const translations = {
    title: {
      english: "Indian Currency Recognition",
      hindi: "भारतीय मुद्रा पहचान",
      tamil: "இந்திய நாணய அடையாளம்",
      telugu: "భారతీయ కరెన్సీ గుర్తింపు",
      bengali: "ভারতীয় মুদ্রা শনাক্তকরণ"
    },
    subtitle: {
      english: "Scan and identify Indian Rupee banknotes",
      hindi: "भारतीय रुपये के नोट स्कैन करें और पहचानें",
      tamil: "இந்திய ரூபாய் நோட்டுகளை ஸ்கேன் செய்து அடையாளம் காணவும்",
      telugu: "భారతీయ రూపాయి నోట్లను స్కాన్ చేసి గుర్తించండి",
      bengali: "ভারতীয় রুপি নোট স্ক্যান করুন এবং চিহ্নিত করুন"
    },
    scanNow: {
      english: "Scan Now",
      hindi: "अभी स्कैन करें",
      tamil: "இப்போது ஸ்கேன் செய்யவும்",
      telugu: "ఇప్పుడు స్కాన్ చేయండి",
      bengali: "এখনই স্ক্যান করুন"
    },
    features: {
      english: "Features",
      hindi: "विशेषताएँ",
      tamil: "அம்சங்கள்",
      telugu: "ఫీచర్లు",
      bengali: "বৈশিষ্ট্য"
    },
    instantRecognition: {
      english: "Instant Recognition",
      hindi: "त्वरित पहचान",
      tamil: "உடனடி அங்கீகாரம்",
      telugu: "తక్షణ గుర్తింపు",
      bengali: "তাৎক্ষণিক শনাক্তকরণ"
    },
    securePrivate: {
      english: "Secure & Private",
      hindi: "सुरक्षित और निजी",
      tamil: "பாதுகாப்பான & தனிப்பட்ட",
      telugu: "సురక్షితం & ప్రైవేట్",
      bengali: "নিরাপদ এবং ব্যক্তিগত"
    },
    supportedCurrencies: {
      english: "Supported Currencies",
      hindi: "समर्थित मुद्राएँ",
      tamil: "ஆதரிக்கப்படும் நாணயங்கள்",
      telugu: "మద్దతు ఉన్న కరెన్సీలు",
      bengali: "সমর্থিত মুদ্রা"
    },
    indianRupee: {
      english: "Indian Rupee",
      hindi: "भारतीय रुपया",
      tamil: "இந்திய ரூபாய்",
      telugu: "భారతీయ రూపాయి",
      bengali: "ভারতীয় রুপি"
    }
  };
  
  const getText = (key: keyof typeof translations) => {
    return translations[key][language as keyof typeof translations[keyof typeof translations]] || translations[key].english;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container px-4 py-6 sm:px-6 md:py-8 animate-fade-in">
        {status === 'idle' && (
          <div className="flex flex-col items-center">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold mb-2">{getText('title')}</h1>
              <p className="text-muted-foreground">{getText('subtitle')}</p>
            </div>
            
            <div className="w-full max-w-md mx-auto mb-8">
              <div className="glass-card p-6 rounded-lg shadow-lg text-center">
                <div className="mb-6 relative">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Banknote className="h-12 w-12 text-primary" />
                  </div>
                  <div className="absolute -right-2 -top-2 bg-primary text-primary-foreground p-1 rounded-full">
                    <BadgeIndianRupee className="h-6 w-6" />
                  </div>
                </div>
                
                <button 
                  onClick={startCamera}
                  className="primary-button w-full flex items-center justify-center gap-2 py-3 text-lg"
                >
                  <Camera className="h-5 w-5" />
                  {getText('scanNow')}
                </button>
              </div>
            </div>
            
            <div className="w-full max-w-2xl">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                {getText('features')}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="glass-card p-4 rounded-lg flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Camera className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{getText('instantRecognition')}</h3>
                    <p className="text-sm text-muted-foreground">Identify banknotes in seconds</p>
                  </div>
                </div>
                
                <div className="glass-card p-4 rounded-lg flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <BadgeIndianRupee className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{getText('securePrivate')}</h3>
                    <p className="text-sm text-muted-foreground">No data is stored or shared</p>
                  </div>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BadgeIndianRupee className="h-5 w-5 text-primary" />
                {getText('supportedCurrencies')}
              </h2>
              
              <div className="glass-card p-4 rounded-lg mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <BadgeIndianRupee className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{getText('indianRupee')}</h3>
                    <p className="text-sm text-muted-foreground">₹10, ₹20, ₹50, ₹100, ₹200, ₹500, ₹2000</p>
                  </div>
                  <div className="p-1 bg-green-100 dark:bg-green-900 rounded-full">
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {status === 'camera' && <CameraView />}
        {status === 'processing' && <LoadingIndicator />}
        {status === 'result' && <ResultDisplay />}
        {status === 'error' && <ErrorDisplay />}
        {status === 'settings' && <SettingsPanel />}
        {status === 'accessibility' && <AccessibilitySettings />}
      </main>
      
      <FinancialAssistant />
    </div>
  );
};

export default Index;
