import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ElasticPortrait} from '../src/components/ElasticPortrait';
import {startScroll} from '../src/lib/scroll';

export function Harness() {
  const active = useRef(true);
  const [reduced, setReduced] = useState(false);
  const [preset, setPreset] = useState(0);
  const [impulse, setImpulse] = useState(0);
  const [releases, setReleases] = useState(0);
  const [cancelled, setCancelled] = useState(0);
  const [hidden, setHidden] = useState(false);
  useEffect(() => startScroll(true), []);
  useEffect(() => { active.current = !hidden; }, [hidden]);
  return <main style={{padding:24,maxWidth:720,margin:'auto'}}>
    <h1>Pruebas del retrato continuo</h1>
    <div style={{width:'min(100%,440px)',margin:'40px auto',visibility:hidden ? 'hidden':'visible'}}>
      <ElasticPortrait preset={preset} label={String(preset)} reducedMotion={reduced} activeRef={active} impulse={impulse}
        onGrab={()=>setPreset(1)} onRelease={cancel=>cancel ? setCancelled(c=>c+1) : setReleases(c=>c+1)} />
    </div>
    <div style={{display:'flex',flexWrap:'wrap',gap:12,position:'relative',zIndex:2}}>
      <button onClick={()=>setReduced(r=>!r)} aria-pressed={reduced}>Movimiento reducido</button>
      <button onClick={()=>setImpulse(i=>i+1)}>Impulso</button>
      <button onClick={()=>setPreset(i=>(i+1)%4)}>Cambiar gesto</button>
      <button onClick={()=>setHidden(h=>!h)} aria-pressed={hidden}>Ocultar capítulo</button>
    </div>
    <output aria-live="polite">Sueltas: {releases}. Canceladas: {cancelled}. Reducido: {String(reduced)}.</output>
  </main>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><Harness /></React.StrictMode>);
