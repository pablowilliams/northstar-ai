"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorBoundary({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main style={{minHeight:"100vh",display:"grid",placeItems:"center",background:"#f2f3ef",fontFamily:"system-ui",padding:24}}><section style={{maxWidth:520,background:"white",border:"1px solid #dce1dc",borderRadius:12,padding:32,textAlign:"center"}}><AlertTriangle size={30} color="#b5483e"/><h1 style={{fontFamily:"Georgia,serif",fontSize:30}}>The workspace could not be rendered.</h1><p style={{fontSize:12,color:"#69766f",lineHeight:1.6}}>No action was executed. Retry the view; if the problem continues, use the health endpoint and application trace.</p><button onClick={reset} style={{display:"inline-flex",alignItems:"center",gap:7,border:0,borderRadius:7,background:"#17211c",color:"white",fontSize:10,fontWeight:700,padding:"10px 14px",cursor:"pointer"}}><RotateCcw size={14}/> Retry workspace</button></section></main>;
}
