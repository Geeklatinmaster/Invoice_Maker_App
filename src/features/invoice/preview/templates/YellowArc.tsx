export function YellowArc(){
  return <section style={{
    border:`var(--bw) solid var(--border)`, borderRadius:"var(--r)", overflow:"hidden",
    fontFamily:"var(--body)", color:"var(--txt)", background:"var(--bg)"
  }}>
    <div style={{height:64, background:"var(--acc)"}}/>
    <div style={{padding:"var(--sp)"}}>Template YellowArc — TODO layout (usa mismos datos que ModernTeal)</div>
  </section>;
}
export default YellowArc;