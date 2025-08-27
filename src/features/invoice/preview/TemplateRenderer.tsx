import { useTheme } from "../../../theme/useTheme";
import { ModernTeal } from "./templates/ModernTeal";
import MintBand from "./templates/MintBand";
import NavyWave from "./templates/NavyWave";
import RedBadge from "./templates/RedBadge";
import RedRibbon from "./templates/RedRibbon";
import OrangeCut from "./templates/OrangeCut";
import YellowArc from "./templates/YellowArc";

export default function TemplateRenderer(){
  const template = useTheme(s => s.template);
  
  switch (template){
    case "modernTeal": return <ModernTeal/>;
    case "mintBand": return <MintBand/>;
    case "navyWave": return <NavyWave/>;
    case "redBadge": return <RedBadge/>;
    case "redRibbon": return <RedRibbon/>;
    case "orangeCut": return <OrangeCut/>;
    case "yellowArc": return <YellowArc/>;
    default: return <ModernTeal/>;
  }
}