import type { FooterId } from "../types/types";

export default function Footer({ id }: { id: FooterId }) {
  switch(id) {
    case "v1-minimal": return <p>Contact: email | phone | website</p>;
    case "v2-legal": return <p>Terms: Payment due on receipt. Late fee may apply.</p>;
    case "v3-us": return <p>EIN/TIN • ACH/Zelle available • Full business address</p>;
    case "v4-brand": return <p>Follow us: @brand • brand.com • logo centered</p>;
    case "v5-compact": return <p>Thank you for your business.</p>;
  }
}
