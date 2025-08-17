declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => void;
    lastAutoTable: {
      finalY: number;
    };
    internal: {
      getNumberOfPages(): number;
      getCurrentPageInfo(): { pageNumber: number };
    };
  }
}