import { useInvoice } from "../store/useInvoice";
import { useState } from "react";

export default function ProfileSelector() {
  const { profiles, selectedProfileId, selectProfile, addProfile, updateProfile, deleteProfile, exportProfiles, importProfiles } = useInvoice();
  const sel = profiles.find(p => p.id === selectedProfileId);
  const [showNew, setShowNew] = useState(false);

  return (
    <section style={{display:"grid", gap:8}}>
      <label>
        Perfil:&nbsp;
        <select value={selectedProfileId} onChange={e=>selectProfile(e.target.value!)}>
          {profiles.map(p=> <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </label>

      {sel && (
        <div style={{display:"grid", gap:6}}>
          <input placeholder="Business Name" value={sel.businessName} onChange={e=>updateProfile(sel.id,{businessName:e.target.value})}/>
          <input placeholder="EIN/TIN" value={sel.taxId||""} onChange={e=>updateProfile(sel.id,{taxId:e.target.value})}/>
          <input placeholder="Email" value={sel.email||""} onChange={e=>updateProfile(sel.id,{email:e.target.value})}/>
          <input placeholder="Phone" value={sel.phone||""} onChange={e=>updateProfile(sel.id,{phone:e.target.value})}/>
        </div>
      )}

      <div style={{display:"flex", gap:8}}>
        <button onClick={()=>setShowNew(s=>!s)}>Nuevo</button>
        <button onClick={()=>{ navigator.clipboard.writeText(exportProfiles()); alert("Perfiles copiados (JSON)"); }}>Exportar</button>
        <button onClick={()=>{ const txt = prompt("Pega JSON de perfiles") || ""; importProfiles(txt); }}>Importar</button>
        {sel && <button onClick={()=>deleteProfile(sel.id)}>Eliminar</button>}
      </div>

      {showNew && <NewProfile onCreate={(p)=>{ addProfile(p); setShowNew(false); }} />}
    </section>
  );
}

function NewProfile({ onCreate }: { onCreate: (p: any)=>void }) {
  const [name,setName]=useState("Nuevo perfil");
  const [businessName,setBusinessName]=useState("");
  const [currency,setCurrency]=useState("USD");
  const [locale,setLocale]=useState("en-US");
  return (
    <div style={{border:"1px solid #ddd", padding:8, display:"grid", gap:6}}>
      <input placeholder="Nombre del perfil" value={name} onChange={e=>setName(e.target.value)}/>
      <input placeholder="Business Name" value={businessName} onChange={e=>setBusinessName(e.target.value)}/>
      <input placeholder="Currency (USD)" value={currency} onChange={e=>setCurrency(e.target.value)}/>
      <input placeholder="Locale (en-US)" value={locale} onChange={e=>setLocale(e.target.value)}/>
      <button onClick={()=>onCreate({ name, businessName, currency, locale })}>Crear</button>
    </div>
  );
}
