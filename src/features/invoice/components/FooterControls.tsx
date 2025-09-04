import { FormControlLabel, Switch, TextField, Typography, Box, Card, CardContent } from '@mui/material';
import { useInvoice } from '@/features/invoice/store/useInvoice';
import type { FooterVisibility } from '@/types/invoice';

interface VisibilityControlProps {
  visibility: FooterVisibility;
  onChange: (visibility: FooterVisibility) => void;
}

function VisibilityControl({ visibility, onChange }: VisibilityControlProps) {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <FormControlLabel
        control={
          <Switch
            checked={visibility.showOnInvoice}
            onChange={(e) => onChange({ ...visibility, showOnInvoice: e.target.checked })}
          />
        }
        label="Invoice"
      />
      <FormControlLabel
        control={
          <Switch
            checked={visibility.showOnQuote}
            onChange={(e) => onChange({ ...visibility, showOnQuote: e.target.checked })}
          />
        }
        label="Quote"
      />
    </Box>
  );
}

export default function FooterControls() {
  const notes = useInvoice(s => s.footerState.notes);
  const terms = useInvoice(s => s.footerState.terms);
  const payment = useInvoice(s => s.footerState.payment);
  const setFooterEnabled = useInvoice(s => s.setFooterEnabled);
  const setFooterText = useInvoice(s => s.setFooterText);
  const setFooterVisibility = useInvoice(s => s.setFooterVisibility);

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      {/* NOTES */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={notes.enabled}
                  onChange={(e) => setFooterEnabled('notes', e.target.checked)}
                />
              }
              label={<Typography variant="h6">Notes</Typography>}
            />
          </Box>
          
          <VisibilityControl
            visibility={notes.visibility}
            onChange={(visibility) => setFooterVisibility('notes', visibility)}
          />
          
          <TextField
            fullWidth
            multiline
            rows={3}
            value={notes.text}
            onChange={(e) => setFooterText('notes', e.target.value)}
            placeholder="Write a short note to your client…"
            sx={{ mt: 2 }}
          />
        </CardContent>
      </Card>

      {/* TERMS */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={terms.enabled}
                  onChange={(e) => setFooterEnabled('terms', e.target.checked)}
                />
              }
              label={<Typography variant="h6">Terms & Conditions</Typography>}
            />
          </Box>
          
          <VisibilityControl
            visibility={terms.visibility}
            onChange={(visibility) => setFooterVisibility('terms', visibility)}
          />
          
          <TextField
            fullWidth
            multiline
            rows={3}
            value={terms.text}
            onChange={(e) => setFooterText('terms', e.target.value)}
            placeholder="Payment terms, late fees, warranties…"
            sx={{ mt: 2 }}
          />
        </CardContent>
      </Card>

      {/* PAYMENT CONDITIONS */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={payment.enabled}
                  onChange={(e) => setFooterEnabled('payment', e.target.checked)}
                />
              }
              label={<Typography variant="h6">Payment Conditions</Typography>}
            />
          </Box>
          
          <VisibilityControl
            visibility={payment.visibility}
            onChange={(visibility) => setFooterVisibility('payment', visibility)}
          />
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Payment items: {payment.items.length}
            </Typography>
            {payment.items.map((item, index) => (
              <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                • {item}
              </Typography>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}