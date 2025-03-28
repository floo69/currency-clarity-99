
import React, { createContext, useContext, useState, useEffect } from 'react';
import { speak, stopSpeaking } from '@/utils/speechUtils';
import { triggerHapticFeedback, HapticPatterns } from '@/utils/hapticUtils';
import { checkOnlineStatus, saveToLocalStorage, getFromLocalStorage } from '@/utils/offlineUtils';
import { preloadRecognitionModel, recognizeCurrency } from '@/utils/recognitionUtils';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';

// Type definitions
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

// Default context values
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

// Create context
const AppContext = createContext<AppContextType>(defaultContext);

// Custom hook for using the context
export const useAppContext = () => useContext(AppContext);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  // State initialization with localStorage persistence
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
  
  // Translations for multi-language support
  const translations = {
    offline_title: {
      english: "You're Offline",
      hindi: "आप ऑफलाइन हैं",
      tamil: "நீங்கள் ஆஃப்லைனில் உள்ளீர்கள்",
      telugu: "మీరు ఆఫ్‌లైన్‌లో ఉన్నారు",
      bengali: "আপনি অফলাইনে আছেন"
    },
    offline_message: {
      english: "Please check your connection and try again",
      hindi: "कृपया अपने कनेक्शन की जाँच करें और पुनः प्रयास करें",
      tamil: "உங்கள் இணைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்",
      telugu: "దయచేసి మీ కనెక్షన్‌ని తనిఖీ చేసి మళ్లీ ప్రయత్నించండి",
      bengali: "আপনার সংযোগ পরীক্ষা করুন এবং আবার চেষ্টা করুন"
    },
    online_title: {
      english: "You're Back Online",
      hindi: "आप वापस ऑनलाइन हैं",
      tamil: "நீங்கள் ஆன்லைனுக்கு திரும்பி விட்டீர்கள்",
      telugu: "మీరు తిరిగి ఆన్‌లైన్‌లో ఉన్నారు",
      bengali: "আপনি আবার অনলাইনে ফিরে এসেছেন"
    },
    back_online: {
      english: "Connection restored",
      hindi: "कनेक्शन पुनर्स्थापित",
      tamil: "இணைப்பு மீட்டமைக்கப்பட்டது",
      telugu: "కనెక్షన్ పునరుద్ధరించబడింది",
      bengali: "সংযোগ পুনরুদ্ধার করা হয়েছে"
    },
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
      telugu: "చిత్రాన్ని ప్రాసెస్ చేస్తోంది. దయచేసి వేచి ఉండండి.",
      bengali: "ছবি প্রসেস করা হচ্ছে। অনুগ্রহ করে অপেক্ষা করুন।"
    },
    recognition_success: {
      english: "Currency Recognized",
      hindi: "मुद्रा की पहचान हो गई",
      tamil: "நாணயம் அங்கீகரிக்கப்பட்டது",
      telugu: "కరెన్సీ గుర్తించబడింది",
      bengali: "মুদ্রা শনাক্ত করা হয়েছে"
    },
    recognition_error: {
      english: "Could not recognize the currency. Please try again with better lighting and positioning.",
      hindi: "मुद्रा की पहचान नहीं हो सकी। कृपया बेहतर रोशनी और स्थिति के साथ पुनः प्रयास करें।",
      tamil: "நாணயத்தை அடையாளம் காண முடியவில்லை. சிறந்த ஒளி மற்றும் நிலைப்படுத்துதலுடன் மீண்டும் முயற்சிக்கவும்.",
      telugu: "కరెన్సీని గుర్తించలేకపోయింది. దయచేసి మెరుగైన లైటింగ్ మరియు పొజిషనింగ్‌తో మళ్లీ ప్రయత్నించండి.",
      bengali: "মুদ্রা শনাক্ত করা যায়নি। আরও ভালো আলো এবং অবস্থান সহ আবার চেষ্টা করুন।"
    },
    error_title: {
      english: "Error",
      hindi: "त्रुटि",
      tamil: "பிழை",
      telugu: "లోపం",
      bengali: "ত্রুটি"
    }
  };
  
  const getTranslation = (key: keyof typeof translations): string => {
    return translations[key][language as keyof typeof translations[keyof typeof translations]] || translations[key].english;
  };

  // Apply theme and dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    if (theme === 'high-contrast') {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    // Preload recognition model
    preloadRecognitionModel().catch(err => {
      console.error('Failed to preload recognition model:', err);
      setIsSupportedDevice(false);
    });
  }, [isDarkMode, theme]);
  
  // Check online status
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
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
    
    // Also update theme accordingly
    setTheme(prev => {
      if (prev === 'high-contrast') return prev;
      return !isDarkMode ? 'dark' : 'light';
    });
    
    // Haptic feedback
    if (hapticEnabled) {
      triggerHapticFeedback(HapticPatterns.SHORT);
    }
  };
  
  // Navigation functions
  const goToHome = () => {
    setStatus('idle');
    setError(null);
    setResult(null);
  };
  
  const goToSettings = () => {
    setStatus('settings');
  };
  
  const goToAccessibility = () => {
    setStatus('accessibility');
  };
  
  const startCamera = () => {
    setStatus('camera');
    setResult(null);
    setError(null);
    setImageSrc(null);
  };
  
  // Refresh online status manually
  const refreshOnlineStatus = async (): Promise<boolean> => {
    const onlineStatus = await checkOnlineStatus();
    setIsOnline(onlineStatus);
    return onlineStatus;
  };
  
  // Process captured image
  const processCapturedImage = async (imageData: string) => {
    try {
      setStatus('processing');
      setImageSrc(imageData);
      
      // Recognize currency
      const recognitionResult = await recognizeCurrency(imageData);
      
      // Update state with result
      setResult(recognitionResult);
      setStatus('result');
      
      // Haptic feedback
      if (hapticEnabled) {
        triggerHapticFeedback(HapticPatterns.SUCCESS);
      }
      
      // Voice announcement if enabled
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
  
  // Announce result for accessibility
  const announceResult = (result: RecognitionResult) => {
    if (!voiceEnabled) return;
    
    // Convert result to natural language
    let rate = 1.0;
    if (voiceSpeed === 'slow') rate = 0.8;
    if (voiceSpeed === 'fast') rate = 1.2;
    
    speak(`${result.denomination} ${result.currency} detected with ${Math.round(result.confidence * 100)}% confidence`, rate);
  };
  
  // Provider value
  const value: AppContextType = {
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
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
