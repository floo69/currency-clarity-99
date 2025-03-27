
import React, { useEffect, useState } from 'react';
import { ArrowLeft, VolumeX, Volume2, Camera, Share, Copy, Check, Info, BadgeIndianRupee, AlertTriangle } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { speak, stopSpeaking } from '@/utils/speechUtils';
import { getCurrencySymbol, formatResultForSpeech } from '@/utils/recognitionUtils';
import { useToast } from '@/hooks/use-toast';

const ResultDisplay: React.FC = () => {
  const { 
    language, 
    goToHome, 
    imageSrc, 
    result, 
    startCamera,
    theme,
    hapticEnabled
  } = useAppContext();
  
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showConfidenceInfo, setShowConfidenceInfo] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  // Define minimum confidence threshold
  const MIN_CONFIDENCE_THRESHOLD = 0.9;
  const isConfident = result && result.confidence >= MIN_CONFIDENCE_THRESHOLD;
  const isIndianRupee = result && result.currency === 'Indian Rupee';
  const isValidResult = isConfident && isIndianRupee;
  
  const translations = {
    identified: {
      english: "Banknote Identified",
      hindi: "नोट की पहचान हो गई है",
      tamil: "நோட்டு அடையாளம் காணப்பட்டது",
      telugu: "నోటు గుర్తించబడింది",
      bengali: "নোট চিহ্নিত করা হয়েছে"
    },
    denomination: {
      english: "Denomination",
      hindi: "मूल्यवर्ग",
      tamil: "மதிப்பு",
      telugu: "విలువ",
      bengali: "মূল্যমান"
    },
    currency: {
      english: "Currency",
      hindi: "मुद्रा",
      tamil: "நாணயம்",
      telugu: "కరెన్సీ",
      bengali: "মুদ্রা"
    },
    confidence: {
      english: "Confidence",
      hindi: "विश्वास स्तर",
      tamil: "நம்பிக்கை",
      telugu: "విశ్వాసం",
      bengali: "আস্থা"
    },
    tryAgain: {
      english: "Scan Another",
      hindi: "एक और स्कैन करें",
      tamil: "மற்றொன்றை ஸ்கேன் செய்யவும்",
      telugu: "మరొకదాన్ని స్కాన్ చేయండి",
      bengali: "আরেকটি স্ক্যান করুন"
    },
    back: {
      english: "Back to Home",
      hindi: "होम पर वापस जाएं",
      tamil: "முகப்புக்குத் திரும்பு",
      telugu: "హోమ్‌కు తిరిగి వెళ్ళండి",
      bengali: "হোমে ফিরে যান"
    },
    speakAgain: {
      english: "Speak Result",
      hindi: "परिणाम बोलें",
      tamil: "முடிவைப் பேசுங்கள்",
      telugu: "ఫలితాన్ని మాట్లాడండి",
      bengali: "ফলাফল বলুন"
    },
    mute: {
      english: "Mute",
      hindi: "म्यूट करें",
      tamil: "முடக்கு",
      telugu: "మ్యూట్",
      bengali: "নীরব করুন"
    },
    share: {
      english: "Share",
      hindi: "शेयर करें",
      tamil: "பகிர்",
      telugu: "షేర్ చేయండి",
      bengali: "শেয়ার করুন"
    },
    copy: {
      english: "Copy",
      hindi: "कॉपी करें",
      tamil: "நகலெடு",
      telugu: "కాపీ చేయండి",
      bengali: "কপি করুন"
    },
    copied: {
      english: "Copied!",
      hindi: "कॉपी किया गया!",
      tamil: "நகலெடுக்கப்பட்டது!",
      telugu: "కాపీ చేయబడింది!",
      bengali: "কপি করা হয়েছে!"
    },
    confidenceExplanation: {
      english: "Confidence score indicates how certain the AI is about this identification.",
      hindi: "विश्वास स्कोर बताता है कि एआई इस पहचान के बारे में कितना निश्चित है।",
      tamil: "நம்பிக்கை மதிப்பெண் இந்த அடையாளத்தைப் பற்றி AI எவ்வளவு உறுதியாக உள்ளது என்பதைக் குறிக்கிறது.",
      telugu: "కాన్ఫిడెన్స్ స్కోర్ ఈ గుర్తింపు గురించి AI ఎంత ఖచ్చితంగా ఉందో సూచిస్తుంది.",
      bengali: "কনফিডেন্স স্কোর নির্দেশ করে এই শনাক্তকরণ সম্পর্কে AI কতটা নিশ্চিত।"
    },
    lowConfidence: {
      english: "Low confidence detection. Please try again with better lighting.",
      hindi: "कम विश्वास वाला पहचान। कृपया बेहतर रोशनी के साथ फिर से प्रयास करें।",
      tamil: "குறைந்த நம்பிக்கை கண்டறிதல். சிறந்த ஒளியுடன் மீண்டும் முயற்சிக்கவும்.",
      telugu: "తక్కువ నమ్మకంతో గుర్తించడం. దయచేసి మెరుగైన కాంతితో మళ్లీ ప్రయత్నించండి.",
      bengali: "কম আত্মবিশ্বাসের সাথে সনাক্তকরণ। ভালো আলোর সাথে আবার চেষ্টা করুন।"
    },
    invalidCurrency: {
      english: "Only Indian Rupee is supported.",
      hindi: "केवल भारतीय रुपये का समर्थन है।",
      tamil: "இந்திய ரூபாய் மட்டுமே ஆதரிக்கப்படுகிறது.",
      telugu: "భారతీయ రూపాయి మాత్రమే మద్దతు ఉంది.",
      bengali: "শুধুমাত্র ভারতীয় রুপি সমর্থিত।"
    }
  };
  
  const getText = (key: keyof typeof translations) => {
    return translations[key][language as keyof typeof translations[keyof typeof translations]] || translations[key].english;
  };
  
  // Handle result display
  useEffect(() => {
    if (!result) return;
    
    // Show toast for low confidence or invalid currency
    if (!isConfident) {
      toast({
        title: getText('lowConfidence'),
        description: getText('tryAgain'),
        variant: "warning"
      });
    } else if (!isIndianRupee) {
      toast({
        title: getText('invalidCurrency'),
        description: getText('tryAgain'),
        variant: "warning"
      });
    }
    
    // Clean up
    return () => {
      stopSpeaking();
    };
  }, [result]);
  
  const handleSpeakResult = () => {
    if (result && isValidResult) {
      speak(formatResultForSpeech(result));
    }
  };
  
  const handleMute = () => {
    stopSpeaking();
  };
  
  const handleShare = async () => {
    if (!result || !isValidResult) return;
    
    const shareText = `I identified a ${result.denomination} ${result.currency} using CurrencySight app.`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Currency Identification Result',
          text: shareText,
          // Only include image if available and it's a blob URL
          ...(imageSrc && !imageSrc.startsWith('data:') && { url: imageSrc })
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      console.log('Web Share API not supported');
      copyToClipboard(shareText);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => console.error('Could not copy text: ', err)
    );
  };
  
  const handleCopy = () => {
    if (!result || !isValidResult) return;
    
    const copyText = `${result.denomination} ${result.currency}`;
    copyToClipboard(copyText);
  };
  
  const getConfidenceLevel = (confidence: number) => {
    if (confidence > 0.9) return 'High';
    if (confidence > 0.7) return 'Medium';
    return 'Low';
  };
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.9) return 'text-green-500 dark:text-green-400';
    if (confidence > 0.7) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-red-500 dark:text-red-400';
  };
  
  // If no result, return empty
  if (!result) return null;
  
  const symbol = getCurrencySymbol(result.currency);
  
  return (
    <div className="w-full max-w-xl mx-auto animate-fade-in">
      <div className="glass-card p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
          {isValidResult ? (
            <>
              <span className="inline-block animate-scale-in">{getText('identified')}</span>
              <Check className="w-6 h-6 text-green-500 animate-scale-in delay-100" />
            </>
          ) : (
            <>
              <span className="inline-block animate-scale-in text-yellow-500">Detection Issue</span>
              <AlertTriangle className="w-6 h-6 text-yellow-500 animate-scale-in delay-100" />
            </>
          )}
        </h2>
        
        {imageSrc && (
          <div className="mb-6 relative rounded-lg overflow-hidden bg-muted/30">
            <div className={`aspect-video w-full flex items-center justify-center 
                            ${!isImageLoaded ? 'animate-pulse bg-muted' : ''}`}>
              <img 
                src={imageSrc} 
                alt="Captured banknote" 
                className={`w-full h-full object-contain transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIsImageLoaded(true)}
              />
            </div>
            
            {theme === 'high-contrast' && (
              <div className="absolute inset-0 border-2 border-primary pointer-events-none"></div>
            )}
          </div>
        )}
        
        {isValidResult ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Denomination */}
              <div className="glass-card p-4 rounded-lg animate-fade-in delay-100">
                <h3 className="text-lg text-muted-foreground mb-2">{getText('denomination')}</h3>
                <div className="text-4xl md:text-5xl font-bold text-primary flex items-center gap-2">
                  {symbol} {result.denomination}
                </div>
              </div>
              
              {/* Currency */}
              <div className="glass-card p-4 rounded-lg animate-fade-in delay-200">
                <h3 className="text-lg text-muted-foreground mb-2">{getText('currency')}</h3>
                <div className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                  <BadgeIndianRupee className="w-6 h-6 text-primary" />
                  {result.currency}
                </div>
              </div>
            </div>
            
            {/* Confidence score */}
            <div className="mb-8 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg text-muted-foreground">{getText('confidence')}</h3>
                  <button 
                    onClick={() => setShowConfidenceInfo(!showConfidenceInfo)}
                    className="p-1 rounded-full hover:bg-muted focus-visible-ring"
                    aria-label="Confidence information"
                  >
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <div className={`text-lg font-medium ${getConfidenceColor(result.confidence)}`}>
                  {getConfidenceLevel(result.confidence)} ({Math.round(result.confidence * 100)}%)
                </div>
              </div>
              
              <div className="mt-2 h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-1000 ease-out"
                  style={{ width: `${result.confidence * 100}%` }}
                ></div>
              </div>
              
              {showConfidenceInfo && (
                <div className="mt-2 text-sm text-muted-foreground p-3 bg-muted/30 rounded-md animate-fade-in">
                  {getText('confidenceExplanation')}
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={handleSpeakResult}
                className="secondary-button flex items-center justify-center gap-2"
                aria-label={getText('speakAgain')}
              >
                <Volume2 className="h-5 w-5" />
                {getText('speakAgain')}
              </button>
              
              <button
                onClick={handleShare}
                className="secondary-button flex items-center justify-center gap-2"
                aria-label={getText('share')}
              >
                <Share className="h-5 w-5" />
                {getText('share')}
              </button>
              
              <button
                onClick={handleCopy}
                className="secondary-button flex items-center justify-center gap-2"
                aria-label={copied ? getText('copied') : getText('copy')}
              >
                {copied ? (
                  <>
                    <Check className="h-5 w-5 text-green-500" />
                    {getText('copied')}
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5" />
                    {getText('copy')}
                  </>
                )}
              </button>
              
              <button
                onClick={handleMute}
                className="secondary-button flex items-center justify-center gap-2"
                aria-label={getText('mute')}
              >
                <VolumeX className="h-5 w-5" />
                {getText('mute')}
              </button>
            </div>
          </>
        ) : (
          <div className="p-6 bg-muted/30 rounded-lg mb-8 text-center animate-fade-in">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Detection Issue</h3>
            <p className="mb-4 text-muted-foreground">
              {!isConfident ? getText('lowConfidence') : getText('invalidCurrency')}
            </p>
            <p className="text-sm text-muted-foreground">
              Please ensure good lighting and position the banknote clearly within the frame.
            </p>
          </div>
        )}
        
        {/* Navigation */}
        <div className="flex flex-wrap gap-4 justify-between">
          <button
            onClick={goToHome}
            className="secondary-button flex items-center gap-2"
            aria-label={getText('back')}
          >
            <ArrowLeft className="h-5 w-5" />
            {getText('back')}
          </button>
          
          <button
            onClick={startCamera}
            className="primary-button flex items-center gap-2"
            aria-label={getText('tryAgain')}
          >
            <Camera className="h-5 w-5" />
            {getText('tryAgain')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
