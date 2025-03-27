
let speechSynthesis: SpeechSynthesis | null = null;
let speechUtterance: SpeechSynthesisUtterance | null = null;

if (typeof window !== 'undefined') {
  speechSynthesis = window.speechSynthesis;
}

export const speak = (text: string, rate = 1, pitch = 1, volume = 1): void => {
  if (!speechSynthesis) {
    console.error('Speech synthesis not supported');
    return;
  }
  
  // Stop any ongoing speech
  stopSpeaking();
  
  // Create a new utterance
  speechUtterance = new SpeechSynthesisUtterance(text);
  
  // Set properties
  speechUtterance.rate = rate;
  speechUtterance.pitch = pitch;
  speechUtterance.volume = volume;
  
  // Try to find the best voice for the user's language
  try {
    const voices = speechSynthesis.getVoices();
    const userLanguage = navigator.language || 'en-US';
    
    // First try to find a voice that matches the user's language
    let voice = voices.find(v => v.lang === userLanguage);
    
    // If no exact match, try to find a voice that starts with the same language code
    if (!voice) {
      const langCode = userLanguage.split('-')[0];
      voice = voices.find(v => v.lang.startsWith(langCode));
    }
    
    // If still no match, default to the first available voice
    if (voice) {
      speechUtterance.voice = voice;
    }
  } catch (error) {
    console.error('Error setting voice:', error);
  }
  
  // Add end event listener
  speechUtterance.onend = () => {
    speechUtterance = null;
  };
  
  // Add error event listener
  speechUtterance.onerror = (event) => {
    console.error('Speech synthesis error:', event);
    speechUtterance = null;
  };
  
  // Speak
  speechSynthesis.speak(speechUtterance);
};

export const stopSpeaking = (): void => {
  if (!speechSynthesis) return;
  
  speechSynthesis.cancel();
  speechUtterance = null;
};

export const pauseSpeaking = (): void => {
  if (!speechSynthesis) return;
  
  speechSynthesis.pause();
};

export const resumeSpeaking = (): void => {
  if (!speechSynthesis) return;
  
  speechSynthesis.resume();
};

export const getVoices = (): SpeechSynthesisVoice[] => {
  if (!speechSynthesis) return [];
  return speechSynthesis.getVoices();
};

export const isSpeaking = (): boolean => {
  if (!speechSynthesis) return false;
  return speechSynthesis.speaking;
};

export const isPaused = (): boolean => {
  if (!speechSynthesis) return false;
  return speechSynthesis.paused;
};

// Helper to get estimated speech duration in milliseconds
export const getEstimatedSpeechDuration = (text: string, rate = 1): number => {
  // Average speaking rate is about 150 words per minute (or 2.5 words per second)
  // Adjust based on the rate parameter
  const wordsPerSecond = 2.5 * rate;
  const wordCount = text.split(/\s+/).length;
  const durationInSeconds = wordCount / wordsPerSecond;
  
  // Add a small buffer for more accurate estimation
  return (durationInSeconds * 1000) + 500;
};
