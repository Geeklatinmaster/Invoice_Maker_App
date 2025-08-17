# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production (runs TypeScript compiler then Vite build)
- `npm run preview` - Preview production build

### Utility Scripts
- `npm run clean` - Clear cache (node_modules/.cache, .turbo)
- `npm run clean:full` - Full reset (removes node_modules, package-lock.json)
- `npm run restart-vscode` - Kill VS Code and reopen project
- `npm run restart-dev` - Clean cache, restart VS Code, and start dev server

## Architecture

This is a React + TypeScript + Vite invoice/quote generation application with a feature-based architecture.

### Core Structure
- **Single-page app** with a split layout: form controls on the left, live preview on the right
- **State management**: Zustand store (`src/features/invoice/store/useInvoice.ts`) manages all application state
- **Persistence**: LocalStorage-based persistence via `src/features/invoice/lib/storage.ts`
- **Feature organization**: Code is organized under `src/features/invoice/` with components, types, and utilities

### Key Components
- `App.tsx` - Main layout with ProfileSelector, FooterSelector, InvoiceForm, and Preview
- `InvoiceForm.tsx` - Main form for creating invoices/quotes with items, discounts, taxes
- `Preview.tsx` - Live preview of the invoice with basic styling
- `ProfileSelector.tsx` - Business profile selection and management
- `FooterSelector.tsx` - Footer template selection for invoices

### Data Model
- **DocType**: "INVOICE" or "QUOTE"
- **Profile**: Business information (name, address, tax settings, currency, locale)
- **Invoice**: Document with items, customer info, taxes, discounts, retention settings
- **InvoiceItem**: Line items with quantity, unit price, optional tax/discount rates
- **FooterId**: Predefined footer templates (v1-minimal, v2-legal, v3-us, v4-brand, v5-compact)

### State Management Pattern
The app uses a single Zustand store that:
- Manages multiple business profiles and active profile selection
- Maintains current invoice/quote data with items array
- Handles totals calculation with tax, discount, and retention logic
- Provides methods for CRUD operations on items and invoice properties
- Auto-saves to localStorage on state changes

### PDF Export
- Uses `/print.html` static page for PDF generation
- State is passed to print page via localStorage
- Print page renders invoice with proper styling for PDF output

### Key Libraries
- **React 19** with TypeScript
- **Zustand** for state management
- **Zod** for validation schemas
- **date-fns** for date formatting
- **nanoid** for ID generation
- **clsx** for conditional CSS classes

### Development Notes
- Uses Vite for fast development and building
- No linting or testing setup currently configured
- State persists automatically via localStorage
- Print functionality opens new window to `/print.html`