import { useState, useRef } from 'react';
import { useTheme } from '../../theme/useTheme';
import { Icon } from '../../theme/Icon';
import type { TemplateId } from '../../theme/types';

const TEMPLATES: { id: TemplateId; name: string; preview: string }[] = [
  { id: 'modernTeal', name: 'Modern Teal', preview: '#0891b2' },
  { id: 'mintBand', name: 'Mint Band', preview: '#10b981' },
  { id: 'navyWave', name: 'Navy Wave', preview: '#1e40af' },
  { id: 'redBadge', name: 'Red Badge', preview: '#dc2626' },
  { id: 'redRibbon', name: 'Red Ribbon', preview: '#b91c1c' },
  { id: 'orangeCut', name: 'Orange Cut', preview: '#ea580c' },
  { id: 'yellowArc', name: 'Yellow Arc', preview: '#ca8a04' },
];

const FONTS = [
  'Inter', 'system-ui', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 
  'Poppins', 'Source Sans Pro', 'Georgia', 'Times New Roman', 'serif'
];

const LUCIDE_ICONS = [
  'FileText', 'Receipt', 'Calculator', 'Building', 'Mail', 'Phone', 
  'MapPin', 'Globe', 'Users', 'Star', 'Heart', 'Check', 'X', 'Plus'
];

function ColorInput({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div className="color-input">
      <label style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', display: 'block' }}>
        {label}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '32px',
            height: '32px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1,
            padding: '6px 8px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'monospace'
          }}
        />
      </div>
    </div>
  );
}

function SliderInput({ 
  value, 
  onChange, 
  min, 
  max, 
  step = 1, 
  label, 
  unit = '' 
}: { 
  value: number; 
  onChange: (v: number) => void; 
  min: number; 
  max: number; 
  step?: number; 
  label: string; 
  unit?: string;
}) {
  return (
    <div className="slider-input">
      <label style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', display: 'block' }}>
        {label}: {value}{unit}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: '100%',
          height: '6px',
          borderRadius: '3px',
          background: '#e5e7eb',
          outline: 'none'
        }}
      />
    </div>
  );
}

