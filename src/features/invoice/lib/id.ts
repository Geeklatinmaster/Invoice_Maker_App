export function genDocId(prefix='INV'){
  const pad = (n:number)=> String(n).padStart(2,'0');
  const d = new Date();
  const code = `${d.getFullYear().toString().slice(-2)}${pad(d.getMonth()+1)}${pad(d.getDate())}`;
  const rand = Math.random().toString(36).slice(2,6).toUpperCase();
  return `${prefix}-${code}-${rand}`;
}