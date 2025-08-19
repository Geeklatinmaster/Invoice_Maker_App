import { useMemo } from "react";
import { useInvoice, useColorSettings, useLogoSettings, useThemeSettings, useRenderVersion } from "@/features/invoice/store/useInvoice";
import { usePrintSync } from "../hooks/usePrintSync";
import { fmtCurrency } from "../lib/format";
import type { Profile } from "@/features/invoice/types/types";

const LOGO_PX: Record<"sm" | "md" | "lg", number> = { sm: 36, md: 64, lg: 92 };

export default function Preview() {
  const store = useInvoice();
  const renderVersion = useRenderVersion();
  const colorSettings = useColorSettings();
  const logoSettings = useLogoSettings();
  const themeSettings = useThemeSettings();
  
  // Sync styles for print
  usePrintSync();
  const invoice = store.invoice;
  const totals = store.totals;
  const profiles = store.profiles;
  const selectedProfileId = store.selectedProfileId;

  const currentProfile = useMemo(
    () => profiles.find((p: Profile) => p.id === selectedProfileId) ?? profiles[0],
    [profiles, selectedProfileId]
  );

  const footer = currentProfile?.footer || {};

  // CSS variables for instant style binding
  const cssVars = useMemo(() => ({
    "--brand-primary": colorSettings.brandPrimary,
    "--brand-secondary": colorSettings.brandSecondary,
    "--text": colorSettings.text,
    "--muted": colorSettings.muted,
    "--bg": colorSettings.background,
    "--accent": colorSettings.accent,
    "--base-size": `${themeSettings.baseFontPx}px`,
    fontFamily: themeSettings.fontFamily,
    fontSize: `${themeSettings.baseFontPx}px`,
    fontWeight: themeSettings.fontWeight === "Bold" ? "bold" : themeSettings.fontWeight === "SemiBold" ? "600" : "normal",
    lineHeight: themeSettings.density === "compact" ? "1.2" : themeSettings.density === "relaxed" ? "1.6" : "1.4",
    color: colorSettings.text,
    backgroundColor: colorSettings.background,
  } as React.CSSProperties), [colorSettings, themeSettings]);

  // Logo configuration
  const logoUrl = logoSettings.logo.logoDataUrl || logoSettings.logo.logoUrl || "";
  const logoSizePx = LOGO_PX[logoSettings.logoSize];
  const logoStyle: React.CSSProperties = useMemo(() => ({ 
    height: logoSizePx, 
    width: "auto", 
    objectFit: "contain" 
  }), [logoSizePx]);

  const logoAlignmentStyle = useMemo(() => 
    logoSettings.logoAlign === "right" ? { justifyContent: "flex-end" } :
    logoSettings.logoAlign === "center" ? { justifyContent: "center" } :
    { justifyContent: "flex-start" }, [logoSettings.logoAlign]);

  const headerStyles = useMemo(() => ({
    color: colorSettings.brandPrimary,
    margin: "0 0 8px 0",
  }), [colorSettings.brandPrimary]);

  const tableStyles = {
    width: "100%",
    borderCollapse: "collapse" as const,
    marginTop: "16px",
  };

  const thStyles = useMemo(() => ({
    backgroundColor: colorSettings.brandPrimary,
    color: "white",
    padding: themeSettings.density === "compact" ? "4px 6px" : themeSettings.density === "relaxed" ? "10px 12px" : "6px 8px",
    fontSize: `${themeSettings.baseFontPx - 1}px`,
    fontWeight: "bold",
  }), [colorSettings.brandPrimary, themeSettings.density, themeSettings.baseFontPx]);

  const tdStyles = useMemo(() => ({
    padding: themeSettings.density === "compact" ? "3px 6px" : themeSettings.density === "relaxed" ? "8px 12px" : "5px 8px",
    borderBottom: themeSettings.separators === "lines" ? "1px solid #ddd" : 
                  themeSettings.separators === "underline" ? "1px solid #ccc" : "none",
  }), [themeSettings.density, themeSettings.separators]);

  const totalsContainerStyles = useMemo(() => ({
    marginTop: "16px",
    textAlign: themeSettings.totalsAlign as any,
    fontSize: `${themeSettings.baseFontPx + 1}px`,
  }), [themeSettings.totalsAlign, themeSettings.baseFontPx]);

  return (
    <section 
      className="invoice-preview"
      style={{
        ...cssVars,
        border: "1px solid #ddd", 
        padding: "16px",
        minHeight: "400px",
      }}
      data-rv={renderVersion}
    >
      {/* Logo */}
      <div className="invoice-logo" style={{ display: "flex", ...logoAlignmentStyle, marginBottom: "12px" }}>
        {logoUrl ? <img src={logoUrl} alt="logo" style={logoStyle} /> : null}
      </div>

      {/* Header */}
      <h3 style={headerStyles}>{currentProfile?.businessName || "Business Name"}</h3>
      <p style={{ margin: "4px 0", fontWeight: "600" }}>
        {invoice.docType} • {invoice.code}
      </p>
      <p style={{ margin: "4px 0 16px 0" }}>
        Customer: {invoice.customerName || "(no customer name)"}
      </p>
      
      {/* Items Table */}
      <table className="invoice-table" style={tableStyles}>
        <thead>
          <tr>
            <th style={{...thStyles, textAlign: "left"}}>Item</th>
            <th style={{...thStyles, textAlign: "center"}}>Qty</th>
            <th style={{...thStyles, textAlign: "center"}}>Unit Price</th>
            <th style={{...thStyles, textAlign: "right"}}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item: any, idx: number) => (
            <tr 
              key={item.id}
              style={{
                backgroundColor: currentProfile?.theme?.altRowStripesOn && idx % 2 === 1 ? "#f8f9fa" : "transparent"
              }}
            >
              <td style={{...tdStyles, textAlign: "left"}}>
                <div style={{ fontWeight: "500" }}>{item.title}</div>
                {item.description && (
                  <div style={{ fontSize: "0.9em", color: colorSettings.muted, marginTop: "2px" }}>
                    {item.description}
                  </div>
                )}
              </td>
              <td style={{...tdStyles, textAlign: "center"}}>{item.qty}</td>
              <td style={{...tdStyles, textAlign: "center"}}>
                {fmtCurrency(item.unitPrice, currentProfile?.currency || "USD", currentProfile?.locale || "en-US")}
              </td>
              <td style={{...tdStyles, textAlign: "right"}}>
                {fmtCurrency(item.qty * item.unitPrice, currentProfile?.currency || "USD", currentProfile?.locale || "en-US")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="invoice-totals" style={totalsContainerStyles}>
        <div style={{ display: "inline-block", textAlign: "left", minWidth: "200px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", margin: "4px 0" }}>
            <span>Subtotal:</span>
            <span>{fmtCurrency(totals.subtotal, currentProfile?.currency || "USD", currentProfile?.locale || "en-US")}</span>
          </div>
          {totals.discount > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", margin: "4px 0" }}>
              <span>Discount:</span>
              <span>-{fmtCurrency(totals.discount, currentProfile?.currency || "USD", currentProfile?.locale || "en-US")}</span>
            </div>
          )}
          {totals.tax > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", margin: "4px 0" }}>
              <span>Tax:</span>
              <span>{fmtCurrency(totals.tax, currentProfile?.currency || "USD", currentProfile?.locale || "en-US")}</span>
            </div>
          )}
          {totals.retention > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", margin: "4px 0" }}>
              <span>Retention:</span>
              <span>-{fmtCurrency(totals.retention, currentProfile?.currency || "USD", currentProfile?.locale || "en-US")}</span>
            </div>
          )}
          <div className="invoice-total-row" style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            margin: "8px 0 4px 0", 
            paddingTop: "8px",
            borderTop: "2px solid " + colorSettings.brandPrimary,
            fontWeight: "bold",
            fontSize: `${themeSettings.baseFontPx + 2}px`
          }}>
            <span>Total:</span>
            <span>{fmtCurrency(totals.total, currentProfile?.currency || "USD", currentProfile?.locale || "en-US")}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      {(footer.notes || footer.contact || footer.socialsCsv || footer.legal) && (
        <div style={{ marginTop: "24px" }}>
          {/* Color bar */}
          {footer.colorBarOn && footer.colorBarHeightPx && (
            <div className="invoice-color-bar" style={{
              height: `${footer.colorBarHeightPx}px`,
              backgroundColor: colorSettings.brandPrimary,
              marginBottom: "8px",
            }} />
          )}
          
          <div className="invoice-footer" style={{ 
            fontSize: `${themeSettings.baseFontPx - 2}px`, 
            color: colorSettings.muted,
            lineHeight: footer.layout === "corporate" ? "1.5" : "1.3"
          }}>
            {footer.notes && (
              <div style={{ marginBottom: "4px" }}>{footer.notes}</div>
            )}
            {footer.contact && (
              <div style={{ marginBottom: "4px" }}>{footer.contact}</div>
            )}
            {footer.socialsCsv && (
              <div style={{ marginBottom: "4px" }}>{footer.socialsCsv}</div>
            )}
            {footer.layout === "corporate" && footer.legal && (
              <div style={{ marginBottom: "4px", fontStyle: "italic" }}>{footer.legal}</div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
