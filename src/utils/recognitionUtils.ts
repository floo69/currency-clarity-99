
// This is a simple mock implementation for demo purposes
// In a real app, this would be replaced with an actual TensorFlow.js or similar AI model

interface RecognitionResult {
  currency: string;
  denomination: string;
  confidence: number;
}

export const recognizeCurrency = async (imageData: string): Promise<RecognitionResult> => {
  console.log('Recognizing currency from image...');
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // For demo purposes, only return Indian Rupee as per requirement
  // In a real app, this would process the image through a trained model
  const denominations = ['10', '20', '50', '100', '200', '500', '2000'];
  
  const randomDenomination = denominations[Math.floor(Math.random() * denominations.length)];
  // Generate a confidence level between 0.85 and 1.0 to ensure higher confidence
  const confidence = 0.85 + (Math.random() * 0.15);
  
  return {
    currency: 'Indian Rupee', // Only return Indian Rupee
    denomination: randomDenomination,
    confidence: confidence
  };
};

export const isRecognitionSupported = (): boolean => {
  // In a real app, this would check for availability of required APIs
  // For demo, we'll just check if we're running in a browser with canvas support
  return typeof window !== 'undefined' && 
         !!document.createElement('canvas').getContext('2d');
};

export const preloadRecognitionModel = async (): Promise<void> => {
  console.log('Preloading recognition model...');
  // Simulate preloading time
  await new Promise(resolve => setTimeout(resolve, 800));
  console.log('Recognition model preloaded');
};

// Utility function to get proper currency symbol
export const getCurrencySymbol = (currency: string): string => {
  switch (currency) {
    case 'Indian Rupee': return '₹';
    case 'US Dollar': return '$';
    case 'Euro': return '€';
    case 'British Pound': return '£';
    case 'Japanese Yen': return '¥';
    default: return currency;
  }
};

// Format the full result as text for TTS
export const formatResultForSpeech = (result: RecognitionResult): string => {
  return `${result.denomination} ${result.currency}`;
};