function IconPicker({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (iconName: string, customSvg?: string) => void;
}) {
  const [showPicker, setShowPicker] = useState(false);
  const [customSvg, setCustomSvg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCustomSvg = () => {
    if (customSvg.trim()) {
      onChange('custom', customSvg);
      setCustomSvg('');
      setShowPicker(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const svgContent = event.target?.result as string;
        onChange('custom', svgContent);
        setShowPicker(false);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="icon-picker">
      <label style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', display: 'block' }}>
        Brand Icon
      </label>
      
      <button
        onClick={() => setShowPicker(!showPicker)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          background: 'white',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        <Icon name={value} size={16} />
        <span>{value === 'custom' ? 'Custom SVG' : value}</span>
        <Icon name="ChevronDown" size={14} />
      </button>

      {showPicker && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          zIndex: 10,
          background: 'white',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          marginTop: '4px',
          padding: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ marginBottom: '8px', fontSize: '12px', fontWeight: '500' }}>
            Lucide Icons
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '4px',
            marginBottom: '12px'
          }}>
            {LUCIDE_ICONS.map(iconName => (
              <button
                key={iconName}
                onClick={() => {
                  onChange(iconName);
                  setShowPicker(false);
                }}
                style={{
                  padding: '8px',
                  border: value === iconName ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                  borderRadius: '4px',
                  background: value === iconName ? '#eff6ff' : 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Icon name={iconName} size={16} />
              </button>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '8px' }}>
            <div style={{ marginBottom: '8px', fontSize: '12px', fontWeight: '500' }}>
              Custom SVG
            </div>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
              <input
                ref={fileInputRef}
                type="file"
                accept=".svg"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: '6px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  background: 'white',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Upload SVG
              </button>
            </div>
            <textarea
              value={customSvg}
              onChange={(e) => setCustomSvg(e.target.value)}
              placeholder="Or paste SVG code..."
              style={{
                width: '100%',
                height: '60px',
                padding: '6px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '11px',
                fontFamily: 'monospace',
                resize: 'vertical'
              }}
            />
            {customSvg && (
              <button
                onClick={handleCustomSvg}
                style={{
                  marginTop: '4px',
                  padding: '6px 12px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Use Custom SVG
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomizerPanel() {
  const { 
    template, 
    tokens, 
    setTemplate, 
    setAccent, 
    setAccent2, 
    setText, 
    setTextMuted, 
    setBg, 
    setSurface, 
    setBorder, 
    setHeadingFont, 
    setBodyFont, 
    setRadius, 
    setBorderWidth, 
    setStripe, 
    setStripeOpacity, 
    setLogoMaxH, 
    setTableRowH, 
    setSpacing,
    setBrandIcon 
  } = useTheme();

  const [showIconPicker, setShowIconPicker] = useState(false);

  return (
    <div style={{
      width: '320px',
      height: '100vh',
      overflow: 'auto',
      padding: '16px',
      background: '#f8fafc',
      borderRight: '1px solid #e2e8f0'
    }}>
      <h2 style={{ 
        margin: '0 0 20px 0', 
        fontSize: '18px', 
        fontWeight: '600',
        color: '#1f2937'
      }}>
        Live Customizer
      </h2>

      {/* Template Selection */}
      <section style={{ marginBottom: '24px' }}>
        <h3 style={{ 
          margin: '0 0 12px 0', 
          fontSize: '14px', 
          fontWeight: '500',
          color: '#374151'
        }}>
          Template
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px'
        }}>
          {TEMPLATES.map(tmpl => (
            <button
              key={tmpl.id}
              onClick={() => setTemplate(tmpl.id)}
              style={{
                padding: '12px',
                border: template === tmpl.id ? '2px solid #3b82f6' : '1px solid #d1d5db',
                borderRadius: '8px',
                background: template === tmpl.id ? '#eff6ff' : 'white',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{
                width: '100%',
                height: '20px',
                background: tmpl.preview,
                borderRadius: '4px',
                marginBottom: '6px'
              }} />
              <div style={{ fontSize: '12px', fontWeight: '500' }}>
                {tmpl.name}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Colors */}
      <section style={{ marginBottom: '24px' }}>
        <h3 style={{ 
          margin: '0 0 16px 0', 
          fontSize: '14px', 
          fontWeight: '500',
          color: '#374151'
        }}>
          Colors
        </h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          <ColorInput 
            value={tokens.accent} 
            onChange={setAccent} 
            label="Primary Accent" 
          />
          <ColorInput 
            value={tokens.accent2} 
            onChange={setAccent2} 
            label="Secondary Accent" 
          />
          <ColorInput 
            value={tokens.text} 
            onChange={setText} 
            label="Text Color" 
          />
          <ColorInput 
            value={tokens.textMuted} 
            onChange={setTextMuted} 
            label="Muted Text" 
          />
          <ColorInput 
            value={tokens.bg} 
            onChange={setBg} 
            label="Background" 
          />
          <ColorInput 
            value={tokens.surface} 
            onChange={setSurface} 
            label="Surface/Cards" 
          />
          <ColorInput 
            value={tokens.border} 
            onChange={setBorder} 
            label="Borders" 
          />
        </div>
      </section>

      {/* Typography */}
      <section style={{ marginBottom: '24px' }}>
        <h3 style={{ 
          margin: '0 0 16px 0', 
          fontSize: '14px', 
          fontWeight: '500',
          color: '#374151'
        }}>
          Typography
        </h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', display: 'block' }}>
              Heading Font
            </label>
            <select
              value={tokens.headingFont}
              onChange={(e) => setHeadingFont(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              {FONTS.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', display: 'block' }}>
              Body Font
            </label>
            <select
              value={tokens.bodyFont}
              onChange={(e) => setBodyFont(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              {FONTS.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Layout */}
      <section style={{ marginBottom: '24px' }}>
        <h3 style={{ 
          margin: '0 0 16px 0', 
          fontSize: '14px', 
          fontWeight: '500',
          color: '#374151'
        }}>
          Layout
        </h3>
        <div style={{ display: 'grid', gap: '16px' }}>
          <SliderInput
            value={tokens.borderWidth}
            onChange={setBorderWidth}
            min={0}
            max={4}
            step={0.5}
            label="Border Width"
            unit="px"
          />
          <SliderInput
            value={tokens.radius}
            onChange={setRadius}
            min={0}
            max={16}
            label="Border Radius"
            unit="px"
          />
          <SliderInput
            value={tokens.spacing}
            onChange={setSpacing}
            min={8}
            max={32}
            label="Spacing"
            unit="px"
          />
          <SliderInput
            value={tokens.logoMaxH}
            onChange={setLogoMaxH}
            min={32}
            max={120}
            label="Logo Max Height"
            unit="px"
          />
          <SliderInput
            value={tokens.tableRowH}
            onChange={setTableRowH}
            min={32}
            max={64}
            label="Table Row Height"
            unit="px"
          />
        </div>
      </section>

      {/* Table Options */}
      <section style={{ marginBottom: '24px' }}>
        <h3 style={{ 
          margin: '0 0 16px 0', 
          fontSize: '14px', 
          fontWeight: '500',
          color: '#374151'
        }}>
          Table
        </h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={tokens.stripe}
              onChange={(e) => setStripe(e.target.checked)}
              style={{ width: '16px', height: '16px' }}
            />
            <span style={{ fontSize: '14px' }}>Alternating Row Stripes</span>
          </label>
          {tokens.stripe && (
            <SliderInput
              value={tokens.stripeOpacity}
              onChange={setStripeOpacity}
              min={0.05}
              max={0.3}
              step={0.05}
              label="Stripe Opacity"
            />
          )}
        </div>
      </section>

      {/* Brand Icon */}
      <section style={{ marginBottom: '24px' }}>
        <h3 style={{ 
          margin: '0 0 16px 0', 
          fontSize: '14px', 
          fontWeight: '500',
          color: '#374151'
        }}>
          Brand Icon
        </h3>
        <div style={{ position: 'relative' }}>
          <IconPicker
            value={tokens.brandIcon}
            onChange={(iconName, customSvg) => setBrandIcon(iconName, customSvg)}
          />
        </div>
      </section>
    </div>
  );
}