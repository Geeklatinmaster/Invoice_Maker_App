// Namespaced keys for different document types and persistence layers
const BASE_KEY = "invoice-maker";

// Storage keys with namespacing
export const STORAGE_KEYS = {
  STATE: `${BASE_KEY}@state`,
  INVOICES: `${BASE_KEY}@invoices`,
  QUOTES: `${BASE_KEY}@quotes`,
  PROFILES: `${BASE_KEY}@profiles`,
  SETTINGS: `${BASE_KEY}@settings`,
} as const;

// Generic save/load functions
export const save = (key: string, obj: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(obj));
  } catch (error) {
    console.error(`Failed to save to localStorage (${key}):`, error);
  }
};

export const load = <T>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) as T : fallback;
  } catch (error) {
    console.error(`Failed to load from localStorage (${key}):`, error);
    return fallback;
  }
};

// Backward compatibility - legacy single key storage
export const saveLegacy = (obj: unknown) => save(STORAGE_KEYS.STATE, obj);
export const loadLegacy = <T>(fallback: T): T => load(STORAGE_KEYS.STATE, fallback);

// Price sanitization utilities
export const sanitizePrice = (value: string | number): number => {
  if (typeof value === 'number') {
    return Math.max(0, isNaN(value) ? 0 : value);
  }
  
  // Remove leading zeros and non-numeric characters except decimal point
  const cleaned = String(value).replace(/^0+(?=\d)/, '').replace(/[^\d.]/g, '');
  
  // Handle multiple decimal points - keep only the first one
  const parts = cleaned.split('.');
  const sanitized = parts.length > 1 ? `${parts[0]}.${parts.slice(1).join('')}` : parts[0];
  
  const num = parseFloat(sanitized || '0');
  return Math.max(0, isNaN(num) ? 0 : num);
};

// ID preservation utilities for edit/duplicate operations
export const preserveId = (existingId?: string): string => {
  // If we have an existing ID, preserve it (for edits)
  if (existingId && existingId.trim()) {
    return existingId.trim();
  }
  
  // Generate new ID (for new documents or duplicates)
  return crypto.randomUUID?.() || Math.random().toString(36).slice(2);
};
