import { useRef } from "react";
import { useInvoice } from "../invoice/store/useInvoice";
import { Stack, TextField, Select, MenuItem, IconButton, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/Upload";
import { nanoid } from "nanoid";
import DOMPurify from "dompurify";
import { ICON_OPTIONS, IconName } from "../../ui/icons/allowlist";

export default function SocialList(){
  const s = useInvoice();
  const list = s.invoice.socials ?? [];

  return (
    <Stack spacing={1.25}>
      {list.map(row => <Row key={row.id} rowId={row.id} />)}
      <Button variant="outlined" onClick={()=>{
        const id = nanoid();
        s.addSocial?.({ id, label:'', value:'', icon:{type:'mui', name:'Phone'} as any });
      }}>+ Add</Button>
    </Stack>
  );
}

function Row({rowId}:{rowId:string}){
  const s = useInvoice();
  const row = (s.invoice.socials ?? []).find(r=>r.id===rowId)!;
  const file = useRef<HTMLInputElement>(null);

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Select size="small" value={row.icon.type==='mui' ? row.icon.name : '(custom)'}
        onChange={(e)=> {
          if(e.target.value !== '(custom)') {
            s.updateSocial?.(rowId,{ icon:{type:'mui', name:e.target.value as IconName} as any });
          }
        }}
        sx={{ width: 150 }}>
        {ICON_OPTIONS.map(n=><MenuItem key={n} value={n}>{n}</MenuItem>)}
        <MenuItem value="(custom)">(custom SVG)</MenuItem>
      </Select>

      <TextField size="small" placeholder="Label" value={row.label}
        onChange={e=>s.updateSocial?.(rowId,{label:e.target.value})} sx={{width:140}}/>
      <TextField size="small" fullWidth placeholder="Value/URL/@"
        value={row.value} onChange={e=>s.updateSocial?.(rowId,{value:e.target.value})}/>

      <IconButton component="label" title="Upload SVG" onClick={()=>file.current?.click()}>
        <UploadIcon/>
        <input ref={file} hidden type="file" accept="image/svg+xml"
          onChange={async e=>{
            const f = e.target.files?.[0]; if(!f) return;
            if (f.size > 200_000) { alert("SVG > 200KB"); return; }
            const raw = await f.text();
            const clean = DOMPurify.sanitize(raw, {
              USE_PROFILES: { svg: true },
              FORBID_TAGS: ['script','iframe','object'],
              FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'xmlns:xlink']
            });
            s.updateSocial?.(rowId,{ icon:{type:'custom', svg: clean} as any });
          }}/>
      </IconButton>

      <IconButton color="error" onClick={()=>s.removeSocial?.(rowId)}><DeleteIcon/></IconButton>
    </Stack>
  );
}