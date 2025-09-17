/**
 * Generates a unique idempotency key for API requests
 * This ensures that duplicate requests don't cause unintended side effects
 */
export const generateIdempotencyKey = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generates a UUID v4
 * Alternative implementation for idempotency keys
 */
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Creates a debounced idempotency key generator
 * Useful for preventing rapid successive API calls
 */
export const createDebouncedIdempotencyKey = (delay: number = 1000) => {
  let timeoutId: NodeJS.Timeout;
  let lastKey: string;
  
  return (): Promise<string> => {
    return new Promise((resolve) => {
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        lastKey = generateIdempotencyKey();
        resolve(lastKey);
      }, delay);
    });
  };
};