import { useTheme } from "../../theme/useTheme";
import { useInvoice } from "@/features/invoice/store/useInvoice";
import { Box, Paper, Stack, Typography, Slider, Select, MenuItem, TextField,
  Switch, InputLabel, FormControl, Divider, Button, IconButton } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import SocialList from "./SocialList";

export default function CustomizerPanelMUI(){
  const { tokens, setTokens, template, setTemplate } = useTheme();
  const s = useInvoice();

  const docType = s.invoice.docType ?? "INVOICE";
  const setDocType = (v:"INVOICE"|"QUOTE") => s.updateInvoice?.({ docType: v });

  // Optimized handlers to prevent unnecessary updates
  const handleLogoMaxH = (_: any, v: number | number[]) => {
    const size = Number(v);
    if (size !== tokens.logoMaxH) {
      setTokens({ logoMaxH: size });
    }
  };

  const handleBorderWidth = (_: any, v: number | number[]) => {
    const width = Number(v);
    if (width !== tokens.borderWidth) {
      setTokens({ borderWidth: width });
    }
  };

  const handleRadius = (_: any, v: number | number[]) => {
    const radius = Number(v);
    if (radius !== tokens.radius) {
      setTokens({ radius: radius });
    }
  };

  const handleHeadingWeight = (_: any, v: number | number[]) => {
    const weight = Number(v);
    if (weight !== tokens.headingWeight) {
      setTokens({ headingWeight: weight });
    }
  };

  const handleColorChange = (key: keyof typeof tokens) => (color: string) => {
    if (color !== tokens[key]) {
      setTokens({ [key]: color });
    }
  };

  const handleFontChange = (key: 'bodyFont' | 'headingFont') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const font = e.target.value;
    if (font !== tokens[key]) {
      setTokens({ [key]: font });
    }
  };

  const handleStripeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const stripe = e.target.checked;
    if (stripe !== tokens.stripe) {
      setTokens({ stripe: stripe });
    }
  };

  return (
    <Paper variant="outlined" sx={{ p:2, borderRadius:3, maxWidth: 420, width:'100%' }}>
      <Typography variant="h6">🎨 Live Customizer (Instant Updates)</Typography>
      <Divider sx={{ my:1.5 }}/>

      {/* Logo */}
      <Section title="Logo">
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField size="small" fullWidth placeholder="https://example.com/logo.png"
            value={s.invoice?.brand?.logoUrl ?? ""}
            onChange={(e)=> s.updateInvoice?.({ brand:{ ...(s.invoice.brand||{}), logoUrl:e.target.value } })}/>
          <IconButton component="label"><UploadIcon/>
            <input hidden type="file" accept="image/*"
              onChange={async e=>{
                const f = e.target.files?.[0]; if(!f) return;
                const url = URL.createObjectURL(f);
                s.updateInvoice?.({ brand:{ ...(s.invoice.brand||{}), logoUrl: url }});
              }}/>
          </IconButton>
        </Stack>
        <Field label={`Size (${tokens.logoMaxH}px)`}>
          <Slider min={24} max={120} value={tokens.logoMaxH}
            onChange={handleLogoMaxH}/>
        </Field>
      </Section>

      {/* Doc Type */}
      <Section title="Document Type">
        <FormControl fullWidth size="small">
          <InputLabel id="doctype">Type</InputLabel>
          <Select labelId="doctype" label="Type" value={docType}
            onChange={(e)=>setDocType(e.target.value as any)}>
            <MenuItem value="INVOICE">Invoice</MenuItem>
            <MenuItem value="QUOTE">Quote</MenuItem>
          </Select>
        </FormControl>
      </Section>

      {/* Colors */}
      <Section title="Colors">
        <ColorField label="Primary (Accent)" value={tokens.accent}
          onChange={handleColorChange('accent')}/>
        <ColorField label="Text" value={tokens.text}
          onChange={handleColorChange('text')}/>
        <ColorField label="Surface" value={tokens.surface}
          onChange={handleColorChange('surface')}/>
        <ColorField label="Border" value={tokens.border}
          onChange={handleColorChange('border')}/>
      </Section>

      {/* Typography */}
      <Section title="Typography">
        <TextField size="small" label="Font Family (Body)" value={tokens.bodyFont}
          onChange={handleFontChange('bodyFont')} />
        <TextField size="small" label="Font Family (Heading)" value={tokens.headingFont}
          onChange={handleFontChange('headingFont')} />
        <Field label={`Title Weight (${tokens.headingWeight})`}>
          <Slider min={600} max={900} step={50}
            value={tokens.headingWeight}
            onChange={handleHeadingWeight}/>
        </Field>
      </Section>

      {/* Layout */}
      <Section title="Layout">
        <Field label={`Border width (${tokens.borderWidth}px)`}>
          <Slider min={0} max={6} value={tokens.borderWidth}
            onChange={handleBorderWidth}/>
        </Field>
        <Field label={`Radius (${tokens.radius}px)`}>
          <Slider min={0} max={24} value={tokens.radius}
            onChange={handleRadius}/>
        </Field>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography>Zebra rows</Typography>
          <Switch checked={tokens.stripe} onChange={handleStripeChange}/>
        </Stack>
      </Section>

      {/* Template (95%) */}
      <Section title="Template">
        <FormControl fullWidth size="small">
          <Select value={template} onChange={(e)=>setTemplate(e.target.value as any)}>
            <MenuItem value="modernTeal">Teal Invoice (ref #1)</MenuItem>
            <MenuItem value="mintBand">Mint Band 95%</MenuItem>
            <MenuItem value="navyWave">Navy Wave 95%</MenuItem>
            <MenuItem value="redBadge">Red Badge 95%</MenuItem>
            <MenuItem value="redRibbon">Red Ribbon 95%</MenuItem>
            <MenuItem value="orangeCut">Orange Cut 95%</MenuItem>
            <MenuItem value="yellowArc">Yellow Arc 95%</MenuItem>
          </Select>
        </FormControl>
      </Section>

      {/* Typography Extended */}
      <Section title="Typography Extended">
        <Field label={`Body Size (${tokens.bodySize}px)`}>
          <Slider min={10} max={18} value={tokens.bodySize} onChange={(_,v)=>setTokens({bodySize:Number(v)})}/>
        </Field>
        <Field label={`Title Size (${tokens.titleSize}px)`}>
          <Slider min={18} max={36} value={tokens.titleSize} onChange={(_,v)=>setTokens({titleSize:Number(v)})}/>
        </Field>
        <Field label={`Small Size (${tokens.smallSize}px)`}>
          <Slider min={10} max={16} value={tokens.smallSize} onChange={(_,v)=>setTokens({smallSize:Number(v)})}/>
        </Field>
      </Section>

      {/* Margins */}
      <Section title="Margins">
        <Field label={`Top (${tokens.marginTop}px)`}>
          <Slider min={0} max={60} value={tokens.marginTop} onChange={(_,v)=>setTokens({marginTop:Number(v)})}/>
        </Field>
        <Field label={`Right (${tokens.marginRight}px)`}>
          <Slider min={0} max={60} value={tokens.marginRight} onChange={(_,v)=>setTokens({marginRight:Number(v)})}/>
        </Field>
        <Field label={`Bottom (${tokens.marginBottom}px)`}>
          <Slider min={0} max={60} value={tokens.marginBottom} onChange={(_,v)=>setTokens({marginBottom:Number(v)})}/>
        </Field>
        <Field label={`Left (${tokens.marginLeft}px)`}>
          <Slider min={0} max={60} value={tokens.marginLeft} onChange={(_,v)=>setTokens({marginLeft:Number(v)})}/>
        </Field>
      </Section>

      {/* Table */}
      <Section title="Table">
        <Field label={`Row Height (${tokens.rowHeight}px)`}>
          <Slider min={36} max={64} value={tokens.rowHeight} onChange={(_,v)=>setTokens({rowHeight:Number(v)})}/>
        </Field>
        <Field label={`Cell Padding (${tokens.cellPadding}px)`}>
          <Slider min={6} max={18} value={tokens.cellPadding} onChange={(_,v)=>setTokens({cellPadding:Number(v)})}/>
        </Field>
      </Section>

      {/* Header */}
      <Section title="Header">
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography>Gradient</Typography>
          <Switch checked={tokens.headerGradient} onChange={e=>setTokens({headerGradient:e.target.checked})}/>
        </Stack>
        <ColorField label="Gradient A" value={tokens.headerGradStart} onChange={(v)=>setTokens({headerGradStart:v})}/>
        <ColorField label="Gradient B" value={tokens.headerGradEnd} onChange={(v)=>setTokens({headerGradEnd:v})}/>
      </Section>

      {/* Footer */}
      <Section title="Footer">
        <FormControl fullWidth size="small">
          <InputLabel id="footer-mode">Mode</InputLabel>
          <Select labelId="footer-mode" label="Mode"
            value={s.invoice.footer?.mode || 'social'}
            onChange={(e)=>s.updateInvoice?.({ footer:{ ...(s.invoice.footer||{}), mode:e.target.value as any }})}>
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="minimal">Minimal</MenuItem>
            <MenuItem value="brand">Brand</MenuItem>
            <MenuItem value="social">Social</MenuItem>
          </Select>
        </FormControl>
      </Section>

      {/* Social Media + Icons */}
      <Section title="Social Media & Contact">
        <SocialList />
      </Section>
    </Paper>
  );
}

/* helpers */
function Section({title, children}:{title:string;children:any}){
  return (
    <Box sx={{ mb:2.5 }}>
      <Typography variant="subtitle1" sx={{ fontWeight:700, mb:.75 }}>{title}</Typography>
      <Stack spacing={1.25}>{children}</Stack>
    </Box>
  );
}
function Field({label, children}:{label:string;children:any}){
  return <Stack><Typography variant="caption">{label}</Typography>{children}</Stack>;
}
function ColorField({label, value, onChange}:{label:string; value:string; onChange:(v:string)=>void}){
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography sx={{minWidth:140}}>{label}</Typography>
      <input type="color" value={value} onChange={e=>onChange(e.target.value)} />
      <TextField size="small" value={value} onChange={(e)=>onChange(e.target.value)} sx={{width:140}}/>
    </Stack>
  );
}