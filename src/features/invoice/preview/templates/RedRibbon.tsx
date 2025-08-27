export function RedRibbon(){
  return <section style={{
    border:`var(--bw) solid var(--border)`, borderRadius:"var(--r)", overflow:"hidden",
    fontFamily:"var(--body)", color:"var(--txt)", background:"var(--bg)"
  }}>
    <div style={{height:64, background:"var(--acc)"}}/>
    <div style={{padding:"var(--sp)"}}>Template RedRibbon — TODO layout (usa mismos datos que ModernTeal)</div>
  </section>;
}
export default RedRibbon;