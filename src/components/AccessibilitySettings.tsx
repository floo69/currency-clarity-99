
import React, { useState } from 'react';
import { Volume2, Vibrate, ArrowLeft } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { speak, stopSpeaking } from '@/utils/speechUtils';
import { triggerHapticFeedback, HapticPatterns } from '@/utils/hapticUtils';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

const AccessibilitySettings: React.FC = () => {
  const { 
    language,
    voiceEnabled,
    setVoiceEnabled,
    voiceSpeed,
    setVoiceSpeed,
    hapticEnabled,
    setHapticEnabled,
    goToSettings
  } = useAppContext();
  
  const [volume, setVolume] = useState<number>(80);
  const [speechRate, setSpeechRate] = useState<number>(50);
  const [vibrationIntensity, setVibrationIntensity] = useState<number>(70);
  
  const translations = {
    accessibilitySettings: {
      english: "Accessibility Settings",
      hindi: "पहुंच सेटिंग्स",
      tamil: "அணுகல் அமைப்புகள்",
      telugu: "ప్రాప్యత సెట్టింగులు",
      bengali: "অ্যাক্সেসিবিলিটি সেটিংস"
    },
    voiceFeedback: {
      english: "Voice Feedback",
      hindi: "आवाज़ फीडबैक",
      tamil: "குரல் கருத்து",
      telugu: "వాయిస్ ఫీడ్‌బ్యాక్",
      bengali: "ভয়েস ফিডব্যাক"
    },
    volume: {
      english: "Volume",
      hindi: "आवाज़",
      tamil: "ஒலி அளவு",
      telugu: "వాల్యూమ్",
      bengali: "ভলিউম"
    },
    speechRate: {
      english: "Speech Rate",
      hindi: "बोलने की गति",
      tamil: "பேச்சு வேகம்",
      telugu: "ప్రసంగ రేటు",
      bengali: "বক্তৃতার হার"
    },
    testVoice: {
      english: "Test Voice",
      hindi: "आवाज़ का परीक्षण करें",
      tamil: "குரலை சோதிக்கவும்",
      telugu: "వాయిస్‌ని పరీక్షించండి",
      bengali: "ভয়েস পরীক্ষা করুন"
    },
    vibrationFeedback: {
      english: "Vibration Feedback",
      hindi: "कंपन फीडबैक",
      tamil: "அதிர்வு பின்னூட்டம்",
      telugu: "వైబ్రేషన్ ఫీడ్‌బ్యాక్",
      bengali: "ভাইব্রেশন ফিডব্যাক"
    },
    vibrationIntensity: {
      english: "Vibration Intensity",
      hindi: "कंपन तीव्रता",
      tamil: "அதிர்வு தீவிரம்",
      telugu: "వైబ్రేషన్ తీవ్రత",
      bengali: "কম্পন তীব্রতা"
    },
    testVibration: {
      english: "Test Vibration",
      hindi: "कंपन का परीक्षण करें",
      tamil: "அதிர்வு சோதனை",
      telugu: "వైబ్రేషన్ పరీక్ష",
      bengali: "ভাইব্রেশন পরীক্ষা করুন"
    },
    back: {
      english: "Back",
      hindi: "वापस",
      tamil: "பின்னால்",
      telugu: "వెనుకకు",
      bengali: "পিছনে"
    }
  };
  
  const getText = (key: keyof typeof translations) => {
    return translations[key][language as keyof typeof translations[keyof typeof translations]] || translations[key].english;
  };
  
  const testAudioMessage = {
    english: "This is a test of the audio output. You can adjust the volume and speech rate to your preference.",
    hindi: "यह ऑडियो आउटपुट का एक परीक्षण है। आप अपनी प्राथमिकता के अनुसार वॉल्यूम और स्पीच रेट को समायोजित कर सकते हैं।",
    tamil: "இது ஆடியோ அவுட்புட்டின் சோதனை. உங்கள் விருப்பத்திற்கு ஏற்ப ஒலி அளவு மற்றும் பேச்சு வேகத்தை நீங்கள் சரிசெய்யலாம்.",
    telugu: "ఇది ఆడియో అవుట్‌పుట్ యొక్క పరీక్ష. మీరు మీ ప్రాధాన్యత ప్రకారం వాల్యూమ్ మరియు స్పీచ్ రేట్‌ను సర్దుబాటు చేసుకోవచ్చు.",
    bengali: "এটি অডিও আউটপুটের একটি পরীক্ষা। আপনি আপনার পছন্দ অনুযায়ী ভলিউম এবং স্পিচ রেট সামঞ্জস্য করতে পারেন।"
  };
  
  const handleTestVoice = () => {
    // Convert speech rate from percentage to a rate value (0.5 to 1.5)
    const rate = 0.5 + (speechRate / 100);
    // Use the volume as is (0-100%)
    speak(testAudioMessage[language as keyof typeof testAudioMessage] || testAudioMessage.english, rate, 1, volume / 100);
  };
  
  const handleTestVibration = () => {
    // Adjust vibration pattern based on intensity
    const duration = Math.round(100 + (vibrationIntensity * 3));
    const pattern = [duration, 50, duration];
    triggerHapticFeedback(pattern);
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };
  
  const handleSpeechRateChange = (value: number[]) => {
    setSpeechRate(value[0]);
    
    // Map 0-100 to speech rate terms
    let newSpeed: 'slow' | 'normal' | 'fast' = 'normal';
    if (value[0] < 33) {
      newSpeed = 'slow';
    } else if (value[0] > 66) {
      newSpeed = 'fast';
    }
    
    setVoiceSpeed(newSpeed);
  };
  
  const handleVibrationIntensityChange = (value: number[]) => {
    setVibrationIntensity(value[0]);
  };
  
  return (
    <div className="w-full max-w-xl mx-auto animate-fade-in">
      <div className="glass-card p-6 rounded-lg shadow-lg">
        <div className="flex items-center mb-6">
          <button 
            onClick={goToSettings}
            className="mr-4 p-2 rounded-full hover:bg-muted transition-colors focus-visible-ring"
            aria-label={getText('back')}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-2xl font-bold">{getText('accessibilitySettings')}</h2>
        </div>
        
        <div className="space-y-8">
          {/* Voice Feedback */}
          <section>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              {getText('voiceFeedback')}
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <span>{getText('volume')}</span>
                  <span className="text-sm font-medium">{volume}%</span>
                </div>
                <Slider 
                  value={[volume]} 
                  onValueChange={handleVolumeChange} 
                  max={100} 
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <span>{getText('speechRate')}</span>
                  <span className="text-sm font-medium">{speechRate}%</span>
                </div>
                <Slider 
                  value={[speechRate]} 
                  onValueChange={handleSpeechRateChange} 
                  max={100} 
                  step={1}
                  className="w-full"
                />
              </div>
              
              <Button 
                variant="secondary" 
                className="w-full flex items-center justify-center gap-2"
                onClick={handleTestVoice}
              >
                <Volume2 className="h-4 w-4" />
                {getText('testVoice')}
              </Button>
            </div>
          </section>
          
          {/* Vibration Feedback */}
          <section>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Vibrate className="h-5 w-5" />
              {getText('vibrationFeedback')}
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <span>{getText('vibrationIntensity')}</span>
                  <span className="text-sm font-medium">{vibrationIntensity}%</span>
                </div>
                <Slider 
                  value={[vibrationIntensity]} 
                  onValueChange={handleVibrationIntensityChange} 
                  max={100} 
                  step={1}
                  className="w-full"
                />
              </div>
              
              <Button 
                variant="secondary" 
                className="w-full flex items-center justify-center gap-2"
                onClick={handleTestVibration}
              >
                <Vibrate className="h-4 w-4" />
                {getText('testVibration')}
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AccessibilitySettings;
