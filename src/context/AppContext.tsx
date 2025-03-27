
import React, { createContext, useContext, useState, useEffect } from 'react';
import { speak, stopSpeaking } from '@/utils/speechUtils';
import { triggerHapticFeedback, HapticPatterns } from '@/utils/hapticUtils';
import { checkOnlineStatus, saveToLocalStorage, getFromLocalStorage } from '@/utils/offlineUtils';
import { preloadRecognitionModel, recognizeCurrency } from '@/utils/recognitionUtils';
import { useToast } from '@/hooks/use-toast';

type AppMode = 'mobile' | 'wearable';
type AppLanguage = 'english' | 'hindi' | 'tamil' | 'telugu' | 'bengali';
type AppStatus = 'idle' | 'camera' | 'processing' | 'result' | 'error' | 'settings' | 'accessibility';
type AppTheme = 'light' | 'dark' | 'high-contrast';
type VoiceSpeed = 'slow' | 'normal' | 'fast';

interface RecognitionResult {
  currency: string;
  denomination: string;
  confidence: number;
}

interface AppContextType {
  // Mode and language
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  
  // Voice and haptic settings
  voiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
  voiceSpeed: VoiceSpeed;
  setVoiceSpeed: (speed: VoiceSpeed) => void;
  hapticEnabled: boolean;
  setHapticEnabled: (enabled: boolean) => void;
  
