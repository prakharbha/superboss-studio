/**
 * Generate a unique booking reference number
 * Format: YYMMDD + 2 random alphanumeric characters (e.g., 241112AB)
 * This creates an 8-character reference that includes the date and is highly unlikely to duplicate
 */
export function generateBookingReference(): string {
  const now = new Date();
  
  // Get date components (YYMMDD format)
  const year = now.getFullYear().toString().slice(-2); // Last 2 digits of year
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  
  // Create date prefix (6 digits)
  const datePrefix = `${year}${month}${day}`;
  
  // Generate 2 random alphanumeric characters for uniqueness
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding similar looking chars (0,O,1,I)
  let randomSuffix = '';
  for (let i = 0; i < 2; i++) {
    randomSuffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Combine: YYMMDD + 2 random chars = 8 characters total
  return `${datePrefix}${randomSuffix}`;
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
 * Example: 241112AB -> 241112-AB
 */
export function formatBookingReference(reference: string): string {
  if (reference.length === 8) {
    return `${reference.substring(0, 6)}-${reference.substring(6)}`;
  } else if (reference.length === 6) {
    return `${reference.substring(0, 5)}-${reference.substring(5)}`;
  }
  return reference;
}

