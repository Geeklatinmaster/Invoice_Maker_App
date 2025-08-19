import { useInvoice, useColorSettings, useLogoSettings, useThemeSettings } from "@/features/invoice/store/useInvoice";
import type { ThemeSettings, FooterSettings, LogoSettings } from "@/features/invoice/types/types";

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
  const s = useInvoice();
  const colorSettings = useColorSettings();
  const logoSettings = useLogoSettings();
  const themeSettings = useThemeSettings();
  const profile = s.profiles.find(p => p.id === s.selectedProfileId) ?? s.profiles[0];
  
  if (!profile) return null;
  
  const footer = profile.footer || {};


  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const dataUrl = await fileToDataURL(file);
      s.setLogo({ logoDataUrl: dataUrl, logoUrl: undefined });
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
      
      {/* Theme Settings */}
      <fieldset style={{ marginBottom: 12, padding: 8 }}>
        <legend>🎨 Theme Colors & Fonts</legend>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
          <label>
            Brand Primary:
            <input 
              type="color" 
              value={colorSettings.brandPrimary} 
              onInput={e => s.updateBrandPrimary(e.currentTarget.value)}
            />
          </label>
          <label>
            Brand Secondary:
            <input 
              type="color" 
              value={colorSettings.brandSecondary} 
              onInput={e => s.updateBrandSecondary(e.currentTarget.value)}
            />
          </label>
          <label>
            Text Color:
            <input 
              type="color" 
              value={colorSettings.text} 
              onInput={e => s.setTheme({ text: e.currentTarget.value })}
            />
          </label>
          <label>
            Background:
            <input 
              type="color" 
              value={colorSettings.background} 
              onInput={e => s.updateBackground(e.currentTarget.value)}
            />
          </label>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 8, marginTop: 8 }}>
          <label>
            Font Family:
            <select 
              value={themeSettings.fontFamily} 
              onInput={e => s.setTheme({ fontFamily: e.currentTarget.value })}
            >
              <option value="Roboto">Roboto</option>
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Georgia">Georgia</option>
            </select>
          </label>
          <label>
            Font Size: {themeSettings.baseFontPx}px
            <input 
              type="range" 
              min="10" 
              max="20" 
              value={themeSettings.baseFontPx} 
              onInput={e => s.updateBaseFontSize(Number(e.currentTarget.value))}
              style={{ width: "100%", marginTop: "4px" }}
            />
          </label>
          <label>
            Font Weight:
            <select 
              value={themeSettings.fontWeight} 
              onInput={e => s.setTheme({ fontWeight: e.currentTarget.value as any })}
            >
              <option value="Normal">Normal</option>
              <option value="SemiBold">SemiBold</option>
              <option value="Bold">Bold</option>
            </select>
          </label>
          <label>
            Density:
            <select 
              value={themeSettings.density} 
              onInput={e => s.setTheme({ density: e.currentTarget.value as any })}
            >
              <option value="compact">Compact</option>
              <option value="normal">Normal</option>
              <option value="relaxed">Relaxed</option>
            </select>
          </label>
          <label>
            Totals Align:
            <select 
              value={themeSettings.totalsAlign} 
              onInput={e => s.setTheme({ totalsAlign: e.currentTarget.value as any })}
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
              checked={profile?.theme?.altRowStripesOn || false}
              onInput={e => s.setTheme({ altRowStripesOn: e.currentTarget.checked })}
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
                value={logoSettings.logo.logoUrl || ""} 
                onInput={e => s.updateLogoUrl(e.currentTarget.value)}
                placeholder="https://example.com/logo.png"
              />
            </label>
          </div>
          
          <div style={{ display: "flex", gap: 8 }}>
            <label>
              Logo Size:
              <select 
                value={logoSettings.logoSize} 
                onInput={e => s.updateLogoSize(e.currentTarget.value as any)}
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </label>
            <label>
              Logo Align:
              <select 
                value={logoSettings.logoAlign} 
                onInput={e => s.updateLogoAlign(e.currentTarget.value as any)}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </label>
          </div>
          
          {(logoSettings.logo.logoDataUrl || logoSettings.logo.logoUrl) && (
            <div style={{ marginTop: 8 }}>
              <img 
                src={logoSettings.logo.logoDataUrl || logoSettings.logo.logoUrl} 
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
              onChange={e => s.setFooter({ layout: e.target.value as any })}
            >
              <option value="simple">Simple</option>
              <option value="corporate">Corporate</option>
            </select>
          </label>
          
          <label>
            Notes:
            <textarea 
              value={footer.notes || ""} 
              onChange={e => s.setFooter({ notes: e.target.value })}
              placeholder="Additional notes or terms..."
              rows={3}
            />
          </label>
          
          <label>
            Contact Info:
            <input 
              value={footer.contact || ""} 
              onChange={e => s.setFooter({ contact: e.target.value })}
              placeholder="www.company.com | +1-555-123-4567"
            />
          </label>
          
          <label>
            Social Media:
            <input 
              value={footer.socialsCsv || ""} 
              onChange={e => s.setFooter({ socialsCsv: e.target.value })}
              placeholder="Instagram @handle, YouTube @channel"
            />
          </label>
          
          {footer.layout === "corporate" && (
            <label>
              Legal Text:
              <textarea 
                value={footer.legal || ""} 
                onChange={e => s.setFooter({ legal: e.target.value })}
                placeholder="Legal disclaimers, terms, etc..."
                rows={2}
              />
            </label>
          )}
          
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <input 
                type="checkbox" 
                checked={footer.colorBarOn || false}
                onChange={e => s.setFooter({ colorBarOn: e.target.checked })}
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
                  onChange={e => s.setFooter({ colorBarHeightPx: parseInt(e.target.value) })}
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