  // Status and result management
  status: AppStatus;
  setStatus: (status: AppStatus) => void;
  result: RecognitionResult | null;
  setResult: (result: RecognitionResult | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
  
  // Camera and navigation
  imageSrc: string | null;
  setImageSrc: (src: string | null) => void;
  startCamera: () => void;
  goToHome: () => void;
  goToSettings: () => void;
  goToAccessibility: () => void;
  
  // Offline status
  isOnline: boolean;
  refreshOnlineStatus: () => Promise<boolean>;
  
  // Image recognition
  processCapturedImage: (imageData: string) => Promise<void>;
  isSupportedDevice: boolean;
  
  // Accessibility actions
  announceResult: (result: RecognitionResult) => void;
}

const defaultContext: AppContextType = {
  mode: 'mobile',
  setMode: () => {},
  language: 'english',
  setLanguage: () => {},
  isDarkMode: false,
  toggleDarkMode: () => {},
  theme: 'light',
  setTheme: () => {},
  
  voiceEnabled: true,
  setVoiceEnabled: () => {},
  voiceSpeed: 'normal',
  setVoiceSpeed: () => {},
  hapticEnabled: true,
  setHapticEnabled: () => {},
  
  status: 'idle',
  setStatus: () => {},
  result: null,
  setResult: () => {},
  error: null,
  setError: () => {},
  
  imageSrc: null,
  setImageSrc: () => {},
  startCamera: () => {},
  goToHome: () => {},
  goToSettings: () => {},
  goToAccessibility: () => {},
  
  isOnline: true,
  refreshOnlineStatus: async () => true,
  
  processCapturedImage: async () => {},
  isSupportedDevice: true,
  
  announceResult: () => {},
};

const AppContext = createContext<AppContextType>(defaultContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  // State
  const [mode, setMode] = useState<AppMode>(() => 
    getFromLocalStorage('mode', 'mobile') as AppMode
  );
  const [language, setLanguage] = useState<AppLanguage>(() => 
    getFromLocalStorage('language', 'english') as AppLanguage
  );
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => 
    getFromLocalStorage('darkMode', window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  const [theme, setTheme] = useState<AppTheme>(() =>
    getFromLocalStorage('theme', isDarkMode ? 'dark' : 'light') as AppTheme
  );
  
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(() =>
    getFromLocalStorage('voiceEnabled', true)
  );
  const [voiceSpeed, setVoiceSpeed] = useState<VoiceSpeed>(() =>
    getFromLocalStorage('voiceSpeed', 'normal') as VoiceSpeed
  );
  const [hapticEnabled, setHapticEnabled] = useState<boolean>(() =>
    getFromLocalStorage('hapticEnabled', true)
  );
  
  const [status, setStatus] = useState<AppStatus>('idle');
  const [result, setResult] = useState<RecognitionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSupportedDevice, setIsSupportedDevice] = useState<boolean>(true);
  
  // Initialize theme
  useEffect(() => {
    // Apply dark mode
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Apply high contrast theme if needed
    if (theme === 'high-contrast') {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    // Preload the recognition model
    preloadRecognitionModel().catch(err => {
      console.error('Failed to preload recognition model:', err);
      setIsSupportedDevice(false);
    });
  }, [isDarkMode, theme]);
  
  // Check online status on mount and set up listener
  useEffect(() => {
    const handleOnlineStatusChange = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      
      if (!online) {
        speak(getTranslation('offline_message'));
        toast({
          title: getTranslation('offline_title'),
          description: getTranslation('offline_message'),
          variant: "destructive",
        });
      } else if (status !== 'idle') {
        speak(getTranslation('back_online'));
        toast({
          title: getTranslation('online_title'),
          description: getTranslation('back_online'),
          variant: "default",
        });
      }
    };
    
    handleOnlineStatusChange();
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, [status]);
  
  // Save settings to localStorage
  useEffect(() => {
    saveToLocalStorage('mode', mode);
    saveToLocalStorage('language', language);
    saveToLocalStorage('darkMode', isDarkMode);
    saveToLocalStorage('theme', theme);
    saveToLocalStorage('voiceEnabled', voiceEnabled);
    saveToLocalStorage('voiceSpeed', voiceSpeed);
    saveToLocalStorage('hapticEnabled', hapticEnabled);
  }, [mode, language, isDarkMode, theme, voiceEnabled, voiceSpeed, hapticEnabled]);
  
  // Announce status changes for accessibility
  useEffect(() => {
    if (!voiceEnabled) return;
    
    if (status === 'camera') {
      speak(getTranslation('camera_ready'));
    } else if (status === 'processing') {
      speak(getTranslation('processing'));
    }
  }, [status, language, voiceEnabled]);
  
  // Process captured image for currency recognition
  const processCapturedImage = async (imageData: string) => {
    try {
      setStatus('processing');
      setImageSrc(imageData);
      
      // Recognize currency
      const recognitionResult = await recognizeCurrency(imageData);
      
      // Update state with result
      setResult(recognitionResult);
      setStatus('result');
      
      // Provide feedback
      if (hapticEnabled) {
        triggerHapticFeedback(HapticPatterns.SUCCESS);
      }
      
      if (voiceEnabled) {
        announceResult(recognitionResult);
      }
      
      // Show toast notification
      toast({
        title: getTranslation('recognition_success'),
        description: `${recognitionResult.denomination} ${recognitionResult.currency}`,
        variant: "default",
      });
    } catch (error) {
      console.error('Currency recognition error:', error);
      setError(getTranslation('recognition_error'));
      setStatus('error');
      
      if (hapticEnabled) {
        triggerHapticFeedback(HapticPatterns.ERROR);
      }
      
      toast({
        title: getTranslation('error_title'),
        description: getTranslation('recognition_error'),
        variant: "destructive",
      });
    }
  };
  
  // Translations
  const getTranslation = (key: string): string => {
    const translations: Record<string, Record<string, string>> = {
      camera_ready: {
        english: "Camera is ready. Position the banknote in the frame and tap to capture.",
        hindi: "कैमरा तैयार है। नोट को फ्रेम में रखें और कैप्चर करने के लिए टैप करें।",
        tamil: "கேமரா தயாராக உள்ளது. நோட்டை பிரேமில் வைத்து தட்டவும்.",
        telugu: "కెమెరా సిద్ధంగా ఉంది. నోటును ఫ్రేమ్‌లో ఉంచి, క్యాప్చర్ చేయడానికి తాకండి.",
        bengali: "ক্যামেরা প্রস্তুত। নোটটি ফ্রেমে রাখুন এবং ক্যাপচার করতে ট্যাপ করুন।"
      },
      processing: {
        english: "Processing the image. Please wait.",
        hindi: "छवि प्रोसेस हो रही है। कृपया प्रतीक्षा करें।",
        tamil: "படத்தை செயலாக்குகிறது. தயவுசெய்து காத்திருக்கவும்.",
        telugu: "చిత్రాన్ని ప్రాసెస్ చేస్తున్నాము. దయచేసి వేచి ఉండండి.",
        bengali: "ছবি প্রসেস করা হচ্ছে। অনুগ্রহ করে অপেক্ষা করুন।"
      },
      result_prefix: {
        english: "The banknote is identified as",
        hindi: "नोट की पहचान हुई है",
        tamil: "நோட்டு அடையாளம் காணப்பட்டது",
        telugu: "నోటు గుర్తించబడింది",
        bengali: "নোটটি চিহ্নিত করা হয়েছে"
      },
      offline_title: {
        english: "You're Offline",
        hindi: "आप ऑफलाइन हैं",
        tamil: "நீங்கள் ஆஃப்லைனில் உள்ளீர்கள்",
        telugu: "మీరు ఆఫ్‌లైన్‌లో ఉన్నారు",
        bengali: "আপনি অফলাইনে আছেন"
      },
      offline_message: {
        english: "You are offline. Some features may be limited.",
        hindi: "आप ऑफलाइन हैं। कुछ सुविधाएँ सीमित हो सकती हैं।",
        tamil: "நீங்கள் ஆஃப்லைனில் உள்ளீர்கள். சில அம்சங்கள் வரம்புக்குட்பட்டவை.",
        telugu: "మీరు ఆఫ్‌లైన్‌లో ఉన్నారు. కొన్ని ఫీచర్లు పరిమితం కావచ్చు.",
        bengali: "আপনি অফলাইন আছেন। কিছু বৈশিষ্ট্য সীমিত হতে পারে।"
      },
      online_title: {
        english: "You're Back Online",
        hindi: "आप फिर से ऑनलाइन हैं",
        tamil: "நீங்கள் மீண்டும் ஆன்லைனில் உள்ளீர்கள்",
        telugu: "మీరు తిరిగి ఆన్‌లైన్‌లో ఉన్నారు",
        bengali: "আপনি আবার অনলাইনে আছেন"
      },
      back_online: {
        english: "You are back online.",
        hindi: "आप फिर से ऑनलाइन हैं।",
        tamil: "நீங்கள் மீண்டும் ஆன்லைனில் உள்ளீர்கள்.",
        telugu: "మీరు తిరిగి ఆన్‌లైన్‌లో ఉన్నారు.",
        bengali: "আপনি আবার অনলাইনে আছেন।"
      },
      error_title: {
        english: "Error",
        hindi: "त्रुटि",
        tamil: "பிழை",
        telugu: "లోపం",
        bengali: "ত্রুটি"
      },
      error_message: {
        english: "An error occurred. Please try again.",
        hindi: "एक त्रुटि हुई। कृपया पुन: प्रयास करें।",
        tamil: "பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
        telugu: "లోపం సంభవించింది. దయచేసి మళ్ళీ ప్రయత్నించండి.",
        bengali: "একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।"
      },
      recognition_success: {
        english: "Currency Identified",
        hindi: "मुद्रा की पहचान हुई",
        tamil: "நாணயம் அடையாளம் காணப்பட்டது",
        telugu: "కరెన్సీ గుర్తించబడింది",
        bengali: "মুদ্রা চিহ্নিত করা হয়েছে"
      },
      recognition_error: {
        english: "Could not recognize the currency. Please try again with better lighting.",
        hindi: "मुद्रा को पहचाना नहीं जा सका। कृपया बेहतर रोशनी के साथ फिर से प्रयास करें।",
        tamil: "நாணயத்தை அடையாளம் காண முடியவில்லை. சிறந்த ஒளியுடன் மீண்டும் முயற்சிக்கவும்.",
        telugu: "కరెన్సీని గుర్తించలేకపోయాము. దయచేసి మెరుగైన లైటింగ్‌తో మళ్లీ ప్రయత్నించండి.",
        bengali: "মুদ্রা চিহ্নিত করা যায়নি। অনুগ্রহ করে ভালো আলোয় আবার চেষ্টা করুন।"
      }
    };
    
    return translations[key]?.[language] || translations[key]?.english || key;
  };
  
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
    setTheme(prev => prev === 'high-contrast' ? 'high-contrast' : (isDarkMode ? 'light' : 'dark'));
  };
  
  const startCamera = () => {
    setStatus('camera');
    setResult(null);
    setError(null);
  };
  
  const goToHome = () => {
    setStatus('idle');
    setResult(null);
    setError(null);
    setImageSrc(null);
  };
  
  const goToSettings = () => {
    setStatus('settings');
  };
  
  const goToAccessibility = () => {
    setStatus('accessibility');
  };
  
  const refreshOnlineStatus = async (): Promise<boolean> => {
    const online = await checkOnlineStatus();
    setIsOnline(online);
    return online;
  };
  
  const announceResult = (recognitionResult: RecognitionResult) => {
    const { currency, denomination } = recognitionResult;
    const message = `${getTranslation('result_prefix')} ${denomination} ${currency}`;
    
    const rate = voiceSpeed === 'slow' ? 0.8 : voiceSpeed === 'fast' ? 1.2 : 1;
    speak(message, rate);
    
    if (hapticEnabled) {
      triggerHapticFeedback(HapticPatterns.SUCCESS);
    }
  };
  
  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);
  
  const contextValue: AppContextType = {
    mode,
    setMode,
    language,
    setLanguage,
    isDarkMode,
    toggleDarkMode,
    theme,
    setTheme,
    
    voiceEnabled,
    setVoiceEnabled,
    voiceSpeed,
    setVoiceSpeed,
    hapticEnabled,
    setHapticEnabled,
    
    status,
    setStatus,
    result,
    setResult,
    error,
    setError,
    
    imageSrc,
    setImageSrc,
    startCamera,
    goToHome,
    goToSettings,
    goToAccessibility,
    
    isOnline,
    refreshOnlineStatus,
    
    processCapturedImage,
    isSupportedDevice,
    
    announceResult,
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
