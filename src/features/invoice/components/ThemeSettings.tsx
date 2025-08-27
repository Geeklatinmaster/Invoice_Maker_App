import { useState, useRef, useEffect } from 'react';
import { useInvoice, type FooterData } from "@/features/invoice/store/useInvoice";

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
  const profiles = useInvoice(s => s.profiles);
  const customizer = useInvoice(s => s.customizer);
  const setFooter = useInvoice(s => s.setFooter);
  const invoiceFooter = useInvoice(s => s.invoice?.footer) as FooterData | undefined;
  const setInvoiceFooter = useInvoice(s => s.setInvoiceFooter);
  
  // Customizer actions
  const updateCustomizerLogoSize = useInvoice(s => s.updateCustomizerLogoSize);
  const updateLogoPosition = useInvoice(s => s.updateLogoPosition);
  const updateMargins = useInvoice(s => s.updateMargins);
  const updateColors = useInvoice(s => s.updateColors);
  const updateFontSize = useInvoice(s => s.updateFontSize);
  const updateFontFamily = useInvoice(s => s.updateFontFamily);
  const updateTable = useInvoice(s => s.updateTable);
  const setLogo = useInvoice(s => s.setLogo);

  const profile = profiles.find(p => p.id === selectedProfileId) ?? profiles[0];
  const footer = profile?.footer ?? {};
  
  if (!profile) return null;

  // Estado local para inputs de número
  const [titleSize, setTitleSize] = useState(customizer.fontSize.title);
  const [bodySize, setBodySize] = useState(customizer.fontSize.body);
  const [smallSize, setSmallSize] = useState(customizer.fontSize.small);
  const [topMargin, setTopMargin] = useState(customizer.margins.top);
  const [rightMargin, setRightMargin] = useState(customizer.margins.right);
  const [bottomMargin, setBottomMargin] = useState(customizer.margins.bottom);
  const [leftMargin, setLeftMargin] = useState(customizer.margins.left);

  // Estados locales para footer (edición fluida sin spamear el store)
  const [notes, setNotes] = useState(invoiceFooter?.notes ?? "");
  const [contact, setContact] = useState(invoiceFooter?.contactInfo ?? "");
  const [social, setSocial] = useState(invoiceFooter?.social ?? "");
  const [legal, setLegal] = useState(invoiceFooter?.legal ?? "");
  const [height, setHeight] = useState<number>(invoiceFooter?.colorBarHeight ?? 0);

  useEffect(() => {
    setNotes(invoiceFooter?.notes ?? "");
    setContact(invoiceFooter?.contactInfo ?? "");
    setSocial(invoiceFooter?.social ?? "");
    setLegal(invoiceFooter?.legal ?? "");
    setHeight(Number(invoiceFooter?.colorBarHeight ?? 0));
  }, [invoiceFooter?.notes, invoiceFooter?.contactInfo, invoiceFooter?.social, invoiceFooter?.legal, invoiceFooter?.colorBarHeight]);

  // Logo upload
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  
  useEffect(() => () => { 
    if (objectUrl) URL.revokeObjectURL(objectUrl); 
  }, [objectUrl]);

  const handleLogoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleLogoUrlSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem('logoUrl') as HTMLInputElement;
    if (input?.value) {
      setLogo({ logoUrl: input.value.trim(), logoDataUrl: undefined });
      toast("Logo URL set successfully!");
    }
  };

  // rAF para suavizar sliders
  const rafRef = useRef<number | null>(null);
  const onLogoSizeInput = (e: React.FormEvent<HTMLInputElement>) => {
    const next = Number((e.currentTarget as HTMLInputElement).value);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => updateCustomizerLogoSize(next));
  };

  return (
    <details style={{ marginBottom: 16, padding: 12, border: "1px solid #ddd", borderRadius: 4 }}>
      <summary style={{ cursor: "pointer", fontWeight: "bold", marginBottom: 8 }}>
        🎨 Live Customizer (Instant Updates)
      </summary>
      
      <fieldset style={{ marginBottom: 12, padding: 8, border: "2px solid #4ade80", borderRadius: 4 }}>
        <legend style={{ color: "#16a34a", fontWeight: "bold" }}>✨ All-in-One Customizer</legend>
        
        {/* 1) LOGO */}
        <section style={{ marginBottom: 20, padding: 12, border: "1px solid #e5e7eb", borderRadius: 4 }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "600" }}>📸 Logo</h3>
          
          {/* Upload & URL */}
          <div style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "center", flexWrap: "wrap" }}>
            <button 
              type="button" 
              onClick={() => fileRef.current?.click()}
              style={{ padding: "6px 12px", border: "1px solid #ddd", borderRadius: "4px", cursor: "pointer" }}
            >
              Upload File
            </button>
            <input 
              ref={fileRef} 
              type="file" 
              accept="image/*" 
              style={{ display: "none" }} 
              onChange={handleLogoFile}
            />
            <span>or</span>
            <form onSubmit={handleLogoUrlSubmit} style={{ display: "flex", gap: 8 }}>
              <input 
                name="logoUrl" 
                type="url" 
                placeholder="https://example.com/logo.png"
                style={{ padding: "4px 8px", border: "1px solid #ddd", borderRadius: "4px", minWidth: "200px" }}
              />
              <button 
                type="submit"
                style={{ padding: "4px 12px", border: "1px solid #ddd", borderRadius: "4px", cursor: "pointer" }}
              >
                Set URL
              </button>
            </form>
          </div>

          {/* Logo preview */}
          {(profile?.logo?.logoDataUrl || profile?.logo?.logoUrl) && (
            <div style={{ marginBottom: 12 }}>
              <img 
                src={profile.logo.logoDataUrl || profile.logo.logoUrl} 
                alt="Logo preview" 
                style={{ maxWidth: "200px", maxHeight: "100px", border: "1px solid #ddd", borderRadius: "4px" }}
              />
            </div>
          )}

          {/* Size & Position */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
            <label>
              Size ({customizer.logoSize}%)
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
              Position:
              <select
                value={customizer.logoPosition}
                onChange={(e) => updateLogoPosition(e.target.value as 'left'|'center'|'right')}
                style={{ width: "100%", padding: "4px", marginTop: "4px" }}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </label>
          </div>

          {/* Presets */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 8, marginTop: 12 }}>
            <button 
              type="button"
              onClick={() => { updateCustomizerLogoSize(25); updateLogoPosition('left'); }}
              style={{ padding: "4px 8px", fontSize: "12px", border: "1px solid #ddd", borderRadius: "4px", cursor: "pointer" }}
            >
              Small (25%)
            </button>
            <button 
              type="button"
              onClick={() => { updateCustomizerLogoSize(50); updateLogoPosition('center'); }}
              style={{ padding: "4px 8px", fontSize: "12px", border: "1px solid #ddd", borderRadius: "4px", cursor: "pointer" }}
            >
              Medium (50%)
            </button>
            <button 
              type="button"
              onClick={() => { updateCustomizerLogoSize(80); updateLogoPosition('right'); }}
              style={{ padding: "4px 8px", fontSize: "12px", border: "1px solid #ddd", borderRadius: "4px", cursor: "pointer" }}
            >
              Large (80%)
            </button>
            <button 
              type="button"
              onClick={() => { updateCustomizerLogoSize(100); updateLogoPosition('center'); }}
              style={{ padding: "4px 8px", fontSize: "12px", border: "1px solid #ddd", borderRadius: "4px", cursor: "pointer" }}
            >
              Hero (100%)
            </button>
          </div>
        </section>

        {/* 2) COLORS */}
        <section style={{ marginBottom: 20, padding: 12, border: "1px solid #e5e7eb", borderRadius: 4 }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "600" }}>🎨 Colors</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 8 }}>
            <label>
              Primary Color:
              <input
                type="color"
                value={customizer.colors.primary}
                onInput={(e) => updateColors({ primary: (e.currentTarget as HTMLInputElement).value })}
                style={{ width: "100%", height: "32px", marginTop: "4px" }}
              />
            </label>
            <label>
              Text Color:
              <input
                type="color"
                value={customizer.colors.text}
                onInput={(e) => updateColors({ text: (e.currentTarget as HTMLInputElement).value })}
                style={{ width: "100%", height: "32px", marginTop: "4px" }}
              />
            </label>
            <label>
              Background:
              <input
                type="color"
                value={customizer.colors.background}
                onInput={(e) => updateColors({ background: (e.currentTarget as HTMLInputElement).value })}
                style={{ width: "100%", height: "32px", marginTop: "4px" }}
              />
            </label>
          </div>
        </section>

        {/* 3) TYPOGRAPHY */}
        <section style={{ marginBottom: 20, padding: 12, border: "1px solid #e5e7eb", borderRadius: 4 }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "600" }}>✏️ Typography</h3>
          
          <div style={{ marginBottom: 12 }}>
            <label>
              Font Family:
              <select 
                value={customizer.fontFamily} 
                onChange={(e) => updateFontFamily(e.target.value)}
                style={{ width: "100%", padding: "4px", marginTop: "4px" }}
              >
                <option value="'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif">Inter/System</option>
                <option value="Georgia, 'Times New Roman', serif">Georgia</option>
                <option value="Arial, Helvetica, sans-serif">Arial</option>
                <option value="'Fira Sans', sans-serif">Fira Sans</option>
                <option value="Roboto, sans-serif">Roboto</option>
              </select>
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
            <label>
              Body Size ({bodySize}px):
              <input
                type="range"
                min={10}
                max={22}
                value={bodySize}
                onInput={(e) => {
                  const val = Number((e.currentTarget as HTMLInputElement).value);
                  setBodySize(val);
                  updateFontSize({ body: val });
                }}
                style={{ width: "100%", marginTop: "4px" }}
              />
            </label>
            
            <label>
              Title Size ({titleSize}px):
              <input
                type="range"
                min={14}
                max={48}
                value={titleSize}
                onInput={(e) => {
                  const val = Number((e.currentTarget as HTMLInputElement).value);
                  setTitleSize(val);
                  updateFontSize({ title: val });
                }}
                style={{ width: "100%", marginTop: "4px" }}
              />
            </label>
            
            <label>
              Small Size ({smallSize}px):
              <input
                type="range"
                min={8}
                max={16}
                value={smallSize}
                onInput={(e) => {
                  const val = Number((e.currentTarget as HTMLInputElement).value);
                  setSmallSize(val);
                  updateFontSize({ small: val });
                }}
                style={{ width: "100%", marginTop: "4px" }}
              />
            </label>
          </div>
        </section>

        {/* 4) LAYOUT (margins) */}
        <section style={{ marginBottom: 20, padding: 12, border: "1px solid #e5e7eb", borderRadius: 4 }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "600" }}>📐 Layout</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
            <label>
              Top Margin ({topMargin}px):
              <input
                type="number"
                min="0"
                max="100"
                value={topMargin}
                onChange={(e) => setTopMargin(Number(e.target.value))}
                onBlur={() => updateMargins({ top: Number(topMargin) })}
                style={{ width: "100%", padding: "4px", marginTop: "4px" }}
              />
            </label>
            <label>
              Right Margin ({rightMargin}px):
              <input
                type="number"
                min="0"
                max="100"
                value={rightMargin}
                onChange={(e) => setRightMargin(Number(e.target.value))}
                onBlur={() => updateMargins({ right: Number(rightMargin) })}
                style={{ width: "100%", padding: "4px", marginTop: "4px" }}
              />
            </label>
            <label>
              Bottom Margin ({bottomMargin}px):
              <input
                type="number"
                min="0"
                max="100"
                value={bottomMargin}
                onChange={(e) => setBottomMargin(Number(e.target.value))}
                onBlur={() => updateMargins({ bottom: Number(bottomMargin) })}
                style={{ width: "100%", padding: "4px", marginTop: "4px" }}
              />
            </label>
            <label>
              Left Margin ({leftMargin}px):
              <input
                type="number"
                min="0"
                max="100"
                value={leftMargin}
                onChange={(e) => setLeftMargin(Number(e.target.value))}
                onBlur={() => updateMargins({ left: Number(leftMargin) })}
                style={{ width: "100%", padding: "4px", marginTop: "4px" }}
              />
            </label>
          </div>
        </section>

        {/* 5) TABLE */}
        <section style={{ marginBottom: 20, padding: 12, border: "1px solid #e5e7eb", borderRadius: 4 }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "600" }}>📊 Table</h3>
          
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 12 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input 
                type="checkbox" 
                defaultChecked={customizer.table.stripes}
                onChange={(e) => updateTable({ stripes: e.target.checked })}
              />
              <span>Alternating row stripes</span>
            </label>
          </div>

          <label>
            Totals Align:
            <select 
              value={customizer.table.totalsAlign} 
              onChange={(e) => updateTable({ totalsAlign: e.target.value as any })}
              style={{ width: "100%", padding: "4px", marginTop: "4px" }}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </label>
        </section>

        {/* 6) FOOTER */}
        <section style={{ padding: 12, border: "1px solid #e5e7eb", borderRadius: 4 }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "600" }}>📄 Footer</h3>
          
          <div style={{ display: "grid", gap: 8 }}>
            <label>
              Footer Layout:
              <select 
                value={invoiceFooter?.layout || "Corporate"} 
                onChange={e => setInvoiceFooter({ layout: e.target.value as any })}
                style={{ width: "100%", padding: "4px", marginTop: "4px" }}
              >
                <option value="Corporate">Corporate</option>
                <option value="Simple">Simple</option>
                <option value="Minimal">Minimal</option>
              </select>
            </label>
            
            <label>
              Notes:
              <textarea 
                value={notes}
                onChange={e => setNotes(e.target.value)}
                onBlur={() => setInvoiceFooter({ notes })}
                placeholder="Additional notes or terms..."
                rows={4}
                style={{ width: "100%", padding: "4px", marginTop: "4px" }}
              />
            </label>
            
            <label>
              Contact Info:
              <input 
                type="text"
                value={contact}
                onChange={e => setContact(e.target.value)}
                onBlur={() => setInvoiceFooter({ contactInfo: contact })}
                placeholder="www.company.com | +1-555-123-4567"
                style={{ width: "100%", padding: "4px", marginTop: "4px" }}
              />
            </label>
            
            <label>
              Social Media:
              <input 
                type="text"
                value={social}
                onChange={e => setSocial(e.target.value)}
                onBlur={() => setInvoiceFooter({ social })}
                placeholder="Instagram @handle, YouTube @channel"
                style={{ width: "100%", padding: "4px", marginTop: "4px" }}
              />
            </label>
            
            <label>
              Legal Text:
              <textarea 
                value={legal}
                onChange={e => setLegal(e.target.value)}
                onBlur={() => setInvoiceFooter({ legal })}
                placeholder="Legal disclaimers, terms, etc..."
                rows={3}
                style={{ width: "100%", padding: "4px", marginTop: "4px" }}
              />
            </label>
            
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input 
                  type="checkbox" 
                  defaultChecked={!!invoiceFooter?.colorBarOn}
                  onChange={e => setInvoiceFooter({ colorBarOn: e.target.checked })}
                />
                <span>Color Bar</span>
              </label>
              <label>
                Height (px):
                <input 
                  type="number" 
                  min={0}
                  max={64}
                  value={height}
                  onChange={e => setHeight(Number(e.target.value))}
                  onBlur={() => setInvoiceFooter({ colorBarHeight: Number(height) })}
                  style={{ width: "72px", padding: "4px", marginLeft: "8px" }}
                />
              </label>
            </div>
          </div>
        </section>
      </fieldset>
    </details>
  );
}