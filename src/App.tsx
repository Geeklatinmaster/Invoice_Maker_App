import { useState } from 'react';
import ProfileSelector from "./features/invoice/components/ProfileSelector";
import FooterSelector from "./features/invoice/components/FooterSelector";
import InvoiceForm from "./features/invoice/components/InvoiceForm";
import Preview from "./features/invoice/components/Preview";
import CustomizerPanel from "./features/customizer/CustomizerPanel";

export default function App() {
  const [activeTab, setActiveTab] = useState<'form' | 'customizer'>('form');

  return (
    <main style={{
      fontFamily: "system-ui", 
      display: "flex", 
      height: "100vh",
      overflow: "hidden"
    }}>
      {/* Left Panel - Form or Customizer */}
      <div style={{
        width: '400px',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #e2e8f0'
      }}>
        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          background: '#f8fafc'
        }}>
          <button
            onClick={() => setActiveTab('form')}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: 'none',
              background: activeTab === 'form' ? 'white' : 'transparent',
              borderBottom: activeTab === 'form' ? '2px solid #3b82f6' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              color: activeTab === 'form' ? '#1f2937' : '#6b7280'
            }}
          >
            Invoice Form
          </button>
          <button
            onClick={() => setActiveTab('customizer')}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: 'none',
              background: activeTab === 'customizer' ? 'white' : 'transparent',
              borderBottom: activeTab === 'customizer' ? '2px solid #3b82f6' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              color: activeTab === 'customizer' ? '#1f2937' : '#6b7280'
            }}
          >
            Live Customizer
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'form' ? (
          <div style={{
            flex: 1,
            overflow: 'auto',
            padding: '16px'
          }}>
            <div style={{display:"grid", gap:12}}>
              <h2 style={{margin: 0, fontSize: '18px', fontWeight: '600'}}>
                InvoiceMaker 2.2.0-themes
              </h2>
              <ProfileSelector />
              <FooterSelector />
              <InvoiceForm />
            </div>
          </div>
        ) : (
          <CustomizerPanel />
        )}
      </div>

      {/* Right Panel - Preview */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '16px',
          borderBottom: '1px solid #e2e8f0',
          background: '#f8fafc',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{margin: 0, fontSize: '16px', fontWeight: '600'}}>
            Live Preview
          </h3>
          <a 
            href="/print.html" 
            target="_blank" 
            rel="noreferrer"
            style={{
              fontSize: '12px',
              color: '#6b7280',
              textDecoration: 'none'
            }}
          >
            Open Print View →
          </a>
        </div>
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '16px',
          background: '#ffffff'
        }}>
          <Preview />
        </div>
      </div>
    </main>
  );
}
