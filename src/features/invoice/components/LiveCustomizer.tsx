import React from 'react';
import { Paper, Stack, Typography, TextField, MenuItem, FormControlLabel, Switch, Divider } from '@mui/material';
import { useInvoice } from '@/features/invoice/store/useInvoice';

export default function LiveCustomizer() {
  const s = useInvoice();
  const invoice = s.invoice;
  const profile = s.profiles.find(p => p.id === s.selectedProfileId) || s.profiles[0];

  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1">
        🎨 Live Customizer
      </Typography>
      
      {/* Profile Section */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Profile Settings
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={2}>
          <TextField
            label="Business Name"
            value={profile?.businessName || ''}
            onChange={(e) => s.updateProfile(profile?.id || '', { businessName: e.target.value })}
            fullWidth
            size="small"
          />
          <TextField
            label="Email"
            value={profile?.email || ''}
            onChange={(e) => s.updateProfile(profile?.id || '', { email: e.target.value })}
            fullWidth
            size="small"
          />
          <TextField
            label="Phone"
            value={profile?.phone || ''}
            onChange={(e) => s.updateProfile(profile?.id || '', { phone: e.target.value })}
            fullWidth
            size="small"
          />
          <TextField
            label="Address"
            value={profile?.address || ''}
            onChange={(e) => s.updateProfile(profile?.id || '', { address: e.target.value })}
            multiline
            rows={2}
            fullWidth
            size="small"
          />
        </Stack>
      </Paper>

      {/* Invoice Details */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Invoice Details
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={2}>
          <TextField
            select
            label="Document Type"
            value={invoice.docType}
            onChange={(e) => s.setDocType(e.target.value as any)}
            fullWidth
            size="small"
          >
            <MenuItem value="INVOICE">Invoice</MenuItem>
            <MenuItem value="QUOTE">Quote</MenuItem>
          </TextField>
          
          <TextField
            label="Customer Name"
            value={invoice.customerName || ''}
            onChange={(e) => s.patchInvoice({ customerName: e.target.value })}
            fullWidth
            size="small"
          />
          
          <TextField
            label="Customer Email"
            value={invoice.customerEmail || ''}
            onChange={(e) => s.patchInvoice({ customerEmail: e.target.value })}
            fullWidth
            size="small"
          />
          
          <TextField
            label="Issue Date"
            type="date"
            value={invoice.issueDate}
            onChange={(e) => s.patchInvoice({ issueDate: e.target.value })}
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      </Paper>

      {/* Settings */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Settings
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={2}>
          <TextField
            select
            label="Currency"
            value={profile?.currency || 'USD'}
            onChange={(e) => s.updateProfile(profile?.id || '', { currency: e.target.value })}
            fullWidth
            size="small"
          >
            <MenuItem value="USD">USD - US Dollar</MenuItem>
            <MenuItem value="EUR">EUR - Euro</MenuItem>
            <MenuItem value="GBP">GBP - British Pound</MenuItem>
            <MenuItem value="CAD">CAD - Canadian Dollar</MenuItem>
          </TextField>
          
          <TextField
            select
            label="Locale"
            value={profile?.locale || 'en-US'}
            onChange={(e) => s.updateProfile(profile?.id || '', { locale: e.target.value })}
            fullWidth
            size="small"
          >
            <MenuItem value="en-US">English (US)</MenuItem>
            <MenuItem value="en-GB">English (UK)</MenuItem>
            <MenuItem value="es-ES">Español</MenuItem>
            <MenuItem value="fr-FR">Français</MenuItem>
          </TextField>
        </Stack>
      </Paper>
    </Stack>
  );
}