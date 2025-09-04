import { useRef } from "react";
import { useInvoice } from "@/features/invoice/store/useInvoice";
import { Stack, TextField, Select, MenuItem, IconButton, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/Upload";
import { nanoid } from "nanoid";
import DOMPurify from "dompurify";
import { ICON_OPTIONS, IconName } from "../../ui/icons/allowlist";

export default function SocialList(){
  // For minimal footer visibility implementation, use empty socials list
  const s = useInvoice();
  const list: any[] = [];

  return (
    <Stack spacing={1.25}>
      {list.map(row => <Row key={row.id} rowId={row.id} />)}
      <Button variant="outlined" onClick={()=>{
        const id = nanoid();
        // No-op for minimal implementation
      }}>+ Add</Button>
    </Stack>
  );
}

function Row({rowId}:{rowId:string}){
  // For minimal footer visibility implementation, use empty row data
  const s = useInvoice();
  const row = { id: rowId, label: '', value: '', icon: { type: 'mui', name: 'Phone' } };
  const file = useRef<HTMLInputElement>(null);

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Select size="small" value={row.icon.type==='mui' ? row.icon.name : '(custom)'}
        onChange={(e)=> {
          if(e.target.value !== '(custom)') {
            // No-op for minimal implementation
          }
        }}
        sx={{ width: 150 }}>
        {ICON_OPTIONS.map(n=><MenuItem key={n} value={n}>{n}</MenuItem>)}
        <MenuItem value="(custom)">(custom SVG)</MenuItem>
      </Select>

      <TextField size="small" placeholder="Label" value={row.label}
        onChange={()=>{}} sx={{width:140}}/>
      <TextField size="small" fullWidth placeholder="Value/URL/@"
        value={row.value} onChange={()=>{}}/>

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
            // No-op for minimal implementation
          }}/>
      </IconButton>

      <IconButton color="error" onClick={()=>{}}><DeleteIcon/></IconButton>
    </Stack>
  );
}