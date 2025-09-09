// src/lib/codegen.ts
import { DocType } from '@/types/invoice';

const pad = (n: number, width = 5) => String(n).padStart(width, '0');

export function nextDocCode(docType: DocType, lastSeq: number) {
  const prefix = docType === 'invoice' ? 'INV' : 'QTE';
  return `${prefix}-${pad(lastSeq + 1)}`;
}

// Legacy functions - kept for backward compatibility
interface BrandSequences {
  [brandPrefix: string]: {
    [year: number]: number;
  };
}

const STORAGE_KEY = 'document-sequences';

function loadSequences(): BrandSequences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveSequences(sequences: BrandSequences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sequences));
  } catch {
    // Silent fail on storage errors
  }
}

export function generateDocumentCode(brandPrefix: string): { code: string; year: number; sequence: number } {
  const sequences = loadSequences();
  const currentYear = new Date().getFullYear();
  
  if (!sequences[brandPrefix]) {
    sequences[brandPrefix] = {};
  }
  
  if (!sequences[brandPrefix][currentYear]) {
    sequences[brandPrefix][currentYear] = 0;
  }
  
  sequences[brandPrefix][currentYear] += 1;
  const sequence = sequences[brandPrefix][currentYear];
  
  saveSequences(sequences);
  
  const code = `${brandPrefix}-${currentYear}-${sequence.toString().padStart(6, '0')}`;
  
  return { code, year: currentYear, sequence };
}

export function getCurrentSequence(brandPrefix: string, year?: number): number {
  const sequences = loadSequences();
  const targetYear = year || new Date().getFullYear();
  
  if (!sequences[brandPrefix] || !sequences[brandPrefix][targetYear]) {
    return 0;
  }
  
  return sequences[brandPrefix][targetYear];
}