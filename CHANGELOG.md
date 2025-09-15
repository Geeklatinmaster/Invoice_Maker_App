# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

#### Persistence Layer Improvements (Slice A - Safe Closure)
- **Namespaced localStorage keys** for different document types (`invoices`, `quotes`, `profiles`, `settings`)
- **Enhanced storage utilities** with error handling and fallback mechanisms  
- **Price sanitization system** to prevent leading zeros and ensure numeric-only inputs
- **Idempotent ID preservation** for edit/duplicate operations
- **Document management methods** (`createNewDocument`, `duplicateDocument`, `loadDocumentForEdit`)

#### Developer Experience
- **Smoke testing suite** for storage functionality validation
- **Integration test component** (development-only) for manual QA verification
- **Automated test coverage** for price sanitization and ID preservation

### Changed
- **Improved price input handling** - automatically removes leading zeros and invalid characters
- **Enhanced global discount/tax validation** - capped at reasonable limits (discount ≤ 100%)
- **Quantity handling** - enforced minimum of 1, integer values only
- **Store persistence** - migrated from single key to backward-compatible namespaced approach

### Technical Details
- All price fields (`unitPrice`, `qty`, `taxRate`, `discount`) are automatically sanitized on input
- IDs are preserved during edit operations, regenerated during duplication
- Backward compatibility maintained with existing localStorage data
- Error boundaries added for localStorage failures
- Development-only testing components for QA verification

---

## Previous Changes
(Add previous version history here as needed)