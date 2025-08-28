import { useState, Suspense, lazy } from 'react';
import { Tabs, Tab, Typography } from '@mui/material';
import AppShell from './app/AppShell';
import MainSplit from './app/MainSplit';
import ThemeVars from "./theme/ThemeVars";
import ProfileThemeBridge from "./theme/ProfileThemeBridge";
import Preview from "./features/invoice/components/Preview";

// Lazy load components
const InvoiceFormMUI = lazy(() => import('./features/invoice/form/InvoiceFormMUI'));
const CustomizerPanelMUI = lazy(() => import("./features/customizer/CustomizerPanelMUI"));

export default function App() {
  const [tab, setTab] = useState<'form'|'customizer'>('form');

  return (
    <AppShell>
      {/* Global theme components - render once */}
      <ThemeVars />
      <ProfileThemeBridge />
      
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
        InvoiceMaker 2.2.0 — Live Customizer
      </Typography>
      
      <Tabs value={tab} onChange={(_,v)=>setTab(v)} sx={{ mb: 1 }}>
        <Tab value="form" label="Invoice Form" />
        <Tab value="customizer" label="Live Customizer" />
      </Tabs>

      <MainSplit
        left={
          <Suspense fallback={<div>Loading...</div>}>
            {tab === 'form' ? <InvoiceFormMUI/> : <CustomizerPanelMUI/>}
          </Suspense>
        }
        right={<Preview/>}
      />
    </AppShell>
  );
}
