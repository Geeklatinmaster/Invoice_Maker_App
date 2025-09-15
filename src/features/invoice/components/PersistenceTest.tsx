// Integration test component for persistence layer
import React, { useEffect, useState } from 'react';
import { useInvoice } from '../store/useInvoice';
import { runStorageTests } from '../lib/storage.test';

export default function PersistenceTest() {
  const [testResult, setTestResult] = useState<string>('');
  const store = useInvoice();

  const runIntegrationTest = async () => {
    try {
      setTestResult('Running tests...');
      
      // 1. Unit tests
      const unitTestsPassed = runStorageTests();
      if (!unitTestsPassed) {
        setTestResult('❌ Unit tests failed');
        return;
      }

      // 2. Store integration test
      // Create a document
      store.createNewDocument();
      store.patchInvoice({ customerName: 'Test Customer' });
      store.addItem();
      store.updateItem(store.invoice.items[0].id, { 
        title: 'Test Item',
        unitPrice: 100.50,
        qty: 2 
      });

      // Wait a bit for async operations
      await new Promise(resolve => setTimeout(resolve, 100));

      // 3. Test duplicate
      const originalCode = store.invoice.code;
      store.duplicateDocument();
      const duplicatedCode = store.invoice.code;

      if (originalCode === duplicatedCode) {
        setTestResult('❌ Duplicate test failed: codes should be different');
        return;
      }

      // 4. Test price sanitization
      store.updateItem(store.invoice.items[0].id, { unitPrice: "007.50" as any });
      if (store.invoice.items[0].unitPrice !== 7.5) {
        setTestResult('❌ Price sanitization failed');
        return;
      }

      setTestResult('✅ All persistence tests passed! State should persist on page refresh.');
      
    } catch (error) {
      setTestResult(`❌ Test error: ${error}`);
      console.error('Persistence test error:', error);
    }
  };

  useEffect(() => {
    if (import.meta.env.DEV) {
      runIntegrationTest();
    }
  }, []);

  // Only render in development mode
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: 10, 
      right: 10, 
      background: '#f0f0f0', 
      border: '1px solid #ccc',
      padding: 10,
      borderRadius: 5,
      fontSize: '12px',
      maxWidth: 300,
      zIndex: 9999
    }}>
      <h4>Persistence Tests</h4>
      <p>{testResult}</p>
      <button onClick={runIntegrationTest} style={{ fontSize: '10px', padding: '2px 8px' }}>
        Re-run Tests
      </button>
      <div style={{ marginTop: 8, fontSize: '10px' }}>
        <strong>Current Invoice:</strong><br/>
        Customer: {store.invoice.customerName || 'None'}<br/>
        Items: {store.invoice.items.length}<br/>
        Total: ${store.totals.total.toFixed(2)}
      </div>
    </div>
  );
}