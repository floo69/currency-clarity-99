
// Speech synthesis utility for accessibility and voice feedback

let currentUtterance: SpeechSynthesisUtterance | null = null;

/**
 * Speaks the given text using the browser's speech synthesis API
 * @param text The text to speak
 * @param rate Speech rate (0.5-2.0, default: 1.0)
 * @param pitch Speech pitch (0.5-2.0, default: 1.0)
 * @param volume Speech volume (0.0-1.0, default: 1.0)
 */
export const speak = (
  text: string, 
  rate: number = 1.0, 
  pitch: number = 1.0,
  volume: number = 1.0
): void => {
  // Check if speech synthesis is available
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser');
    return;
  }
  
  // Cancel any ongoing speech
  stopSpeaking();
  
  // Create a new utterance
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set properties
  utterance.rate = Math.max(0.5, Math.min(2.0, rate));
  utterance.pitch = Math.max(0.5, Math.min(2.0, pitch));
  utterance.volume = Math.max(0, Math.min(1.0, volume));
  
  // Try to use an Indian English voice if available
  const voices = window.speechSynthesis.getVoices();
  const indianVoice = voices.find(voice => 
    voice.lang === 'en-IN' || 
    voice.lang === 'hi-IN' ||
    voice.name.includes('Indian')
  );
  
  if (indianVoice) {
    utterance.voice = indianVoice;
  }
  
  // Store reference to current utterance
  currentUtterance = utterance;
  
  // Speak the text
  window.speechSynthesis.speak(utterance);
  
  // Clear reference when done
  utterance.onend = () => {
    currentUtterance = null;
  };
};

/**
 * Stops any ongoing speech
 */
export const stopSpeaking = (): void => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
};

/**
 * Checks if speech is currently in progress
 * @returns True if speech is in progress, false otherwise
 */
export const isSpeaking = (): boolean => {
  return 'speechSynthesis' in window && window.speechSynthesis.speaking;
};
