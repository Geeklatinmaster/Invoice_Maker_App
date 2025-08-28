export type IconSpec =
  | { type: "library"; pack: "lucide"; name: string; size?: number }
  | { type: "custom"; svg: string; size?: number };

export type ThemeTokens = {
  accent: string; accent2: string;
  text: string; textMuted: string;
  bg: string; surface: string; border: string;
  headingFont: string; bodyFont: string;
  headingWeight: number; bodyWeight: number;
  radius: number; borderWidth: number;
  stripe: boolean; stripeOpacity: number;
  logoMaxH: number; tableRowH: number; spacing: number;
  bodySize: number; titleSize: number; smallSize: number;
  marginTop: number; marginRight: number; marginBottom: number; marginLeft: number;
  rowHeight: number; cellPadding: number;
  headerGradient: boolean;
  headerGradStart: string; headerGradEnd: string;
  brandIcon?: string; customIconSvg?: string;
};

export type TemplateId =
  | "modernTeal" | "mintBand" | "navyWave"
  | "redBadge" | "redRibbon" | "orangeCut" | "yellowArc";

export type ThemeState = {
  template: TemplateId;
  tokens: ThemeTokens;
  icons: {
    phone: IconSpec; email: IconSpec; location: IconSpec;
    instagram?: IconSpec; whatsapp?: IconSpec; website?: IconSpec;
  };
};