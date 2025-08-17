import jsPDF from "jspdf";
import "jspdf-autotable";
import "./jspdf-types";
import type { Invoice, Profile, InvoiceItem } from "@/features/invoice/types/types";
import { fmtCurrency } from "@/features/invoice/lib/format";

type Totals = {
  subtotal: number;
  tax: number;
  discount: number;
  retention: number;
  total: number;
};

type ExportOptions = {
  profile?: Profile;
  totals?: Totals;
  logoDataUrl?: string;
};

// Helper functions
const safeTxt = (value: any): string => String(value || "");
const safeNum = (value: any): number => Number(value) || 0;

const computeLineTotal = (item: InvoiceItem): number => {
  return safeNum(item.qty) * safeNum(item.unitPrice);
};

const computeTotalsFromInvoice = (invoice: Invoice, profile?: Profile): Totals => {
  const items = invoice.items || [];
  let subtotal = 0;
  let totalTax = 0;
  let totalDiscount = 0;

  // Calculate item-by-item
  items.forEach(item => {
    const lineTotal = computeLineTotal(item);
    const itemDiscount = (safeNum(item.discount) / 100) * lineTotal;
    const discountedAmount = lineTotal - itemDiscount;
    const itemTaxRate = item.taxRate !== undefined ? item.taxRate : (safeNum(invoice.globalTaxRate) || safeNum(profile?.defaultTaxRate) || 0);
    const itemTax = (itemTaxRate / 100) * discountedAmount;

    subtotal += lineTotal;
    totalDiscount += itemDiscount;
    totalTax += itemTax;
  });

  // Apply global discount
  const globalDiscountAmount = (safeNum(invoice.globalDiscount) / 100) * subtotal;
  totalDiscount += globalDiscountAmount;

  // Calculate retention
  let retention = 0;
  const taxableAmount = subtotal - totalDiscount;
  
  if (invoice.retentionPreset === "AGENTE_RETENCION") {
    retention = 0.02 * taxableAmount; // 2%
  }

  const total = Math.max(0, subtotal - totalDiscount + totalTax - retention);

  return {
    subtotal,
    tax: totalTax,
    discount: totalDiscount,
    retention,
    total
  };
};

