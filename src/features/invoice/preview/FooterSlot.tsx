import FooterBar from "./FooterBar";
import { useInvoice } from "@/features/invoice/store/useInvoice";

export default function FooterSlot(){
  // For the minimal footer visibility implementation, always show the footer
  // The visibility logic is now handled by the footer selector
  return <FooterBar />;
}