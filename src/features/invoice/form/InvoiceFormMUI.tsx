import { Stack, TextField, Typography, Paper, Divider, FormControlLabel, Switch, MenuItem } from "@mui/material";
import { useInvoice } from "@/features/invoice/store/useInvoice";

export default function InvoiceFormMUI(){
  const s = useInvoice();
  const iv = s.invoice;

  return (
    <Stack spacing={2}>
      <Paper variant="outlined" sx={{ p:2, borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight={700}>Profile</Typography>
        <Divider sx={{ my:1 }}/>
        <Stack spacing={1.25}>
          <TextField size="small" label="Business / Brand" value={iv.brand?.name || ''}
            onChange={e=>s.updateBrandField('name', e.target.value)}/>
          <TextField size="small" label="EIN/TIN" value={iv.brand?.ein || ''}
            onChange={e=>s.updateBrandField('ein', e.target.value)}/>
          <TextField size="small" label="Email" value={iv.brand?.email || ''}
            onChange={e=>s.updateBrandField('email', e.target.value)}/>
          <TextField size="small" label="Phone" value={iv.brand?.phone || ''}
            onChange={e=>s.updateBrandField('phone', e.target.value)}/>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p:2, borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight={700}>Client</Typography>
        <Divider sx={{ my:1 }}/>
        <Stack spacing={1.25}>
          <TextField size="small" label="Client Name" value={iv.client?.name || ''}
            onChange={e=>s.updateClientField('name', e.target.value)}/>
          <TextField size="small" label="Email" value={iv.client?.email || ''}
            onChange={e=>s.updateClientField('email', e.target.value)}/>
          <TextField size="small" label="Address" value={iv.client?.address || ''}
            onChange={e=>s.updateClientField('address', e.target.value)}/>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p:2, borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight={700}>Footer</Typography>
        <Divider sx={{ my:1 }}/>
        <Stack spacing={1.25}>
          <TextField select size="small" label="Footer Style" value={iv.footer?.mode || 'social'}
            onChange={e=>s.updateFooterField('mode', e.target.value)}>
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="minimal">Minimal</MenuItem>
            <MenuItem value="brand">Brand</MenuItem>
            <MenuItem value="social">Social</MenuItem>
          </TextField>
          <FormControlLabel
            control={
              <Switch checked={!!iv.footer?.showTerms}
                onChange={e=>s.updateFooterField('showTerms', e.target.checked)}/>
            }
            label="Show Terms & Conditions"
          />
          <TextField size="small" label="Terms" multiline minRows={3}
            value={iv.terms || ''} onChange={e=>s.setTerms(e.target.value)}/>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p:2, borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight={700}>Format & Currency</Typography>
        <Divider sx={{ my:1 }}/>
        <Stack spacing={1.25}>
          <TextField select size="small" label="Locale" value={iv.settings?.locale || 'en-US'}
            onChange={e=>s.updateSettingsField('locale', e.target.value)}>
            <MenuItem value="en-US">English (US)</MenuItem>
            <MenuItem value="es-ES">Español (España)</MenuItem>
            <MenuItem value="es-VE">Español (Venezuela)</MenuItem>
            <MenuItem value="es-MX">Español (México)</MenuItem>
          </TextField>

          <TextField select size="small" label="Currency" value={iv.settings?.currency || 'USD'}
            onChange={e=>s.updateSettingsField('currency', e.target.value)}>
            <MenuItem value="USD">USD — US Dollar</MenuItem>
            <MenuItem value="EUR">EUR — Euro</MenuItem>
            <MenuItem value="VES">VES — Bolívar</MenuItem>
            <MenuItem value="COP">COP — Peso Colombiano</MenuItem>
            <MenuItem value="MXN">MXN — Peso Mexicano</MenuItem>
          </TextField>

          <TextField type="number" size="small" label="Decimals" inputProps={{ min:0, max:4 }}
            value={iv.settings?.decimals ?? 2}
            onChange={e=>s.updateSettingsField('decimals', Math.max(0, Math.min(4, Number(e.target.value)||0)))}/>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p:2, borderRadius:2 }}>
        <Typography variant="subtitle1" fontWeight={700}>Header</Typography>
        <Divider sx={{ my:1 }}/>
        <Stack spacing={1.25}>
          <TextField size="small" label="Tagline" value={iv.brand?.tagline || ''} onChange={e=>s.updateBrandField('tagline', e.target.value)}/>
          <TextField size="small" label="Document No." value={iv.meta?.number || ''} onChange={e=>s.updateMetaField('number', e.target.value)}/>
          <TextField size="small" label="Date (YYYY-MM-DD)" value={iv.meta?.date || ''} onChange={e=>s.updateMetaField('date', e.target.value)}/>
        </Stack>
      </Paper>
    </Stack>
  );
}