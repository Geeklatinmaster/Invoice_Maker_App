📑 Invoice Maker App
Invoice Maker App es una aplicación web ligera para generar y gestionar facturas y cotizaciones, construida con Vite + React + TypeScript + Zustand.
🚀 Características principales:
Crear facturas (INVOICE) y cotizaciones (QUOTE).
Generación automática e idempotente de códigos (INV-YYYYMMDD-XXX, QTE-YYYYMMDD-XXX).
Recomputo automático de totales al cambiar ítems, descuentos, impuestos o retenciones.
Interfaz simple con opción de regenerar códigos y depurar totales.
🛠️ Stack
Frontend: React + TypeScript
State Management: Zustand
Build Tool: Vite
Styling: CSS3 (customizable)
⚡ Quickstart
# 1. Instalar dependencias
npm install

# 2. Correr en modo desarrollo
npm run dev

# 3. Revisar tipado
npm run typecheck

# 4. Build para producción
npm run build
App disponible en: http://localhost:5173
🧪 QA & Dev Notes
Los totales se recalculan automáticamente tras cualquier cambio.
El botón Regenerate es idempotente y seguro.
Incluye PR template con checklist de QA para mantener calidad en contribuciones.
📂 Estructura básica
src/
 ├─ features/
 │   └─ invoice/
 │       ├─ components/   # UI (InvoiceForm, etc.)
 │       └─ store/        # Estado central (useInvoice.ts)
 ├─ App.tsx
 └─ main.tsx
🤝 Contribución
Haz un fork del repo
Crea tu branch (git checkout -b feature/nueva-feature)
Haz commit con convenciones semánticas
Abre un Pull Request 🚀
📜 Licencia
MIT – abierto a la comunidad.
