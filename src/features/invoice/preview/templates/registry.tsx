import type { TemplateComponent } from "./types";

// Import all templates that are fully refactored
import { ModernTeal } from "./ModernTeal";
import RedBadge from "./RedBadge";
import YellowArc from "./YellowArc";
import NavyWave from "./NavyWave";
import RedRibbon from "./RedRibbon";
import OrangeCut from "./OrangeCut";
import { MintBand } from "./MintBand";

export const templateRegistry: Record<string, TemplateComponent> = {
  "modernTeal": ModernTeal,
  "redBadge": RedBadge,
  "yellowArc": YellowArc,
  "navyWave": NavyWave,
  "redRibbon": RedRibbon,
  "orangeCut": OrangeCut,
  "mintBand": MintBand,
};

export const defaultTemplateId = "modernTeal";