export default function PrintButton() {
  // Ocultar el botón si estamos en la página de impresión
  if (
    typeof window !== "undefined" &&
    /\/print\.html(?:$|\?)/.test(window.location.pathname + window.location.search)
  ) {
    return null;
  }

  const openPrint = () => {
    // Abrimos /print.html con auto=1 para que se dispare window.print()
    const url = `/print.html?auto=1&v=${Date.now()}`;

    // Intentar nueva pestaña (si el navegador bloquea el popup, fallback en la misma)
    const w = window.open(url, "_blank", "noopener");
    if (!w) window.location.href = url;
  };

  return (
    <button type="button" onClick={openPrint}>
      Imprimir / PDF
    </button>
  );
}
