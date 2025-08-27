import { useMemo } from 'react';
import { useInvoice, useCustomizerSettings } from "@/features/invoice/store/useInvoice";
import { usePrintSync } from "@/features/invoice/hooks/usePrintSync";
import { fmtCurrency } from "../lib/format";
import type { Profile } from "@/features/invoice/types/types";

const LOGO_PX: Record<"sm" | "md" | "lg", number> = { sm: 36, md: 64, lg: 92 };

export default function Preview() {
  const s = useInvoice();
  const customizer = useCustomizerSettings();
  usePrintSync(); // sincroniza estilos @media print

  const iv = s.invoice;
  const totals = s.totals;
  const profiles = s.profiles;
  const selectedProfileId = s.selectedProfileId;

  const currentProfile = useMemo(
    () => profiles.find((p: Profile) => p.id === selectedProfileId) ?? profiles[0],
    [profiles, selectedProfileId]
  );

  const footer = currentProfile?.footer || {};

  const dynamicStyles = useMemo(() => {
    const justify =
      customizer.logoPosition === 'left'
        ? 'flex-start'
        : customizer.logoPosition === 'center'
        ? 'center'
        : 'flex-end';

    return {
      container: {
        padding: `${customizer.margins.top}px ${customizer.margins.right}px ${customizer.margins.bottom}px ${customizer.margins.left}px`,
        backgroundColor: customizer.colors.background,
        color: customizer.colors.text,
        fontFamily: customizer.fontFamily,
        border: "1px solid #ddd",
        minHeight: "400px",
      },
      logoWrapper: {
        display: 'flex',
        justifyContent: justify,
        marginBottom: 12,
      },
      logo: {
        maxWidth: '100%',
        width: `${customizer.logoSize}%`,
        height: 'auto',
        objectFit: 'contain' as const,
      },
      title: {
        fontSize: `${customizer.fontSize.title}px`,
        color: customizer.colors.primary,
        margin: "0 0 8px 0",
      },
      documentInfo: {
        fontSize: `${customizer.fontSize.body}px`,
        margin: "4px 0",
        fontWeight: "600",
      },
      customerInfo: {
        fontSize: `${customizer.fontSize.body}px`,
        margin: "4px 0 16px 0",
      },
    } as const;
  }, [customizer]);

  // Legacy theme selectors for backward compatibility
  const colorSettings = {
    brandPrimary: currentProfile?.theme?.brandPrimary || customizer.colors.primary,
    brandSecondary: currentProfile?.theme?.brandSecondary || '#64748b',
    text: currentProfile?.theme?.text || customizer.colors.text,
    muted: currentProfile?.theme?.muted || '#6b7280',
    background: currentProfile?.theme?.background || customizer.colors.background,
    accent: currentProfile?.theme?.accent || '#f59e0b',
  };

  const themeSettings = {
    fontFamily: currentProfile?.theme?.fontFamily || 'system-ui',
    fontWeight: currentProfile?.theme?.fontWeight || 'Normal' as const,
    baseFontPx: currentProfile?.theme?.baseFontPx || customizer.fontSize.body,
    density: currentProfile?.theme?.density || 'normal' as const,
    separators: currentProfile?.theme?.separators || 'lines' as const,
    totalsAlign: currentProfile?.theme?.totalsAlign || 'right' as const,
  };

  // Legacy logo configuration
  const logoUrl = currentProfile?.logo?.logoDataUrl || currentProfile?.logo?.logoUrl || "";
  const logoSizePx = LOGO_PX[currentProfile?.theme?.logoSize || 'md'];
  const logoStyle: React.CSSProperties = useMemo(() => ({ 
    height: logoSizePx, 
    width: "auto", 
    objectFit: "contain" 
  }), [logoSizePx]);

  const logoAlignmentStyle = useMemo(() => {
    const align = currentProfile?.theme?.logoAlign || 'left';
    return align === "right" ? { justifyContent: "flex-end" } :
           align === "center" ? { justifyContent: "center" } :
           { justifyContent: "flex-start" };
  }, [currentProfile?.theme?.logoAlign]);

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
    textAlign: customizer.table.totalsAlign,
    fontSize: `${themeSettings.baseFontPx + 1}px`,
  }), [customizer.table.totalsAlign, themeSettings.baseFontPx]);

  // Render footer según layout
  function FooterContent() {
    const invoiceFooter = s.invoice?.footer;
    if (!invoiceFooter) return null;

    switch (invoiceFooter.layout) {
      case 'Simple':
        return (
          <div>
            {invoiceFooter.notes && <p>{invoiceFooter.notes}</p>}
            {invoiceFooter.legal && <small>{invoiceFooter.legal}</small>}
          </div>
        );
      case 'Minimal':
        return (
          <div>
            {invoiceFooter.contactInfo && <p>{invoiceFooter.contactInfo}</p>}
            {invoiceFooter.social && <p>{invoiceFooter.social}</p>}
          </div>
        );
      default: // Corporate
        return (
          <div style={{ display: 'grid', gap: 6 }}>
            {invoiceFooter.notes && <p>{invoiceFooter.notes}</p>}
            {invoiceFooter.contactInfo && <p>{invoiceFooter.contactInfo}</p>}
            {invoiceFooter.social && <p>{invoiceFooter.social}</p>}
            {invoiceFooter.legal && <small>{invoiceFooter.legal}</small>}
          </div>
        );
    }
  }

  return (
    <section className="invoice-preview" style={dynamicStyles.container}>
      {/* NEW CUSTOMIZER LOGO (priority over legacy) */}
      <div className="invoice-logo" style={dynamicStyles.logoWrapper}>
        {logoUrl ? <img src={logoUrl} alt="logo" style={dynamicStyles.logo} /> : null}
      </div>

      {/* LEGACY LOGO (fallback if no URL in new system) */}
      {!logoUrl && (
        <div className="invoice-logo-legacy" style={{ display: "flex", ...logoAlignmentStyle, marginBottom: "12px" }}>
          {currentProfile?.logo?.logoUrl && <img src={currentProfile.logo.logoUrl} alt="logo" style={logoStyle} />}
        </div>
      )}

      {/* Header */}
      <header style={{ display: 'grid', gap: 8, marginBottom: 8 }}>
        <h1 style={dynamicStyles.title}>{currentProfile?.businessName || "Business Name"}</h1>
        <p style={dynamicStyles.documentInfo}>
          {iv.docType} • {iv.code}
        </p>
        <p style={dynamicStyles.customerInfo}>
          Customer: {iv.customerName || "(no customer name)"}
        </p>
      </header>
      
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
          {iv.items.map((item: any, idx: number) => (
            <tr 
              key={item.id}
              style={{
                backgroundColor: customizer.table.stripes && idx % 2 === 1 ? "#f8f9fa" : "transparent"
              }}
            >
              <td style={{...tdStyles, textAlign: "left"}}>
                <div style={{ fontWeight: "500" }}>{item.title}</div>
                {item.description && (
                  <div style={{ fontSize: `${customizer.fontSize.small}px`, color: colorSettings.muted, marginTop: "2px" }}>
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
      <footer style={{
        marginTop: 16,
        borderTop: '1px solid #e5e7eb',
        paddingTop: 12,
      }}>
        <FooterContent />
        <div style={{
          height: `${s.invoice?.footer?.colorBarHeight ?? 0}px`,
          background: customizer.colors.primary,
          display: (s.invoice?.footer?.colorBarOn && (s.invoice?.footer?.colorBarHeight ?? 0) > 0) ? 'block' : 'none',
          marginTop: 8,
        }} />
      </footer>
    </section>
  );
}