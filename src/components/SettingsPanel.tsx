
import React from 'react';
import { Moon, Sun, VolumeX, Volume2, Smartphone, Glasses, Languages } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { speak, stopSpeaking } from '@/utils/speechUtils';

const SettingsPanel: React.FC = () => {
  const { 
    isDarkMode, 
    toggleDarkMode, 
    mode, 
    setMode, 
    language, 
    setLanguage,
    goToAccessibility
  } = useAppContext();
  
  const translations = {
    settings: {
      english: "Settings",
      hindi: "सेटिंग्स",
      tamil: "அமைப்புகள்",
      telugu: "సెట్టింగులు",
      bengali: "সেটিংস"
    },
    appearance: {
      english: "Appearance",
      hindi: "रूप",
      tamil: "தோற்றம்",
      telugu: "రూపం",
      bengali: "চেহারা"
    },
    darkMode: {
      english: "Dark Mode",
      hindi: "डार्क मोड",
      tamil: "இருள் முறை",
      telugu: "డార్క్ మోడ్",
      bengali: "ডার্ক মোড"
    },
    lightMode: {
      english: "Light Mode",
      hindi: "लाइट मोड",
      tamil: "ஒளி முறை",
      telugu: "లైట్ మోడ్",
      bengali: "লাইট মোড"
    },
    interface: {
      english: "Interface",
      hindi: "इंटरफ़ेस",
      tamil: "இடைமுகம்",
      telugu: "ఇంటర్ఫేస్",
      bengali: "ইন্টারফেস"
    },
    mobileMode: {
      english: "Mobile Mode",
      hindi: "मोबाइल मोड",
      tamil: "மொபைல் முறை",
      telugu: "మొబైల్ మోడ్",
      bengali: "মোবাইল মোড"
    },
    wearableMode: {
      english: "Wearable Mode",
      hindi: "वियरेबल मोड",
      tamil: "அணியக்கூடிய முறை",
      telugu: "ధరించదగిన మోడ్",
      bengali: "পরিধানযোগ্য মোড"
    },
    language: {
      english: "Language",
      hindi: "भाषा",
      tamil: "மொழி",
      telugu: "భాష",
      bengali: "ভাষা"
    },
    english: "English",
    hindi: "हिन्दी",
    tamil: "தமிழ்",
    telugu: "తెలుగు",
    bengali: "বাংলা",
    audio: {
      english: "Audio",
      hindi: "ऑडियो",
      tamil: "ஒலி",
      telugu: "ఆడియో",
      bengali: "অডিও"
    },
    testAudio: {
      english: "Test Audio",
      hindi: "ऑडियो टेस्ट करें",
      tamil: "ஒலியைச் சோதிக்கவும்",
      telugu: "ఆడియోని పరీక్షించండి",
      bengali: "অডিও পরীক্ষা করুন"
    },
    stopAudio: {
      english: "Stop Audio",
      hindi: "ऑडियो बंद करें",
      tamil: "ஒலியை நிறுத்து",
      telugu: "ఆడియోని ఆపండి",
      bengali: "অডিও বন্ধ করুন"
    },
    accessibilitySettings: {
      english: "Accessibility Settings",
      hindi: "पहुंच सेटिंग्स",
      tamil: "அணுகல் அமைப்புகள்",
      telugu: "ప్రాప్యత సెట్టింగులు",
      bengali: "অ্যাক্সেসিবিলিটি সেটিংস"
    }
  };
  
  const getText = (key: keyof typeof translations) => {
    if (key === 'english' || key === 'hindi' || key === 'tamil' || key === 'telugu' || key === 'bengali') {
      return translations[key];
    }
    return translations[key][language as keyof typeof translations[keyof typeof translations]] || translations[key].english;
  };
  
  const testAudioMessage = {
    english: "This is a test of the audio output. The currency identification results will be announced like this.",
    hindi: "यह ऑडियो आउटपुट का एक परीक्षण है। मुद्रा पहचान परिणाम इस तरह घोषित किए जाएंगे।",
    tamil: "இது ஒலி வெளியீட்டின் ஒரு சோதனை. நாணய அடையாள முடிவுகள் இவ்வாறு அறிவிக்கப்படும்.",
    telugu: "ఇది ఆడియో అవుట్‌పుట్ యొక్క పరీక్ష. కరెన్సీ గుర్తింపు ఫలితాలు ఇలా ప్రకటించబడతాయి.",
    bengali: "এটি অডিও আউটপুটের একটি পরীক্ষা। মুদ্রা শনাক্তকরণ ফলাফল এইভাবে ঘোষণা করা হবে।"
  };
  
  const handleTestAudio = () => {
    speak(testAudioMessage[language as keyof typeof testAudioMessage] || testAudioMessage.english);
  };
  
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as any);
  };
  
  return (
    <div className="w-full max-w-xl mx-auto animate-fade-in">
      <div className="glass-card p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">{getText('settings')}</h2>
        
        <div className="space-y-6">
          {/* Appearance */}
          <div>
            <h3 className="text-lg font-medium mb-3">{getText('appearance')}</h3>
            <div className="flex gap-4">
              <button
                onClick={toggleDarkMode}
                className={`flex-1 p-4 rounded-lg flex items-center justify-center gap-2
                  ${!isDarkMode ? 'bg-primary text-primary-foreground' : 'bg-secondary'}
                  transition-colors duration-200 focus-visible-ring
                `}
                aria-pressed={!isDarkMode}
              >
                <Sun className="h-5 w-5" />
                <span>{getText('lightMode')}</span>
              </button>
              
              <button
                onClick={toggleDarkMode}
                className={`flex-1 p-4 rounded-lg flex items-center justify-center gap-2
                  ${isDarkMode ? 'bg-primary text-primary-foreground' : 'bg-secondary'}
                  transition-colors duration-200 focus-visible-ring
                `}
                aria-pressed={isDarkMode}
              >
                <Moon className="h-5 w-5" />
                <span>{getText('darkMode')}</span>
              </button>
            </div>
          </div>
          
          {/* Interface Mode */}
          <div>
            <h3 className="text-lg font-medium mb-3">{getText('interface')}</h3>
            <div className="flex gap-4">
              <button
                onClick={() => setMode('mobile')}
                className={`flex-1 p-4 rounded-lg flex items-center justify-center gap-2
                  ${mode === 'mobile' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}
                  transition-colors duration-200 focus-visible-ring
                `}
                aria-pressed={mode === 'mobile'}
              >
                <Smartphone className="h-5 w-5" />
                <span>{getText('mobileMode')}</span>
              </button>
              
              <button
                onClick={() => setMode('wearable')}
                className={`flex-1 p-4 rounded-lg flex items-center justify-center gap-2
                  ${mode === 'wearable' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}
                  transition-colors duration-200 focus-visible-ring
                `}
                aria-pressed={mode === 'wearable'}
              >
                <Glasses className="h-5 w-5" />
                <span>{getText('wearableMode')}</span>
              </button>
            </div>
          </div>
          
          {/* Language */}
          <div>
            <h3 className="text-lg font-medium mb-3">
              <span className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                {getText('language')}
              </span>
            </h3>
            
            <select
              value={language}
              onChange={handleLanguageChange}
              className="w-full p-3 rounded-lg bg-secondary border-border focus-visible-ring"
              aria-label={getText('language')}
            >
              <option value="english">{getText('english')}</option>
              <option value="hindi">{getText('hindi')}</option>
              <option value="tamil">{getText('tamil')}</option>
              <option value="telugu">{getText('telugu')}</option>
              <option value="bengali">{getText('bengali')}</option>
            </select>
          </div>
          
          {/* Audio & Accessibility */}
          <div>
            <h3 className="text-lg font-medium mb-3">{getText('audio')}</h3>
            <div className="flex gap-4 mb-4">
              <button
                onClick={handleTestAudio}
                className="flex-1 p-4 rounded-lg bg-secondary flex items-center justify-center gap-2 focus-visible-ring"
              >
                <Volume2 className="h-5 w-5" />
                <span>{getText('testAudio')}</span>
              </button>
              
              <button
                onClick={stopSpeaking}
                className="p-4 rounded-lg bg-secondary flex items-center justify-center focus-visible-ring"
                aria-label={getText('stopAudio')}
              >
                <VolumeX className="h-5 w-5" />
              </button>
            </div>
            
            <button
              onClick={goToAccessibility}
              className="w-full p-4 rounded-lg bg-primary text-primary-foreground flex items-center justify-center gap-2 focus-visible-ring"
            >
              <Glasses className="h-5 w-5" />
              <span>{getText('accessibilitySettings')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
