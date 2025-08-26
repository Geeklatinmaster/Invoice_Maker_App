import { useState, useRef } from 'react';
import { useInvoice } from "@/features/invoice/store/useInvoice";

function toast(msg: string) { try { alert(msg); } catch {} }

async function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ThemeSettingsPanel() {
  // Use simple selectors to avoid object recreation loops
  const selectedProfileId = useInvoice(s => s.selectedProfileId);
  const profiles          = useInvoice(s => s.profiles);
  const setTheme          = useInvoice(s => s.setTheme);
  const invoice           = useInvoice(s => s.invoice);
  const setFooter         = useInvoice(s => s.setFooter);
  const customizer        = useInvoice(s => s.customizer);
  
  // Legacy actions
  const setLogo           = useInvoice(s => s.setLogo);
  const updateBrandPrimary = useInvoice(s => s.updateBrandPrimary);
  const updateBrandSecondary = useInvoice(s => s.updateBrandSecondary);
  const updateBackground  = useInvoice(s => s.updateBackground);
  const updateBaseFontSize = useInvoice(s => s.updateBaseFontSize);
  
  // Bridge for live updates
  const applyLegacyThemeToCustomizer = useInvoice(s => s.applyLegacyThemeToCustomizer);
  const updateFontFamily = useInvoice(s => s.updateFontFamily);
  
  // Customizer actions
  const updateCustomizerLogoSize = useInvoice(s => s.updateCustomizerLogoSize);
  const updateLogoPosition = useInvoice(s => s.updateLogoPosition);
  const updateMargins     = useInvoice(s => s.updateMargins);
  const updateColors      = useInvoice(s => s.updateColors);
  const updateFontSize    = useInvoice(s => s.updateFontSize);

  const profile = profiles.find(p => p.id === selectedProfileId) ?? profiles[0];
  const footer  = profile?.footer ?? {};
  
  if (!profile) return null;

  // Estado local para inputs de texto/number
  const [titleSize, setTitleSize] = useState(customizer.fontSize.title);
  const [bodySize, setBodySize] = useState(customizer.fontSize.body);
  const [smallSize, setSmallSize] = useState(customizer.fontSize.small);
  const [topMargin, setTopMargin] = useState(customizer.margins.top);
  const [rightMargin, setRightMargin] = useState(customizer.margins.right);
  const [bottomMargin, setBottomMargin] = useState(customizer.margins.bottom);
  const [leftMargin, setLeftMargin] = useState(customizer.margins.left);

  // rAF para suavizar sliders en equipos lentos
  const rafRef = useRef<number | null>(null);
  const onLogoSizeInput = (e: React.FormEvent<HTMLInputElement>) => {
    const next = Number((e.currentTarget as HTMLInputElement).value);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => updateCustomizerLogoSize(next));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const dataUrl = await fileToDataURL(file);
      setLogo({ logoDataUrl: dataUrl, logoUrl: undefined });
      toast("Logo uploaded successfully!");
    } catch (error) {
      console.error("Logo upload failed:", error);
      toast("Logo upload failed. Please try again.");
    }
  };

  return (
    <details style={{ marginBottom: 16, padding: 12, border: "1px solid #ddd", borderRadius: 4 }}>
      <summary style={{ cursor: "pointer", fontWeight: "bold", marginBottom: 8 }}>
        🎨 Advanced Theme & Design Settings
      </summary>
      
      {/* NEW CUSTOMIZER SETTINGS */}
      <fieldset style={{ marginBottom: 12, padding: 8, border: "2px solid #4ade80", borderRadius: 4 }}>
        <legend style={{ color: "#16a34a", fontWeight: "bold" }}>✨ Live Customizer (Instant Updates)</legend>
        
        {/* Logo Settings */}
        <div style={{ marginBottom: 12 }}>
          {/* Logo Presets */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8, marginBottom: 8 }}>
            <button 
              onClick={() => { updateCustomizerLogoSize(50); updateLogoPosition('left'); }}
              style={{ padding: "4px 8px", fontSize: "12px", border: "1px solid #ddd", borderRadius: "4px" }}
            >
              📄 Small Left (50%)
            </button>
            <button 
              onClick={() => { updateCustomizerLogoSize(80); updateLogoPosition('center'); }}
              style={{ padding: "4px 8px", fontSize: "12px", border: "1px solid #ddd", borderRadius: "4px" }}
            >
              🎯 Medium Center (80%)
            </button>
            <button 
              onClick={() => { updateCustomizerLogoSize(120); updateLogoPosition('right'); }}
              style={{ padding: "4px 8px", fontSize: "12px", border: "1px solid #ddd", borderRadius: "4px" }}
            >
              🏢 Large Right (120%)
            </button>
            <button 
              onClick={() => { updateCustomizerLogoSize(100); updateLogoPosition('center'); }}
              style={{ padding: "4px 8px", fontSize: "12px", border: "1px solid #ddd", borderRadius: "4px" }}
            >
              ⭐ Hero Center (100%)
            </button>
          </div>
          
          {/* Manual Controls */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 8 }}>
            <label>
              Logo Size: {customizer.logoSize}%
              <input
                type="range"
                min={10}
                max={200}
                value={customizer.logoSize}
                onInput={onLogoSizeInput}
                style={{ width: "100%", marginTop: "4px" }}
              />
            </label>
            
            <label>
              Logo Position:
              <select
                value={customizer.logoPosition}
                onChange={(e) => updateLogoPosition(e.target.value as 'left'|'center'|'right')}
                style={{ width: "100%" }}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </label>
          </div>
        </div>

        {/* Color Pickers (onInput for instant feedback) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 8, marginBottom: 12 }}>
          <label>
            Primary Color:
            <input
              type="color"
              value={customizer.colors.primary}
              onInput={(e) => updateColors({ primary: (e.currentTarget as HTMLInputElement).value })}
            />
          </label>
          <label>
            Text Color:
            <input
              type="color"
              value={customizer.colors.text}
              onInput={(e) => updateColors({ text: (e.currentTarget as HTMLInputElement).value })}
            />
          </label>
          <label>
            Background:
            <input
              type="color"
              value={customizer.colors.background}
              onInput={(e) => updateColors({ background: (e.currentTarget as HTMLInputElement).value })}
            />
          </label>
        </div>

        {/* Font Sizes (number: change local + blur commit) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8, marginBottom: 12 }}>
          <label>
            Title Size (px):
            <input
              type="number"
              min="16"
              max="48"
              value={titleSize}
              onChange={(e) => setTitleSize(Number(e.target.value))}
              onBlur={() => updateFontSize({ title: Number(titleSize) })}
            />
          </label>
          <label>
            Body Size (px):
            <input
              type="number"
              min="10"
              max="24"
              value={bodySize}
              onChange={(e) => setBodySize(Number(e.target.value))}
              onBlur={() => updateFontSize({ body: Number(bodySize) })}
            />
          </label>
          <label>
            Small Size (px):
            <input
              type="number"
              min="8"
              max="16"
              value={smallSize}
              onChange={(e) => setSmallSize(Number(e.target.value))}
              onBlur={() => updateFontSize({ small: Number(smallSize) })}
            />
          </label>
        </div>

        {/* Margins (number: blur commit) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
          <label>
            Top Margin (px):
            <input
              type="number"
              min="0"
              max="100"
              value={topMargin}
              onChange={(e) => setTopMargin(Number(e.target.value))}
              onBlur={() => updateMargins({ top: Number(topMargin) })}
            />
          </label>
          <label>
            Right Margin (px):
            <input
              type="number"
              min="0"
              max="100"
              value={rightMargin}
              onChange={(e) => setRightMargin(Number(e.target.value))}
              onBlur={() => updateMargins({ right: Number(rightMargin) })}
            />
          </label>
          <label>
            Bottom Margin (px):
            <input
              type="number"
              min="0"
              max="100"
              value={bottomMargin}
              onChange={(e) => setBottomMargin(Number(e.target.value))}
              onBlur={() => updateMargins({ bottom: Number(bottomMargin) })}
            />
          </label>
          <label>
            Left Margin (px):
            <input
              type="number"
              min="0"
              max="100"
              value={leftMargin}
              onChange={(e) => setLeftMargin(Number(e.target.value))}
              onBlur={() => updateMargins({ left: Number(leftMargin) })}
            />
          </label>
        </div>
      </fieldset>

      {/* LEGACY THEME SETTINGS (for compatibility) */}
      <fieldset style={{ marginBottom: 12, padding: 8 }}>
        <legend>🎨 Legacy Theme Colors & Fonts</legend>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
          <label>
            Brand Primary:
            <input 
              type="color" 
              value={profile?.theme?.brandPrimary || '#3b82f6'} 
              onInput={e => {
                const value = e.currentTarget.value;
                updateBrandPrimary(value);
                applyLegacyThemeToCustomizer({ primary: value });
              }}
            />
          </label>
          <label>
            Brand Secondary:
            <input 
              type="color" 
              value={profile?.theme?.brandSecondary || '#64748b'} 
              onInput={e => {
                const value = e.currentTarget.value;
                updateBrandSecondary(value);
                applyLegacyThemeToCustomizer({ text: value });
              }}
            />
          </label>
          <label>
            Background:
            <input 
              type="color" 
              value={profile?.theme?.background || '#ffffff'} 
              onInput={e => {
                const value = e.currentTarget.value;
                updateBackground(value);
                applyLegacyThemeToCustomizer({ background: value });
              }}
            />
          </label>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 8, marginTop: 8 }}>
          <label>
            Font Family:
            <select 
              value={profile?.theme?.fontFamily || 'system-ui'} 
              onChange={e => {
                const value = e.target.value;
                setTheme({ fontFamily: value });
                applyLegacyThemeToCustomizer({ fontFamily: value });
              }}
            >
              <option value="Roboto">Roboto</option>
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Georgia">Georgia</option>
            </select>
          </label>
          <label>
            Font Size: {profile?.theme?.baseFontPx || 14}px
            <input 
              type="range" 
              min="10" 
              max="20" 
              value={profile?.theme?.baseFontPx || 14} 
              onInput={e => updateBaseFontSize(Number(e.currentTarget.value))}
              style={{ width: "100%", marginTop: "4px" }}
            />
          </label>
          <label>
            Font Weight:
            <select 
              value={profile?.theme?.fontWeight || 'Normal'} 
              onChange={e => setTheme({ fontWeight: e.target.value as any })}
            >
              <option value="Normal">Normal</option>
              <option value="SemiBold">SemiBold</option>
              <option value="Bold">Bold</option>
            </select>
          </label>
          <label>
            Density:
            <select 
              value={profile?.theme?.density || 'normal'} 
              onChange={e => setTheme({ density: e.target.value as any })}
            >
              <option value="compact">Compact</option>
              <option value="normal">Normal</option>
              <option value="relaxed">Relaxed</option>
            </select>
          </label>
          <label>
            Totals Align:
            <select 
              value={profile?.theme?.totalsAlign || 'right'} 
              onChange={e => setTheme({ totalsAlign: e.target.value as any })}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </label>
        </div>
        
        <div style={{ marginTop: 8 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input 
              type="checkbox" 
              defaultChecked={!!profile?.theme?.altRowStripesOn}
              onChange={e => setTheme({ altRowStripesOn: e.target.checked })}
            />
            Alternating row stripes
          </label>
        </div>
      </fieldset>

      {/* Logo Settings */}
      <fieldset style={{ marginBottom: 12, padding: 8 }}>
        <legend>🖼️ Logo Settings</legend>
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <label>
              Upload Logo:
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleLogoUpload}
              />
            </label>
            <span>or</span>
            <label>
              Logo URL:
              <input 
                type="url" 
                value={profile?.logo?.logoUrl || ""} 
                onChange={e => setLogo({ logoUrl: e.target.value, logoDataUrl: undefined })}
                placeholder="https://example.com/logo.png"
              />
            </label>
          </div>
          
          <div style={{ display: "flex", gap: 8 }}>
            <label>
              Logo Size:
              <select 
                value={profile?.theme?.logoSize || 'md'} 
                onChange={e => setTheme({ logoSize: e.target.value as any })}
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </label>
            <label>
              Logo Align:
              <select 
                value={profile?.theme?.logoAlign || 'left'} 
                onChange={e => setTheme({ logoAlign: e.target.value as any })}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </label>
          </div>
          
          {(profile?.logo?.logoDataUrl || profile?.logo?.logoUrl) && (
            <div style={{ marginTop: 8 }}>
              <img 
                src={profile.logo.logoDataUrl || profile.logo.logoUrl} 
                alt="Logo preview" 
                style={{ maxWidth: "200px", maxHeight: "100px", border: "1px solid #ddd" }}
              />
            </div>
          )}
        </div>
      </fieldset>

      {/* Footer Settings */}
      <fieldset style={{ padding: 8 }}>
        <legend>📄 Footer Settings</legend>
        <div style={{ display: "grid", gap: 8 }}>
          <label>
            Footer Layout:
            <select 
              value={footer.layout || "simple"} 
              onChange={e => setFooter({ layout: e.target.value as any })}
            >
              <option value="simple">Simple</option>
              <option value="corporate">Corporate</option>
            </select>
          </label>
          
          <label>
            Notes:
            <textarea 
              value={footer.notes || ""} 
              onChange={e => setFooter({ notes: e.target.value })}
              placeholder="Additional notes or terms..."
              rows={3}
            />
          </label>
          
          <label>
            Contact Info:
            <input 
              value={footer.contact || ""} 
              onChange={e => setFooter({ contact: e.target.value })}
              placeholder="www.company.com | +1-555-123-4567"
            />
          </label>
          
          <label>
            Social Media:
            <input 
              value={footer.socialsCsv || ""} 
              onChange={e => setFooter({ socialsCsv: e.target.value })}
              placeholder="Instagram @handle, YouTube @channel"
            />
          </label>
          
          {footer.layout === "corporate" && (
            <label>
              Legal Text:
              <textarea 
                value={footer.legal || ""} 
                onChange={e => setFooter({ legal: e.target.value })}
                placeholder="Legal disclaimers, terms, etc..."
                rows={2}
              />
            </label>
          )}
          
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <input 
                type="checkbox" 
                defaultChecked={!!footer.colorBarOn}
                onChange={e => setFooter({ colorBarOn: e.target.checked })}
              />
              Color Bar
            </label>
            {footer.colorBarOn && (
              <label>
                Height (px):
                <input 
                  type="number" 
                  min="1" 
                  max="20" 
                  value={footer.colorBarHeightPx || 4} 
                  onChange={e => setFooter({ colorBarHeightPx: parseInt(e.target.value) })}
                  style={{ width: "60px" }}
                />
              </label>
            )}
          </div>
        </div>
      </fieldset>
    </details>
  );
}