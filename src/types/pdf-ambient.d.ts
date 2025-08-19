// src/types/pdf-ambient.d.ts

// Some setups already ship types; this is a safe fallback to avoid hard failures.
declare module "jspdf" {
  export default class jsPDF {
    constructor(options?: any);
    save(filename?: string): void;
    text(txt: string, x: number, y: number, options?: any): void;
    addImage(imgData: string | HTMLImageElement | HTMLCanvasElement, format: string, x: number, y: number, w?: number, h?: number, alias?: string, compression?: string, rotation?: number): void;
    setFontSize(size: number): void;
    setFont(style?: string, variant?: string, weight?: string): void;
    setLineWidth(width: number): void;
    setDrawColor(r: number, g?: number, b?: number): void;
    setFillColor(r: number, g?: number, b?: number): void;
    rect(x: number, y: number, w: number, h: number, style?: string): void;
    addPage(): void;
    getTextWidth(txt: string): number;
    internal: any;
  }
}

declare module "jspdf-autotable" {
  const plugin: any;
  export default plugin;
}

// Global augmentation so `doc.autoTable(...)` type-checks loosely even if plugin merges differently.
declare global {
  interface Window {
    jsPDF: any;
  }
}

// Extend jsPDF instances with autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable?: (options: any) => any;
    lastAutoTable?: {
      finalY: number;
    };
  }
}