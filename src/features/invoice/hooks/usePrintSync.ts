import { useEffect } from 'react';
import { useColorSettings, useThemeSettings, useLogoSettings } from '../store/useInvoice';

const STYLE_ID = 'invoice-print-styles';

export function usePrintSync() {
  const colorSettings = useColorSettings();
  const themeSettings = useThemeSettings();
  const logoSettings = useLogoSettings();

  useEffect(() => {
    let styleElement = document.getElementById(STYLE_ID) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = STYLE_ID;
      document.head.appendChild(styleElement);
    }

    const logoSizePx = logoSettings.logoSize === 'sm' ? '36px' : 
                       logoSettings.logoSize === 'md' ? '64px' : '92px';

    const printCSS = `
      @media print {
        body {
          font-family: ${themeSettings.fontFamily} !important;
          font-size: ${themeSettings.baseFontPx}px !important;
          color: ${colorSettings.text} !important;
          background: ${colorSettings.background} !important;
          line-height: ${themeSettings.density === 'compact' ? '1.2' : 
                         themeSettings.density === 'relaxed' ? '1.6' : '1.4'} !important;
        }
        
        .invoice-preview {
          --brand-primary: ${colorSettings.brandPrimary} !important;
          --brand-secondary: ${colorSettings.brandSecondary} !important;
          --text: ${colorSettings.text} !important;
          --muted: ${colorSettings.muted} !important;
          --bg: ${colorSettings.background} !important;
          --accent: ${colorSettings.accent} !important;
        }
        
        .invoice-logo {
          height: ${logoSizePx} !important;
          justify-content: ${logoSettings.logoAlign === 'right' ? 'flex-end' : 
                           logoSettings.logoAlign === 'center' ? 'center' : 'flex-start'} !important;
        }
        
        .invoice-table th {
          background-color: ${colorSettings.brandPrimary} !important;
          padding: ${themeSettings.density === 'compact' ? '4px 6px' : 
                    themeSettings.density === 'relaxed' ? '10px 12px' : '6px 8px'} !important;
          font-size: ${themeSettings.baseFontPx - 1}px !important;
        }
        
        .invoice-table td {
          padding: ${themeSettings.density === 'compact' ? '3px 6px' : 
                    themeSettings.density === 'relaxed' ? '8px 12px' : '5px 8px'} !important;
          border-bottom: ${themeSettings.separators === 'lines' ? '1px solid #ddd' : 
                         themeSettings.separators === 'underline' ? '1px solid #ccc' : 'none'} !important;
        }
        
        .invoice-totals {
          text-align: ${themeSettings.totalsAlign} !important;
          font-size: ${themeSettings.baseFontPx + 1}px !important;
        }
        
        .invoice-total-row {
          border-top: 2px solid ${colorSettings.brandPrimary} !important;
          font-size: ${themeSettings.baseFontPx + 2}px !important;
        }
        
        .invoice-footer {
          font-size: ${themeSettings.baseFontPx - 2}px !important;
          color: ${colorSettings.muted} !important;
        }
        
        .invoice-color-bar {
          background-color: ${colorSettings.brandPrimary} !important;
        }
      }
    `;

    styleElement.textContent = printCSS;
  }, [colorSettings, themeSettings, logoSettings]);
}