import { useState, useEffect } from 'react';
import { normalizePriceInput, fmt } from '../pages/Invoices';

interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  qty: number;
  unitPrice: number;
  taxRate?: number;
  discountRate?: number;
}

type Currency = "USD" | "EUR" | "VES";

interface ItemRowEditorProps {
  item: InvoiceItem;
  currency: Currency;
  onUpdateItem: (itemId: string, patch: Partial<InvoiceItem>) => void;
  onRemoveItem: (itemId: string) => void;
  canDelete: boolean;
}

export default function ItemRowEditor({ 
  item, 
  currency, 
  onUpdateItem, 
  onRemoveItem, 
  canDelete 
}: ItemRowEditorProps) {
  const [priceStr, setPriceStr] = useState(String(item.unitPrice ?? 0));

  useEffect(() => {
    setPriceStr(item.unitPrice ? String(item.unitPrice) : "0");
  }, [item.unitPrice]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const norm = normalizePriceInput(e.target.value);
    setPriceStr(norm);
    onUpdateItem(item.id, { unitPrice: norm === "" ? 0 : Number(norm) });
  };

  const handlePriceBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const norm = normalizePriceInput(e.target.value);
    const final = norm === "" ? "0" : norm;
    setPriceStr(final);
    onUpdateItem(item.id, { unitPrice: Number(final) });
  };

  return (
    <div className="grid grid-cols-12 gap-1 items-start">
      {/* Item name + description */}
      <div className="col-span-5 space-y-1">
        <input 
          className="w-full rounded-md border border-white/20 bg-white/40 px-2 py-1 text-xs dark:bg-white/5" 
          value={item.name ?? ""} 
          placeholder="Item name"
          onChange={(e) => onUpdateItem(item.id, { name: e.target.value })}
          onFocus={(e) => e.currentTarget.select()}
        />
        <textarea 
          className="w-full rounded-md border border-white/20 bg-white/40 px-2 py-1 text-xs dark:bg-white/5 resize-none" 
          value={item.description ?? ""} 
          placeholder="Description (optional)"
          rows={2}
          onChange={(e) => onUpdateItem(item.id, { description: e.target.value })}
        />
      </div>
      
      {/* Quantity */}
      <input 
        type="number" 
        min={0} 
        className="col-span-1 rounded-md border border-white/20 bg-white/40 px-1 py-1 text-xs dark:bg-white/5" 
        value={item.qty} 
        onChange={(e) => onUpdateItem(item.id, { qty: Number(e.target.value) })} 
      />
      
      {/* Price */}
      <input 
        inputMode="decimal"
        className="col-span-2 rounded-md border border-white/20 bg-white/40 px-1 py-1 text-xs dark:bg-white/5" 
        value={priceStr}
        placeholder="0"
        onChange={handlePriceChange}
        onBlur={handlePriceBlur}
      />
      
      {/* Tax % */}
      <input 
        type="number" 
        min={0} 
        max={100}
        className="col-span-1 rounded-md border border-white/20 bg-white/40 px-1 py-1 text-xs dark:bg-white/5" 
        placeholder="0" 
        value={item.taxRate ?? 0} 
        onChange={(e) => onUpdateItem(item.id, { taxRate: Number(e.target.value) })} 
      />
      
      {/* Discount % */}
      <input 
        type="number" 
        min={0} 
        max={100}
        className="col-span-1 rounded-md border border-white/20 bg-white/40 px-1 py-1 text-xs dark:bg-white/5" 
        placeholder="0" 
        value={item.discountRate ?? 0} 
        onChange={(e) => onUpdateItem(item.id, { discountRate: Number(e.target.value) })} 
      />
      
      {/* Total */}
      <div className="col-span-1 text-right text-xs font-mono">
        {fmt(item.qty * item.unitPrice, currency)}
      </div>
      
      {/* Remove button */}
      <button 
        className="col-span-1 text-center text-rose-500 hover:text-rose-700 disabled:opacity-40" 
        onClick={() => onRemoveItem(item.id)}
        disabled={!canDelete}
      >
        ×
      </button>
    </div>
  );
}