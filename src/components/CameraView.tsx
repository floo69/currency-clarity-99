
import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, CameraOff, RefreshCw, Focus, ZoomIn, ZoomOut, FlipHorizontal } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

// Extended interface for MediaTrackCapabilities that includes missing properties
interface ExtendedMediaTrackCapabilities extends MediaTrackCapabilities {
  torch?: boolean;
  zoom?: number;
  focusDistance?: {min: number, max: number};
  focusMode?: string[];
}

// Extended interface for MediaTrackConstraintSet that includes missing properties
interface ExtendedMediaTrackConstraintSet extends MediaTrackConstraintSet {
  torch?: boolean;
  zoom?: number;
  focusMode?: string;
  pointsOfInterest?: {x: number, y: number}[];
}

const CameraView: React.FC = () => {
  const { processCapturedImage, setStatus, isOnline, language, refreshOnlineStatus, goToHome, isDarkMode } = useAppContext();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [hasFlash, setHasFlash] = useState<boolean>(false);
  const [flashOn, setFlashOn] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFocusing, setIsFocusing] = useState<boolean>(false);
  const [showGuideBox, setShowGuideBox] = useState<boolean>(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const translations = {
    takePhoto: {
      english: "Capture Banknote",
      hindi: "नोट कैप्चर करें",
      tamil: "நோட்டை கைப்பற்று",
      telugu: "నోటును క్యాప్చర్ చేయండి",
      bengali: "নোট ক্যাপচার করুন"
    },
    cancel: {
      english: "Cancel",
      hindi: "रद्द करें",
      tamil: "ரத்து செய்",
      telugu: "రద్దు చేయండి",
      bengali: "বাতিল করুন"
    },
    cameraError: {
      english: "Camera access denied. Please check your permissions.",
      hindi: "कैमरा एक्सेस अस्वीकृत। कृपया अपनी अनुमतियों की जांच करें।",
      tamil: "கேமரா அணுகல் மறுக்கப்பட்டது. உங்கள் அனுமதிகளை சரிபார்க்கவும்.",
      telugu: "కెమెరా యాక్సెస్ నిరాకరించబడింది. దయచేసి మీ అనుమతులను తనిఖీ చేయండి.",
      bengali: "ক্যামেরা অ্যাক্সেস অস্বীকার করা হয়েছে। আপনার অনুমতিগুলি পরীক্ষা করুন।"
    },
    tryAgain: {
      english: "Try Again",
      hindi: "पुनः प्रयास करें",
      tamil: "மீண்டும் முயற்சி செய்யுங்கள்",
      telugu: "మళ్ళీ ప్రయత్నించండి",
      bengali: "আবার চেষ্টা করুন"
    },
    offline: {
      english: "You are offline. Camera may still work, but identification will be done when online.",
      hindi: "आप ऑफलाइन हैं। कैमरा अभी भी काम कर सकता है, लेकिन पहचान ऑनलाइन होने पर की जाएगी।",
      tamil: "நீங்கள் ஆஃப்லைனில் உள்ளீர்கள். கேமரா இன்னும் வேலை செய்யலாம், ஆனால் அடையாளம் ஆன்லைனில் இருக்கும்போது செய்யப்படும்.",
      telugu: "మీరు ఆఫ్‌లైన్‌లో ఉన్నారు. కెమెరా ఇప్పటికీ పని చేయవచ్చు, కానీ గుర్తింపు ఆన్‌లైన్‌లో ఉన్నప్పుడు చేయబడుతుంది.",
      bengali: "আপনি অফলাইন আছেন। ক্যামেরা এখনও কাজ করতে পারে, তবে অনলাইনে থাকাকালীন শনাক্তকরণ করা হবে।"
    },
    refreshStatus: {
      english: "Refresh Status",
      hindi: "स्थिति रीफ्रेश करें",
      tamil: "நிலையை புதுப்பிக்கவும்",
      telugu: "స్థితిని రిఫ్రెష్ చేయండి",
      bengali: "স্ট্যাটাস রিফ্রেশ করুন"
    },
    positioning: {
      english: "Position banknote inside the frame",
      hindi: "नोट को फ्रेम के अंदर रखें",
      tamil: "பிரேமுக்குள் நோட்டை வைக்கவும்",
      telugu: "ఫ్రేమ్‌లో నోటు పెట్టండి",
      bengali: "ফ্রেমের ভিতরে নোট রাখুন"
    },
    toggleFlash: {
      english: "Toggle Flash",
      hindi: "फ्लैश टॉगल करें",
      tamil: "ஃபிளாஷை மாற்றவும்",
      telugu: "ఫ్లాష్‌ని టోగుల్ చేయండి",
      bengali: "ফ্ল্যাশ টগল করুন"
    },
    zoomIn: {
      english: "Zoom In",
      hindi: "ज़ूम इन",
      tamil: "பெரிதாக்கு",
      telugu: "జూమ్ ఇన్",
      bengali: "জুম ইন"
    },
    zoomOut: {
      english: "Zoom Out",
      hindi: "ज़ूम आउट",
      tamil: "சிறிதாக்கு",
      telugu: "జూమ్ అవుట్",
      bengali: "জুম আউট"
    }
  };
  
  const getText = (key: keyof typeof translations) => {
    return translations[key][language as keyof typeof translations[keyof typeof translations]] || translations[key].english;
  };
  
  const applyConstraints = async (stream: MediaStream) => {
    try {
      const videoTrack = stream.getVideoTracks()[0];
      
      if (!videoTrack) return;
      
      // Check if flash is supported
      const capabilities = videoTrack.getCapabilities() as ExtendedMediaTrackCapabilities;
      setHasFlash(!!capabilities.torch);
      
      // Set zoom if available
      if (capabilities.zoom) {
        const constraints: MediaTrackConstraints = {
          advanced: [{ zoom: zoomLevel } as ExtendedMediaTrackConstraintSet]
        };
        await videoTrack.applyConstraints(constraints);
      }
      
      // Toggle flash if needed and available
      if (hasFlash && flashOn) {
        const constraints: MediaTrackConstraints = {
          advanced: [{ torch: true } as ExtendedMediaTrackConstraintSet]
        };
        await videoTrack.applyConstraints(constraints);
      }
    } catch (error) {
      console.error('Failed to apply camera constraints:', error);
    }
  };
  
  useEffect(() => {
    let mounted = true;
    
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment', 
            width: { ideal: 1280 }, 
            height: { ideal: 720 }
          }
        });
        
        if (mounted) {
          setStream(mediaStream);
          streamRef.current = mediaStream;
          setCameraError(null);
          
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
          
          // Apply constraints
          await applyConstraints(mediaStream);
        }
      } catch (error) {
        console.error('Camera access error:', error);
        if (mounted) {
          setCameraError(getText('cameraError'));
        }
      }
    };
    
    startCamera();
    
    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // Apply constraints when zoom or flash changes
  useEffect(() => {
    if (stream) {
      applyConstraints(stream);
    }
  }, [zoomLevel, flashOn, stream]);
  
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsCapturing(true);
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get image as data URL
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    
    // Stop the camera stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      streamRef.current = null;
    }
    
    // Process the captured image
    processCapturedImage(imageData);
    setIsCapturing(false);
  };
  
  const handleRetry = async () => {
    setCameraError(null);
    
    // Close previous stream if exists
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      setStream(null);
      streamRef.current = null;
    }
    
    // Try to initialize camera again
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', 
          width: { ideal: 1280 }, 
          height: { ideal: 720 }
        }
      });
      
      setStream(mediaStream);
      streamRef.current = mediaStream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      // Apply constraints
      await applyConstraints(mediaStream);
    } catch (error) {
      console.error('Camera retry error:', error);
      setCameraError(getText('cameraError'));
    }
  };
  
  const toggleFlash = async () => {
    if (!hasFlash || !stream) return;
    
    setFlashOn(prev => !prev);
  };
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 1));
  };
  
  const handleTapToFocus = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !stream) return;
    
    const videoTrack = stream.getVideoTracks()[0];
    if (!videoTrack) return;
    
    // Check if focus is supported
    const capabilities = videoTrack.getCapabilities() as ExtendedMediaTrackCapabilities;
    if (!capabilities.focusDistance && !capabilities.focusMode) return;
    
    const videoElement = videoRef.current;
    const videoRect = videoElement.getBoundingClientRect();
    
    // Calculate relative position
    const x = (e.clientX - videoRect.left) / videoRect.width;
    const y = (e.clientY - videoRect.top) / videoRect.height;
    
    try {
      // Apply focus constraint if supported
      if (capabilities.focusMode?.includes('single-shot')) {
        const constraints: MediaTrackConstraints = {
          advanced: [{
            focusMode: 'single-shot',
            pointsOfInterest: [{ x, y }]
          } as ExtendedMediaTrackConstraintSet]
        };
        
        videoTrack.applyConstraints(constraints);
        
        // Show focusing animation
        setIsFocusing(true);
        setTimeout(() => setIsFocusing(false), 1000);
      }
    } catch (error) {
      console.error('Focus error:', error);
    }
  };
  
  return (
    <div className="flex flex-col items-center w-full animate-fade-in">
      <div 
        className="relative w-full max-w-2xl aspect-[4/3] rounded-lg overflow-hidden glass-card shadow-lg"
        onClick={handleTapToFocus}
      >
        {cameraError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center gap-4">
            <CameraOff className="w-16 h-16 text-destructive mb-4 animate-pulse" />
            <p className="text-xl font-semibold">{cameraError}</p>
            <button 
              onClick={handleRetry}
              className="primary-button mt-4 flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              {getText('tryAgain')}
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Focusing animation */}
            {isFocusing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-20 h-20 border-2 border-primary rounded-full scale-90 animate-[scale-in_0.5s_ease-out]"></div>
              </div>
            )}
            
            {/* Guide box for positioning */}
            {showGuideBox && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-3/4 h-1/2 border-2 border-dashed border-primary/80 rounded-md"></div>
                <p className="absolute bottom-1/4 text-sm text-center text-primary-foreground bg-background/50 px-2 py-1 rounded-md backdrop-blur-sm">
                  {getText('positioning')}
                </p>
              </div>
            )}
            
            {!isOnline && (
              <div className="absolute top-0 left-0 right-0 bg-destructive/90 text-destructive-foreground p-3 text-center animate-slide-down">
                <p>{getText('offline')}</p>
                <button
                  onClick={() => refreshOnlineStatus()}
                  className="underline font-medium mt-1 focus-visible-ring"
                >
                  {getText('refreshStatus')}
                </button>
              </div>
            )}
            
            {/* Camera controls */}
            <div className="absolute top-4 right-4 flex gap-2">
              {hasFlash && (
                <button
                  onClick={toggleFlash}
                  className={`p-3 rounded-full backdrop-blur-md 
                             ${flashOn ? 'bg-primary text-primary-foreground' : 'bg-background/70 text-foreground'}
                             transition-all duration-200`}
                  aria-label={getText('toggleFlash')}
                >
                  <span className={flashOn ? 'animate-pulse' : ''}>⚡</span>
                </button>
              )}
              
              <button
                onClick={handleZoomIn}
                className="p-3 rounded-full bg-background/70 backdrop-blur-md text-foreground transition-all duration-200"
                aria-label={getText('zoomIn')}
                disabled={zoomLevel >= 3}
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleZoomOut}
                className="p-3 rounded-full bg-background/70 backdrop-blur-md text-foreground transition-all duration-200"
                aria-label={getText('zoomOut')}
                disabled={zoomLevel <= 1}
              >
                <ZoomOut className="w-5 h-5" />
              </button>
            </div>
            
            {/* Bottom action bar */}
            <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between bg-gradient-to-t from-background/80 to-transparent">
              <button 
                onClick={goToHome}
                className="secondary-button flex items-center gap-2"
                aria-label={getText('cancel')}
              >
                <X className="w-5 h-5" />
                {getText('cancel')}
              </button>
              
              <button 
                onClick={captureImage}
                className={`primary-button flex items-center gap-2 ${isCapturing ? 'opacity-70 pointer-events-none' : ''}`}
                aria-label={getText('takePhoto')}
                disabled={isCapturing}
              >
                <Camera className="w-5 h-5" />
                {getText('takePhoto')}
              </button>
            </div>
          </>
        )}
      </div>
      
      {/* Zoom level indicator */}
      {zoomLevel > 1 && (
        <div className="mt-4 w-full max-w-md">
          <div className="flex items-center gap-2">
            <ZoomOut className="w-4 h-4 text-muted-foreground" />
            <div className="h-1 flex-1 rounded-full bg-secondary overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${((zoomLevel - 1) / 2) * 100}%` }}
              ></div>
            </div>
            <ZoomIn className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-center text-muted-foreground mt-1">{zoomLevel.toFixed(1)}x</p>
        </div>
      )}
      
      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraView;
