export default function Loading() {
  return <main style={{minHeight:"100vh",display:"grid",placeItems:"center",background:"#f2f3ef",fontFamily:"system-ui"}}><div aria-label="Loading Northstar" style={{display:"flex",alignItems:"center",gap:12,color:"#187255"}}><span className="spinner"/><b style={{fontSize:12}}>Loading decision workspace…</b></div></main>;
}
