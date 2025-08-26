import { useEffect } from 'react';
import { useCustomizerSettings } from '@/features/invoice/store/useInvoice';

export const usePrintSync = () => {
  const customizer = useCustomizerSettings();

  useEffect(() => {
    const id = 'dynamic-print-styles';
    let styleEl = document.getElementById(id) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = id;
      document.head.appendChild(styleEl);
    }

    const justify =
      customizer.logoPosition === 'left'
        ? 'flex-start'
        : customizer.logoPosition === 'center'
        ? 'center'
        : 'flex-end';

    styleEl.textContent = `
      @media print {
        body {
          font-family: system-ui !important;
          font-size: ${customizer.fontSize.body}px !important;
          color: ${customizer.colors.text} !important;
          background: ${customizer.colors.background} !important;
          line-height: 1.4 !important;
        }
        
        .invoice-preview {
          padding: ${customizer.margins.top}px ${customizer.margins.right}px ${customizer.margins.bottom}px ${customizer.margins.left}px !important;
          color: ${customizer.colors.text} !important;
          background: ${customizer.colors.background} !important;
          border: none !important;
          min-height: auto !important;
        }
        
        .invoice-logo {
          justify-content: ${justify} !important;
          margin-bottom: 12px !important;
        }
        
        .invoice-logo img {
          width: ${customizer.logoSize}% !important;
          height: auto !important;
          max-width: 100% !important;
          object-fit: contain !important;
        }
        
        .invoice-preview h1 {
          font-size: ${customizer.fontSize.title}px !important;
          color: ${customizer.colors.primary} !important;
          margin: 0 0 8px 0 !important;
        }
        
        .invoice-preview p {
          font-size: ${customizer.fontSize.body}px !important;
        }
        
        .invoice-table {
          width: 100% !important;
          border-collapse: collapse !important;
          margin-top: 16px !important;
        }
        
        .invoice-table th {
          background-color: ${customizer.colors.primary} !important;
          color: white !important;
          padding: 6px 8px !important;
          font-size: ${customizer.fontSize.body - 1}px !important;
          font-weight: bold !important;
        }
        
        .invoice-table td {
          padding: 5px 8px !important;
          border-bottom: 1px solid #ddd !important;
          font-size: ${customizer.fontSize.body}px !important;
        }
        
        .invoice-totals {
          margin-top: 16px !important;
          text-align: right !important;
          font-size: ${customizer.fontSize.body + 1}px !important;
        }
        
        .invoice-total-row {
          border-top: 2px solid ${customizer.colors.primary} !important;
          font-size: ${customizer.fontSize.body + 2}px !important;
          font-weight: bold !important;
        }
        
        .invoice-footer {
          font-size: ${customizer.fontSize.small}px !important;
          color: #6b7280 !important;
          margin-top: 24px !important;
        }
        
        .invoice-color-bar {
          background-color: ${customizer.colors.primary} !important;
        }
        
        /* Hide non-printable elements */
        .no-print,
        button,
        input[type="button"],
        input[type="submit"],
        input[type="reset"] {
          display: none !important;
        }
        
        /* Ensure proper page breaks */
        .invoice-preview {
          page-break-inside: avoid !important;
        }
        
        .invoice-table {
          page-break-inside: auto !important;
        }
        
        .invoice-table tr {
          page-break-inside: avoid !important;
          page-break-after: auto !important;
        }
        
        .invoice-totals {
          page-break-inside: avoid !important;
        }
      }
    `;

    // ✅ Mantén el nodo; no lo borres en cada cambio (evita parpadeos y trabajo extra)
    return () => {
      /* opcional: en unmount podrías removerlo, pero NO es necesario para dev */
    };
  }, [customizer]);
};