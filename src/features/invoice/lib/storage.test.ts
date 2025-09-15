// Simple smoke test for storage functionality
import { sanitizePrice, preserveId, save, load, STORAGE_KEYS } from './storage';

// Mock localStorage for testing
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Test sanitizePrice function
export function testSanitizePrice() {
  const tests = [
    { input: "007.50", expected: 7.5 },
    { input: "0000123", expected: 123 },
    { input: "12.34", expected: 12.34 },
    { input: "abc123", expected: 123 },
    { input: "", expected: 0 },
    { input: 42.5, expected: 42.5 },
    { input: -10, expected: 0 }, // negative values should be 0
  ];

  let passed = 0;
  tests.forEach(({ input, expected }, index) => {
    const result = sanitizePrice(input);
    if (result === expected) {
      passed++;
      console.log(`✓ Test ${index + 1} passed: ${input} -> ${result}`);
    } else {
      console.error(`✗ Test ${index + 1} failed: ${input} -> ${result}, expected ${expected}`);
    }
  });

  console.log(`Price sanitization tests: ${passed}/${tests.length} passed`);
  return passed === tests.length;
}

// Test preserveId function
export function testPreserveId() {
  const existingId = "existing-123";
  const preserved = preserveId(existingId);
  
  if (preserved !== existingId) {
    console.error(`✗ ID preservation failed: expected ${existingId}, got ${preserved}`);
    return false;
  }

  const newId = preserveId();
  if (!newId || newId === existingId) {
    console.error(`✗ New ID generation failed: got ${newId}`);
    return false;
  }

  console.log(`✓ ID preservation tests passed`);
  return true;
}

// Test save/load functionality
export function testSaveLoad() {
  const testData = { 
    invoices: [{ id: '1', amount: 100.50 }], 
    timestamp: Date.now() 
  };
  
  // Test save
  save(STORAGE_KEYS.INVOICES, testData);
  
  // Test load
  const loaded = load(STORAGE_KEYS.INVOICES, {});
  
  if (JSON.stringify(loaded) !== JSON.stringify(testData)) {
    console.error(`✗ Save/Load test failed`);
    return false;
  }

  console.log(`✓ Save/Load tests passed`);
  return true;
}

// Run all tests
export function runStorageTests() {
  console.log('Running storage smoke tests...');
  
  const results = [
    testSanitizePrice(),
    testPreserveId(),
    testSaveLoad(),
  ];
  
  const passed = results.filter(Boolean).length;
  console.log(`\nStorage Tests Summary: ${passed}/${results.length} test suites passed`);
  
  return passed === results.length;
}

// Auto-run tests if in development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  runStorageTests();
}