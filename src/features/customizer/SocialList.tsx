import { useRef } from "react";
import { useInvoice } from "../invoice/store/useInvoice";
import { Box, Stack, TextField, Select, MenuItem, IconButton, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/Upload";
import { nanoid } from "nanoid";

const ALLOW = ['Phone','Email','Instagram','WhatsApp','Language','LocationOn'] as const;
type MuiName = typeof ALLOW[number];

export default function SocialList(){
  const s = useInvoice();
  const list = s.invoice.socials ?? [];

  return (
    <Stack spacing={1.25}>
      {list.map(row => <Row key={row.id} rowId={row.id} />)}
      <Button variant="outlined" onClick={()=>{
        const id = nanoid();
        s.addSocial?.({ id, label:'', value:'', icon:{type:'mui', name:'Phone'} });
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
        onChange={(e)=> s.updateSocial?.(rowId,{ icon:{type:'mui', name:e.target.value as MuiName} }) }
        sx={{ width: 150 }}>
        {ALLOW.map(n=><MenuItem key={n} value={n}>{n}</MenuItem>)}
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
            const svg = await f.text();
            if (/\bon[a-z]+=/i.test(svg)) { alert("SVG inválido (event attrs)"); return; }
            s.updateSocial?.(rowId,{ icon:{type:'custom', svg} });
          }}/>
      </IconButton>

      <IconButton color="error" onClick={()=>s.removeSocial?.(rowId)}><DeleteIcon/></IconButton>
    </Stack>
  );
}