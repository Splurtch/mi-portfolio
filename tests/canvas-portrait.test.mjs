import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const physics = new URL('../src/lib/portrait/physics.ts', import.meta.url).href;
const source = readFileSync(new URL('../src/lib/portrait/canvas-engine.ts', import.meta.url), 'utf8');
const code = ts.transpileModule(source.replace("'./physics'", JSON.stringify(physics)), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
const { CanvasPortraitEngine } = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
function canvas() {
  const calls = [];
  const ctx = new Proxy({ calls }, { get(o, k) { return k in o ? o[k] : (...args) => calls.push([k, ...args]); } });
  return { width: 1, height: 1, ctx, getContext: () => ctx };
}
globalThis.document = { createElement: canvas };
function setup() {
  const output = canvas();
  const engine = new CanvasPortraitEngine(output, [{naturalWidth:1254,naturalHeight:1254}, {naturalWidth:2048,naturalHeight:2048}], canvas());
  engine.resize(660, 540, 2, {x:180,y:120,size:300});
  return { output, engine };
}
test('native-resolution masked faces and idle single-draw fast path', () => {
  const {engine,output} = setup();
  assert.equal(engine.rendererName, 'canvas2d');
  assert.deepEqual(engine.faces.map(f => f.width), [1254,1024,1024,1024]);
  assert.equal(engine.faces[0].ctx.globalCompositeOperation, 'destination-in');
  engine.render(0, false);
  assert.equal(output.ctx.calls.filter(c => c[0] === 'drawImage').length, 1);
  assert.equal(output.width,1320);
});
test('four grabs deform shared vertices, triangles use finite transforms, springs settle', () => {
  const {engine,output} = setup();
  for(let i=0;i<4;i++) assert.equal(engine.grab(i,0.5,0.4),true);
  assert.equal(engine.grab(4,0.5,0.4),false);
  assert.equal(engine.grab(0,0.5,0.4),false);
  engine.drag(0,130,-80);
  engine.render(0,false);
  assert.equal(engine.held,true);
  const transforms=output.ctx.calls.filter(c=>c[0]==='transform');
  assert.equal(transforms.length,48*48*2);
  assert.ok(transforms.every(c=>c.slice(1).every(Number.isFinite)));
  assert.equal(engine.mesh.indices[1],engine.mesh.indices[3]);
  const center=(19*49+24)*2;
  assert.ok(engine.positions[center]>180+0.5*300);
  engine.releaseAll();
  for(let i=1;i<240;i++) engine.render(i*1000/60,false);
  assert.equal(engine.held,false);
  assert.equal(engine.moving,false);
});
test('reduced motion clears deformation; expression selection and cleanup work', () => {
  const {engine,output}=setup();
  engine.grab(1,0.5,0.4); engine.drag(1,90,40); engine.poke(); engine.setFace(3);
  engine.render(0,true);
  assert.equal(engine.moving,false);
  assert.equal(engine.held,false);
  assert.equal(engine.faceA,3);
  assert.equal(output.ctx.calls.filter(c=>c[0]==='drawImage').length,1);
  engine.destroy(); engine.destroy();
  const count=output.ctx.calls.length;
  engine.render(20,false);
  assert.equal(output.ctx.calls.length,count);
  assert.equal(engine.grab(1,0.5,0.5),false);
});
test('mask occupancy skips transparent cells but keeps neighboring filter padding', () => {
  const output=canvas();
  const mask=canvas();mask.width=mask.height=96;
  const data=new Uint8ClampedArray(96*96*4);
  // A pixel right on a cell edge must retain both adjacent source cells.
  data[(48*96+48)*4+3]=255;
  mask.ctx.getImageData=()=>({data});
  const engine=new CanvasPortraitEngine(output,[{naturalWidth:1254,naturalHeight:1254},{naturalWidth:2048,naturalHeight:2048}],mask);
  assert.ok(engine.occupied.reduce((a,b)=>a+b,0)<48*48);
  assert.equal(engine.occupied[24*48+24],1);
  assert.equal(engine.occupied[24*48+23],1);
  engine.resize(660,540,2,{x:180,y:120,size:300});
  engine.grab(1,0.5,0.5);engine.drag(1,100,20);engine.render(0,false);
  assert.equal(output.ctx.calls.filter(c=>c[0]==='transform').length,engine.occupied.reduce((a,b)=>a+b,0)*2);
});
