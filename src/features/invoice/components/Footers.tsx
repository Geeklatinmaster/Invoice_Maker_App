import { useInvoice } from "../store/useInvoice";
import type { FooterId } from "../types/types";

function joinDots(parts: Array<string | undefined | null>) {
  return parts
    .map(p => (p ?? "").trim())
    .filter(Boolean)
    .join(" • ");
}

function domainFrom(url?: string) {
  if (!url) return "";
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function Footer({ id }: { id: FooterId }) {
  const s = useInvoice();
  const profile = s.profiles.find(p => p.id === s.selectedProfileId) ?? s.profiles[0];
  const name = profile?.businessName || "";
  const email = profile?.email || "";
  const phone = profile?.phone || "";
  const site = domainFrom(profile?.website);
  const tax = profile?.taxId ? `EIN/TIN: ${profile.taxId}` : "";

  switch (id) {
    // Minimal: contacto básico
    case "v1-minimal":
      return (
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <small>{name}</small>
          <small>{joinDots([email || undefined, phone || undefined, site || undefined])}</small>
        </div>
      );

    // Legal: términos de pago claros
    case "v2-legal":
      return (
        <div style={{ fontSize: 12, lineHeight: 1.35 }}>
          <div><strong>{name}</strong>{tax ? ` — ${tax}` : ""}</div>
          <div>
            {joinDots([email || undefined, phone || undefined, site || undefined])}
          </div>
          <div style={{ marginTop: 4 }}>
            Terms: Payment due upon receipt. Late fee may apply after 7 days.
            By paying you agree to the service terms. No returns after delivery.
          </div>
        </div>
      );

    // US: enfoque negocio + pagos (ACH/Zelle)
    case "v3-us":
      return (
        <div style={{ fontSize: 12, lineHeight: 1.35 }}>
          <div><strong>{name}</strong>{tax ? ` — ${tax}` : ""}</div>
          <div>{joinDots([email || undefined, phone || undefined, site || undefined])}</div>
          <div style={{ marginTop: 4 }}>Payments: ACH / Zelle available. Contact for details.</div>
        </div>
      );

    // Brand: marca centrada, web y “thank you”
    case "v4-brand":
      return (
        <div style={{ textAlign: "center", fontSize: 12, lineHeight: 1.4 }}>
          <div style={{ fontWeight: 600 }}>{name}</div>
          <div>{joinDots([site || undefined, email || undefined])}</div>
          <div style={{ opacity: 0.85, marginTop: 2 }}>Thank you for your business.</div>
        </div>
      );

    // Compact: máximo minimalismo
    case "v5-compact":
      return (
        <div style={{ fontSize: 12 }}>
          {joinDots([name || undefined, site || undefined])}
        </div>
      );
  }
}
