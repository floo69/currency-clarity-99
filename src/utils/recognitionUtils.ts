
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
  
  // For demo purposes, we'll return a mock result
  // In a real app, this would process the image through a trained model
  const currencies = ['Indian Rupee', 'US Dollar', 'Euro', 'British Pound', 'Japanese Yen'];
  const denominations = ['10', '20', '50', '100', '500', '1000', '2000'];
  
  const randomCurrency = currencies[Math.floor(Math.random() * currencies.length)];
  const randomDenomination = denominations[Math.floor(Math.random() * denominations.length)];
  const confidence = 0.7 + (Math.random() * 0.3); // Random between 0.7 and 1.0
  
  return {
    currency: randomCurrency,
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
