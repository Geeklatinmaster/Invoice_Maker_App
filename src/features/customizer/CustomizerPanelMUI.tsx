import { useTheme } from "../../theme/useTheme";
import { useInvoice } from "../invoice/store/useInvoice";
import { Box, Paper, Stack, Typography, Slider, Select, MenuItem, TextField,
  Switch, InputLabel, FormControl, Divider, Button, IconButton } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import SocialList from "./SocialList";

export default function CustomizerPanelMUI(){
  const { tokens, setTokens, template, setTemplate } = useTheme();
  const s = useInvoice();

  const docType = s.invoice.docType ?? "INVOICE";
  const setDocType = (v:"INVOICE"|"QUOTE") => s.updateInvoice?.({ docType: v });

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
            onChange={(_,v)=>setTokens({ logoMaxH: Number(v) })}/>
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
          onChange={(c)=>setTokens({accent:c})}/>
        <ColorField label="Text" value={tokens.text}
          onChange={(c)=>setTokens({text:c})}/>
        <ColorField label="Surface" value={tokens.surface}
          onChange={(c)=>setTokens({surface:c})}/>
        <ColorField label="Border" value={tokens.border}
          onChange={(c)=>setTokens({border:c})}/>
      </Section>

      {/* Typography */}
      <Section title="Typography">
        <TextField size="small" label="Font Family (Body)" value={tokens.bodyFont}
          onChange={(e)=>setTokens({bodyFont: e.target.value})} />
        <TextField size="small" label="Font Family (Heading)" value={tokens.headingFont}
          onChange={(e)=>setTokens({headingFont: e.target.value})} />
        <Field label={`Title Weight (${tokens.headingWeight})`}>
          <Slider min={600} max={900} step={50}
            value={tokens.headingWeight}
            onChange={(_,v)=>setTokens({headingWeight:Number(v)})}/>
        </Field>
      </Section>

      {/* Layout */}
      <Section title="Layout">
        <Field label={`Border width (${tokens.borderWidth}px)`}>
          <Slider min={0} max={6} value={tokens.borderWidth}
            onChange={(_,v)=>setTokens({borderWidth:Number(v)})}/>
        </Field>
        <Field label={`Radius (${tokens.radius}px)`}>
          <Slider min={0} max={24} value={tokens.radius}
            onChange={(_,v)=>setTokens({radius:Number(v)})}/>
        </Field>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography>Zebra rows</Typography>
          <Switch checked={tokens.stripe} onChange={(e)=>setTokens({stripe:e.target.checked})}/>
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