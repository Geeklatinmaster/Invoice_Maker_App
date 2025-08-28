import { useTheme } from "../../../theme/useTheme";
import { ModernTeal } from "./templates/ModernTeal";
import MintBand from "./templates/MintBand";
import NavyWave from "./templates/NavyWave";
import RedBadge from "./templates/RedBadge";
import RedRibbon from "./templates/RedRibbon";
import OrangeCut from "./templates/OrangeCut";
import YellowArc from "./templates/YellowArc";

export default function TemplateRenderer(){
  const tpl = useTheme(s=>s.template); // 👈 reactivo
  switch (tpl){
    case "modernTeal": return <ModernTeal/>;
    case "navyWave":  return <NavyWave/>;
    case "redBadge":  return <RedBadge/>;
    case "redRibbon": return <RedRibbon/>;
    case "orangeCut": return <OrangeCut/>;
    case "yellowArc": return <YellowArc/>;
    case "mintBand":  return <MintBand/>;
    default: return <ModernTeal/>;
  }
}