import type { ChangeEvent } from "react";
import { useInvoice } from "../store/useInvoice";

/* -------------------------------------------------
   Helpers para leer y escalar imágenes (DataURL)
------------------------------------------------- */

// Lee un archivo local como DataURL (base64)
async function fileToDataURL(file: File): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = (e) => reject(e);
    r.readAsDataURL(file);
  });
}

/**
 * Reescala manteniendo proporción para limitar tamaño (máx 800px lado mayor).
 * @param dataUrl  DataURL de entrada (image/*)
 * @param maxSide  Lado máximo (default 800)
 * @param mimeHint Sugerencia de mime de salida (p.ej. "image/png" | "image/jpeg")
 */
async function downscaleDataURL(
  dataUrl: string,
  maxSide = 800,
  mimeHint: string
): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const { width, height } = img;

      // escala <= 1 (nunca agrandar)
      const scale = Math.min(maxSide / Math.max(width, height), 1);
      const w = Math.round(width * scale);
      const h = Math.round(height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("No 2D context"));
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, w, h);

      const mime =
        mimeHint && mimeHint.startsWith("image/") ? mimeHint : "image/png";
      const quality = mime === "image/jpeg" ? 0.9 : undefined;

      resolve(canvas.toDataURL(mime, quality as number | undefined));
    };
    img.onerror = (e) => reject(e);
    img.src = dataUrl;
  });
}

/* -------------------------------------------------
   Tipos derivados del store (para evitar any/undefined)
------------------------------------------------- */

type StoreState = ReturnType<typeof useInvoice.getState>;
type Profile = StoreState["profiles"][number];

/* -------------------------------------------------
   UI
------------------------------------------------- */

export default function ProfileSelector() {
  const s = useInvoice();
  const sel: Profile | undefined =
    s.profiles.find((p) => p.id === s.selectedProfileId) ?? s.profiles[0];

  const setSelected = (id: string) => {
    useInvoice.setState({ selectedProfileId: id });
  };

  const updateSelectedProfile = (patch: Partial<Profile>) => {
    if (!sel) return;
    const profiles = s.profiles.map((p) =>
      p.id === sel.id ? { ...p, ...patch } : p
    );
    useInvoice.setState({ profiles });
  };

  const onPickLogo = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      // 1) a DataURL
      const dataUrl = await fileToDataURL(file);
      // 2) opcional: reescalar
      const scaled = await downscaleDataURL(dataUrl, 800, file.type);
      // 3) guardar en el perfil seleccionado
      updateSelectedProfile({ logoUrl: scaled });
    } finally {
      e.target.value = ""; // reset input
    }
  };

  return (
    <section style={{ display: "grid", gap: 8 }}>
      <label>
        Perfil:&nbsp;
        <select
          value={s.selectedProfileId}
          onChange={(e) => setSelected(e.target.value)}
        >
          {s.profiles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>

      {sel && (
        <div style={{ display: "grid", gap: 8 }}>
          {/* Business name */}
          <input
            placeholder="Business Name"
            value={sel.businessName ?? ""}
            onChange={(e) =>
              updateSelectedProfile({ businessName: e.target.value })
            }
          />

          {/* URL directa opcional */}
          <input
            placeholder="Logo URL (https...)"
            value={sel.logoUrl ?? ""}
            onChange={(e) => updateSelectedProfile({ logoUrl: e.target.value })}
          />

          {/* Subir desde PC */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ fontSize: 14 }}>
              Subir logo (PNG/JPG):&nbsp;
              <input type="file" accept="image/*" onChange={onPickLogo} />
            </label>

            {sel.logoUrl && (
              <button
                type="button"
                onClick={() => updateSelectedProfile({ logoUrl: "" })}
              >
                Quitar logo
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
