
type VibrationPattern = number | number[];

export const triggerHapticFeedback = (pattern: VibrationPattern = 100): boolean => {
  if (!window.navigator || !window.navigator.vibrate) {
    return false;
  }
  
  try {
    // Vibrate with the given pattern
    window.navigator.vibrate(pattern);
    return true;
  } catch (error) {
    console.error('Haptic feedback error:', error);
    return false;
  }
};

export const isHapticFeedbackSupported = (): boolean => {
  return !!window.navigator && !!window.navigator.vibrate;
};

// Predefined vibration patterns for different scenarios
export const HapticPatterns = {
  // Short vibration for regular feedback (100ms)
  LIGHT: 100,
  
  // Medium vibration for notifications (300ms)
  MEDIUM: 300,
  
  // Strong vibration for alerts (500ms)
  HEAVY: 500,
  
  // Double pulse for success (100ms on, 50ms off, 100ms on)
  SUCCESS: [100, 50, 100],
  
  // Triple pulse for warning (100ms on, 50ms off, 100ms on, 50ms off, 100ms on)
  WARNING: [100, 50, 100, 50, 100],
  
  // SOS pattern for error (3 short, 3 long, 3 short)
  ERROR: [100, 30, 100, 30, 100, 30, 300, 30, 300, 30, 300, 30, 100, 30, 100, 30, 100],
  
  // Subtle pulse sequence for selection
  SELECT: [50, 30, 50],
  
  // Long gentle pulse for recognition complete
  RECOGNITION_COMPLETE: [30, 50, 30, 50, 30, 50, 200]
};

// Function to trigger haptic feedback for currency recognition
export const triggerRecognitionHaptic = (confidence: number): boolean => {
  if (confidence > 0.9) {
    // High confidence recognition
    return triggerHapticFeedback(HapticPatterns.SUCCESS);
  } else if (confidence > 0.7) {
    // Medium confidence recognition
    return triggerHapticFeedback(HapticPatterns.MEDIUM);
  } else {
    // Low confidence recognition
    return triggerHapticFeedback(HapticPatterns.WARNING);
  }
};
