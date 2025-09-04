import type { DocType, FooterBlock } from '@/types/invoice';

export function selectVisibleFooter(
  docType: DocType,
  blocks: FooterBlock | FooterBlock[]
): FooterBlock[] {
  const list = Array.isArray(blocks) ? blocks : [blocks];
  const isInvoice = docType === 'invoice';
  const isQuote = docType === 'quote';

  return list.filter(
    (b) =>
      b.enabled &&
      ((isInvoice && b.visibility.showOnInvoice) ||
       (isQuote && b.visibility.showOnQuote))
  );
}