export async function exportInvoicePdf(invoice: Invoice, opts: ExportOptions = {}) {
  const { profile, totals, logoDataUrl } = opts;
  
  // Create PDF document
  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "portrait"
  });

  // Page dimensions and margins
  const pageWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const marginLeft = 20;
  const marginRight = 20;
  const marginTop = 18;
  const marginBottom = 18;
  const usableWidth = pageWidth - marginLeft - marginRight;

  let yPos = marginTop;

  // Header Section
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  const docTitle = invoice.docType === "INVOICE" ? "INVOICE" : "QUOTE";
  doc.text(docTitle, marginLeft, yPos);
  
  yPos += 8;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Code: ${safeTxt(invoice.code)}`, marginLeft, yPos);

  // Logo (if provided)
  if (logoDataUrl) {
    try {
      const logoX = pageWidth - marginRight - 48;
      const logoY = marginTop - 5;
      doc.addImage(logoDataUrl, "PNG", logoX, logoY, 48, 24);
    } catch (e) {
      console.warn("Failed to add logo to PDF:", e);
    }
  }

  yPos += 15;

  // Vendor and Client blocks (two columns)
  const colWidth = usableWidth / 2 - 10;
  
  // Vendor block (left)
  if (profile) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("From:", marginLeft, yPos);
    yPos += 5;
    
    doc.setFont("helvetica", "normal");
    if (profile.businessName) {
      doc.text(safeTxt(profile.businessName), marginLeft, yPos);
      yPos += 4;
    }
    if (profile.taxId) {
      doc.text(`Tax ID: ${safeTxt(profile.taxId)}`, marginLeft, yPos);
      yPos += 4;
    }
    if (profile.address) {
      doc.text(safeTxt(profile.address), marginLeft, yPos);
      yPos += 4;
    }
    if (profile.email) {
      doc.text(safeTxt(profile.email), marginLeft, yPos);
      yPos += 4;
    }
    if (profile.phone) {
      doc.text(safeTxt(profile.phone), marginLeft, yPos);
      yPos += 4;
    }
    if (profile.website) {
      doc.text(safeTxt(profile.website), marginLeft, yPos);
      yPos += 4;
    }
  }

  // Reset yPos for client block
  let clientYPos = marginTop + 23;
  
  // Client block (right)
  const clientX = marginLeft + colWidth + 20;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", clientX, clientYPos);
  clientYPos += 5;
  
  doc.setFont("helvetica", "normal");
  if (invoice.customerName) {
    doc.text(safeTxt(invoice.customerName), clientX, clientYPos);
    clientYPos += 4;
  }
  if (invoice.customerEmail) {
    doc.text(safeTxt(invoice.customerEmail), clientX, clientYPos);
    clientYPos += 4;
  }
  if (invoice.customerAddress) {
    doc.text(safeTxt(invoice.customerAddress), clientX, clientYPos);
    clientYPos += 4;
  }

  // Issue date
  yPos = Math.max(yPos, clientYPos) + 10;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  const dateLabel = invoice.docType === "INVOICE" ? "Invoice Date:" : "Quote Date:";
  doc.text(dateLabel, marginLeft, yPos);
  doc.setFont("helvetica", "normal");
  
  let formattedDate = safeTxt(invoice.issueDate);
  if (invoice.issueDate && profile?.locale) {
    try {
      formattedDate = new Intl.DateTimeFormat(profile.locale, {
        year: "numeric",
        month: "2-digit", 
        day: "2-digit"
      }).format(new Date(invoice.issueDate));
    } catch (e) {
      // Keep original if formatting fails
    }
  }
  doc.text(formattedDate, marginLeft + 25, yPos);

  yPos += 15;

  // Items table
  const tableData = (invoice.items || []).map((item, index) => [
    String(index + 1),
    `${safeTxt(item.title)}${item.description ? `\n${safeTxt(item.description)}` : ""}`,
    String(safeNum(item.qty)),
    fmtCurrency(safeNum(item.unitPrice), profile?.currency || "USD", profile?.locale || "en-US"),
    fmtCurrency(computeLineTotal(item), profile?.currency || "USD", profile?.locale || "en-US")
  ]);

  (doc as any).autoTable({
    startY: yPos,
    head: [["#", "Description", "Qty", "Unit Price", "Line Total"]],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 10
    },
    bodyStyles: {
      fontSize: 9,
      cellPadding: 3
    },
    columnStyles: {
      0: { cellWidth: 15, halign: "center" },
      1: { cellWidth: 70 },
      2: { cellWidth: 20, halign: "center" },
      3: { cellWidth: 35, halign: "right" },
      4: { cellWidth: 35, halign: "right" }
    },
    margin: { left: marginLeft, right: marginRight },
    didDrawPage: function(data: any) {
      // Add page numbers
      const pageCount = (doc as any).internal.getNumberOfPages();
      const pageNumber = (doc as any).internal.getCurrentPageInfo().pageNumber;
      
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      const pageText = `Page ${pageNumber} of ${pageCount}`;
      const textWidth = doc.getTextWidth(pageText);
      doc.text(pageText, (pageWidth - textWidth) / 2, pageHeight - 10);
      
      // Footer note
      doc.text("Generated with Invoice Maker App", marginLeft, pageHeight - 10);
    }
  });

  // Get final Y position after table
  const finalY = (doc as any).lastAutoTable.finalY || yPos + 50;

  // Totals box (right-aligned)
  const calculatedTotals = totals || computeTotalsFromInvoice(invoice, profile);
  const currency = profile?.currency || "USD";
  const locale = profile?.locale || "en-US";
  
  const totalsX = pageWidth - marginRight - 60;
  let totalsY = finalY + 15;
  
  // Check if we need a new page for totals
  if (totalsY > pageHeight - marginBottom - 40) {
    doc.addPage();
    totalsY = marginTop + 20;
  }

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  // Totals lines
  const totalsLines = [
    ["Subtotal:", fmtCurrency(calculatedTotals.subtotal, currency, locale)],
    ["Discount:", `- ${fmtCurrency(calculatedTotals.discount, currency, locale)}`],
    ["Tax:", fmtCurrency(calculatedTotals.tax, currency, locale)],
    ["Retention:", `- ${fmtCurrency(calculatedTotals.retention, currency, locale)}`]
  ];

  totalsLines.forEach(([label, value]) => {
    doc.text(label, totalsX, totalsY);
    doc.text(value, totalsX + 35, totalsY);
    totalsY += 5;
  });

  // Grand total (emphasized)
  totalsY += 3;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Total:", totalsX, totalsY);
  doc.text(fmtCurrency(calculatedTotals.total, currency, locale), totalsX + 35, totalsY);

  // Draw border around totals
  doc.setDrawColor(200);
  doc.rect(totalsX - 5, finalY + 10, 65, totalsY - finalY);

  // Generate filename and save
  const filename = `${invoice.docType}-${safeTxt(invoice.code) || "DRAFT"}.pdf`;
  doc.save(filename);
}