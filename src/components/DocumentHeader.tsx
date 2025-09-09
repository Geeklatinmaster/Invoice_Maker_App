import { useActiveBrand } from '@/store/brands';
import { formatDate, getDocTypeLabel, formatDocumentCode } from '@/lib/format';
import { generateDocumentCode } from '@/lib/codegen';

type DocType = 'INVOICE' | 'QUOTE';

interface DocumentHeaderProps {
  docType: DocType;
  documentCode?: string;
  date: Date | string;
  dueDate?: Date | string;
  customerName?: string;
  className?: string;
  onDocumentCodeGenerated?: (code: string) => void;
}

export default function DocumentHeader({
  docType,
  documentCode,
  date,
  dueDate,
  customerName,
  className = '',
  onDocumentCodeGenerated
}: DocumentHeaderProps) {
  const activeBrand = useActiveBrand();
  
  const handleGenerateCode = () => {
    if (!activeBrand) return;
    
    const { code } = generateDocumentCode(activeBrand.prefix);
    onDocumentCodeGenerated?.(code);
  };

  const displayCode = documentCode || (
    activeBrand ? `${activeBrand.prefix}-${new Date().getFullYear()}-000000` : 'XXX-0000-000000'
  );

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {getDocTypeLabel(docType)}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-slate-600 dark:text-slate-400">
              {displayCode}
            </span>
            {!documentCode && activeBrand && (
              <button
                onClick={handleGenerateCode}
                className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300"
              >
                Generate
              </button>
            )}
          </div>
        </div>
        
        {activeBrand?.logo && (
          <img 
            src={activeBrand.logo} 
            alt={activeBrand.name}
            className="h-12 w-auto"
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-slate-600 dark:text-slate-400">Date</div>
          <div className="font-medium">
            {formatDate(date, activeBrand?.locale)}
          </div>
        </div>
        
        {dueDate && (
          <div>
            <div className="text-slate-600 dark:text-slate-400">Due Date</div>
            <div className="font-medium">
              {formatDate(dueDate, activeBrand?.locale)}
            </div>
          </div>
        )}
      </div>

      {customerName && (
        <div className="pt-2 border-t border-white/20">
          <div className="text-slate-600 dark:text-slate-400 text-sm">Bill To</div>
          <div className="font-medium text-slate-900 dark:text-slate-100">
            {customerName}
          </div>
        </div>
      )}
    </div>
  );
}