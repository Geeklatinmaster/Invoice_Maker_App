type DocType = 'INVOICE' | 'QUOTE';
type FooterId = "v1-minimal" | "v2-legal" | "v3-us" | "v4-brand" | "v5-compact";

interface FooterRule {
  id: FooterId;
  label: string;
  availableFor: DocType[];
  description: string;
}

export const FOOTER_RULES: FooterRule[] = [
  {
    id: "v1-minimal",
    label: "Minimal",
    availableFor: ["INVOICE", "QUOTE"],
    description: "Clean and simple footer for all document types"
  },
  {
    id: "v2-legal",
    label: "Legal",
    availableFor: ["INVOICE"],
    description: "Comprehensive legal footer, required for invoices only"
  },
  {
    id: "v3-us",
    label: "US Business",
    availableFor: ["INVOICE"],
    description: "US-specific business footer for invoices"
  },
  {
    id: "v4-brand",
    label: "Brand",
    availableFor: ["INVOICE", "QUOTE"],
    description: "Branded footer suitable for both invoices and quotes"
  },
  {
    id: "v5-compact",
    label: "Compact",
    availableFor: ["QUOTE"],
    description: "Compact footer optimized for quotes"
  }
];

export function getAvailableFooters(docType: DocType): FooterRule[] {
  return FOOTER_RULES.filter(footer => footer.availableFor.includes(docType));
}

export function isFooterAvailable(footerId: FooterId, docType: DocType): boolean {
  const footer = FOOTER_RULES.find(f => f.id === footerId);
  return footer ? footer.availableFor.includes(docType) : false;
}

export function getDefaultFooterForDocType(docType: DocType): FooterId {
  if (docType === 'INVOICE') {
    return 'v2-legal'; // Legal footer for invoices
  } else {
    return 'v1-minimal'; // Minimal footer for quotes
  }
}