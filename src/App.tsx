import { useState } from 'react';
import { Box, Tabs, Tab, Typography, Button } from '@mui/material';
import { AppLayout } from './app/AppLayout';
import ProfileSelector from "./features/invoice/components/ProfileSelector";
import FooterSelector from "./features/invoice/components/FooterSelector";
import InvoiceForm from "./features/invoice/components/InvoiceForm";
import Preview from "./features/invoice/components/Preview";
import CustomizerPanelMUI from "./features/customizer/CustomizerPanelMUI";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ flex: 1, display: value === index ? 'flex' : 'none', flexDirection: 'column' }}
    >
      {value === index && children}
    </div>
  );
}

export default function App() {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <AppLayout>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
        InvoiceMaker 2.2.0 — Live Customizer
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Invoice Form" />
          <Tab label="Live Customizer" />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto', 
          py: 2,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '400px 1fr' },
          gap: 3 
        }}>
          {/* Left: Form Controls */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ProfileSelector />
            <FooterSelector />
            <InvoiceForm />
          </Box>
          
          {/* Right: Preview */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Preview</Typography>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => window.print()}
              >
                Print
              </Button>
            </Box>
            <Box sx={{ 
              flex: 1, 
              overflow: 'auto', 
              border: 1, 
              borderColor: 'divider',
              borderRadius: 1,
              p: 2
            }}>
              <Preview />
            </Box>
          </Box>
        </Box>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <Box sx={{
          flex: 1, 
          overflow: 'auto',
          py: 2,
          '& .customizer-grid': {
            display: 'grid', 
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: '1fr 380px' },
            height: '100%'
          }
        }}>
          <div className="customizer-grid">
            {/* Left: Preview */}
            <Box sx={{ 
              overflow: 'auto',
              border: 1, 
              borderColor: 'divider',
              borderRadius: 1,
              p: 2
            }}>
              <Preview />
            </Box>
            
            {/* Right: Customizer Panel */}
            <Box sx={{ overflow: 'auto' }}>
              <CustomizerPanelMUI />
            </Box>
          </div>
        </Box>
      </CustomTabPanel>
    </AppLayout>
  );
}
