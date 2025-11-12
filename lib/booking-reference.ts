/**
 * Generate a unique booking reference number
 * Format: YYMMDD + HHMMSS encoded in base32 (e.g., 2411125H3K)
 * This creates a 10-character reference that includes date and time, virtually eliminating duplicates
 */
export function generateBookingReference(): string {
  const now = new Date();
  
  // Get date components (YYMMDD format)
  const year = now.getFullYear().toString().slice(-2); // Last 2 digits of year
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  
  // Create date prefix (6 digits)
  const datePrefix = `${year}${month}${day}`;
  
  // Get time components
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  
  // Encode time as a single number: HHMMSS (e.g., 143025 = 14:30:25)
  const timeNumber = hours * 10000 + minutes * 100 + seconds;
  
  // Convert to base32 using our character set (more compact than base10)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 32 characters (excluding 0,O,1,I)
  let timeEncoded = '';
  let num = timeNumber;
  
  // Convert to base32 (4 characters can represent 0-1048575, enough for HHMMSS max 235959)
  for (let i = 0; i < 4; i++) {
    timeEncoded = chars.charAt(num % 32) + timeEncoded;
    num = Math.floor(num / 32);
  }
  
  // Combine: YYMMDD (6) + Base32Time (4) = 10 characters total
  return `${datePrefix}${timeEncoded}`;
}

/**
 * Alternative: Generate a shorter 6-digit reference
 * Format: YMMDD + 1 random character (e.g., 41112A)
 * Note: Higher chance of duplicates on the same day
 */
export function generateShortBookingReference(): string {
  const now = new Date();
  
  // Get date components (YMMDD format - 5 digits)
  const year = now.getFullYear().toString().slice(-1); // Last digit of year
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  
  // Create date prefix (5 digits)
  const datePrefix = `${year}${month}${day}`;
  
  // Generate 1 random alphanumeric character
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const randomSuffix = chars.charAt(Math.floor(Math.random() * chars.length));
  
  // Combine: YMMDD + 1 random char = 6 characters total
  return `${datePrefix}${randomSuffix}`;
}

/**
 * Parse booking reference to extract date information
 */
export function parseBookingReference(reference: string): { date: Date | null; isValid: boolean } {
  try {
    if (reference.length === 8) {
      // Format: YYMMDD + 2 chars
      const year = parseInt('20' + reference.substring(0, 2));
      const month = parseInt(reference.substring(2, 4)) - 1;
      const day = parseInt(reference.substring(4, 6));
      
      const date = new Date(year, month, day);
      return { date, isValid: !isNaN(date.getTime()) };
    } else if (reference.length === 6) {
      // Format: YMMDD + 1 char
      const year = parseInt('202' + reference.substring(0, 1));
      const month = parseInt(reference.substring(1, 3)) - 1;
      const day = parseInt(reference.substring(3, 5));
      
      const date = new Date(year, month, day);
      return { date, isValid: !isNaN(date.getTime()) };
    }
  } catch (error) {
    return { date: null, isValid: false };
  }
  
  return { date: null, isValid: false };
}

/**
 * Format booking reference for display (adds hyphen for readability)
 * Example: 2411125H3K -> 241112-5H3K
 */
export function formatBookingReference(reference: string): string {
  if (reference.length === 10) {
    // New format: YYMMDD-XXXX
    return `${reference.substring(0, 6)}-${reference.substring(6)}`;
  } else if (reference.length === 8) {
    // Old format: YYMMDD-XX
    return `${reference.substring(0, 6)}-${reference.substring(6)}`;
  } else if (reference.length === 6) {
    // Short format: YMMDD-X
    return `${reference.substring(0, 5)}-${reference.substring(5)}`;
  }
  return reference;
}

