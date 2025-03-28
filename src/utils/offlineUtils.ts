
// Offline utilities for handling offline functionality

/**
 * Checks if the device is currently online
 * @returns Promise that resolves to boolean indicating online status
 */
export const checkOnlineStatus = async (): Promise<boolean> => {
  // First check the navigator.onLine property (might not be 100% accurate)
  if (!navigator.onLine) {
    return false;
  }
  
  // Try to fetch a small resource as a more reliable check
  try {
    // Use a tiny resource to minimize data usage
    // The * header tells the browser it can use a cached response, we just want to test connectivity
    const response = await fetch('https://httpbin.org/status/200', {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache',
      },
      redirect: 'follow',
    });
    
    return true;
  } catch (error) {
    console.warn('Online check failed:', error);
    return false;
  }
};

/**
 * Saves data to localStorage with error handling
 * @param key The key to save under
 * @param value The value to save
 */
export const saveToLocalStorage = <T>(key: string, value: T): void => {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Retrieves data from localStorage with error handling
 * @param key The key to retrieve
 * @param defaultValue Default value if key doesn't exist
 * @returns The retrieved value or defaultValue
 */
export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) {
      return defaultValue;
    }
    return JSON.parse(serialized) as T;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};
