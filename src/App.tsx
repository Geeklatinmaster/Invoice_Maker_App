import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Invoices from "@/pages/Invoices";
import Clients from "@/pages/Clients";
import { useEffect, useState } from "react";
import { ModeSwitch, NavTabs } from "@/ui/components/glass";
import LanguageSwitcher from "@/features/settings/LanguageSwitcher";
import { useSettings } from "@/store/useSettings";

function Shell(){
  const [mode,setMode] = useState<'light'|'dark'>(() => (localStorage.getItem('mode') as any) || 'light');
  const location = useLocation(); const navigate = useNavigate();
  
  // Initialize settings store (this will set up i18n language)
  useSettings();
  
  useEffect(()=>{ 
    document.documentElement.classList.toggle('dark', mode==='dark'); 
    localStorage.setItem('mode',mode); 
  },[mode]);
  
  // Listen for navigation events from child components
  useEffect(() => {
    const handleNavigateToInvoices = () => {
      navigate('/invoices')
    }
    
    window.addEventListener('navigate-to-invoices', handleNavigateToInvoices)
    return () => window.removeEventListener('navigate-to-invoices', handleNavigateToInvoices)
  }, [navigate])
  
  const tab = location.pathname.startsWith('/invoices') ? 'Invoices' : location.pathname.startsWith('/clients') ? 'Clients' : 'Dashboard';
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-[#e9eef9] via-[#e8ebf2] to-[#e9e9ee] dark:from-[#0f1023] dark:via-[#0b0e1a] dark:to-[#0a0d18]" />
      <div className="relative z-10 p-6 md:p-10">
        <header className="mb-6 md:mb-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">InvoiceMaker — Liquid Glass</h1>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <ModeSwitch mode={mode} onToggle={()=>setMode(m=>m==='light'?'dark':'light')} />
            </div>
          </div>
          <NavTabs tabs={['Dashboard','Invoices','Clients']} active={tab} onChange={(t)=>navigate(`/${t.toLowerCase()}`)} />
        </header>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/invoices"  element={<Invoices />} />
          <Route path="/clients"   element={<Clients />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App(){
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}
