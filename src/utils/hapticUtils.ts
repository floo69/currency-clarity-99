
// Haptic feedback utility for enhanced tactile feedback

/**
 * Available haptic patterns for feedback
 */
export enum HapticPatterns {
  SHORT = 'short',
  LONG = 'long',
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning'
}

/**
 * Triggers haptic feedback if supported by the device
 * @param pattern Pattern or vibration duration in milliseconds
 */
export const triggerHapticFeedback = (pattern: HapticPatterns | number[] | number): void => {
  // Check if vibration API is supported
  if (!('vibrate' in navigator)) {
    console.warn('Vibration API not supported in this browser');
    return;
  }
  
  // Determine the pattern to use
  let vibrationPattern: number | number[];
  
  if (Array.isArray(pattern)) {
    vibrationPattern = pattern;
  } else if (typeof pattern === 'number') {
    vibrationPattern = pattern;
  } else {
    // Predefined patterns
    switch (pattern) {
      case HapticPatterns.SHORT:
        vibrationPattern = 50;
        break;
      case HapticPatterns.LONG:
        vibrationPattern = 150;
        break;
      case HapticPatterns.SUCCESS:
        vibrationPattern = [50, 50, 150];
        break;
      case HapticPatterns.ERROR:
        vibrationPattern = [100, 30, 100, 30, 100];
        break;
      case HapticPatterns.WARNING:
        vibrationPattern = [100, 50, 100];
        break;
      default:
        vibrationPattern = 50;
    }
  }
  
  // Trigger vibration
  try {
    navigator.vibrate(vibrationPattern);
  } catch (error) {
    console.error('Error triggering haptic feedback:', error);
  }
};

/**
 * Stops any ongoing haptic feedback
 */
export const stopHapticFeedback = (): void => {
  if ('vibrate' in navigator) {
    navigator.vibrate(0);
  }
};
