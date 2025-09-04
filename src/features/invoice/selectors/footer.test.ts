import { describe, it, expect } from 'vitest';
import { selectVisibleFooter } from './footer';
import type { FooterBlock } from '@/types/invoice';

type Mock = FooterBlock & { id: string };

const mk = (id: string, vi: boolean, vq: boolean, enabled = true): Mock => ({
  id,
  enabled,
  visibility: { showOnInvoice: vi, showOnQuote: vq },
});

describe('selectVisibleFooter', () => {
  const blocks: Mock[] = [
    mk('invoice-only', true,  false),
    mk('quote-only',   false, true ),
    mk('both',         true,  true ),
    mk('none',         false, false),
    mk('disabled',     true,  true, false),
  ];

  it('filters for invoice', () => {
    const ids = selectVisibleFooter('invoice', blocks).map(b => (b as Mock).id);
    expect(ids).toEqual(['invoice-only', 'both']);
  });

  it('filters for quote', () => {
    const ids = selectVisibleFooter('quote', blocks).map(b => (b as Mock).id);
    expect(ids).toEqual(['quote-only', 'both']);
  });

  it('handles single block input', () => {
    const single = mk('single', true, false);
    expect(selectVisibleFooter('invoice', single)).toHaveLength(1);
    expect(selectVisibleFooter('quote', single)).toHaveLength(0);
  });

  it('returns empty when none match', () => {
    const none = [mk('none', false, false), mk('disabled', true, true, false)];
    expect(selectVisibleFooter('invoice', none)).toEqual([]);
  });
});