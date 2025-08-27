import Phone from '@mui/icons-material/Phone';
import Email from '@mui/icons-material/Email';
import Instagram from '@mui/icons-material/Instagram';
import WhatsApp from '@mui/icons-material/WhatsApp';
import Language from '@mui/icons-material/Language';
import LocationOn from '@mui/icons-material/LocationOn';
import HelpOutline from '@mui/icons-material/HelpOutline';

export const ICON_OPTIONS = [
  'Phone','Email','Instagram','WhatsApp','Language','LocationOn'
] as const;
export type IconName = typeof ICON_OPTIONS[number];

const MAP: Record<IconName | 'Help', React.ElementType> = {
  Phone, Email, Instagram, WhatsApp, Language, LocationOn, Help: HelpOutline
};

export function MuiIcon({name, size=16}:{name:IconName|string; size?:number}) {
  const C = (MAP as any)[name] ?? MAP.Help;
  return <C sx={{ fontSize: size }} />;
}