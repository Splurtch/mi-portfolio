import { clampPull, createMesh, pullSigma, rubberBand, stepSpring } from './physics';
import type { SpringState, Stage } from './physics';
const SLOTS = 4;
const GRID = 48;
type Slot = SpringState & { pointer: number | null; u: number; v: number; tx: number; ty: number; live: boolean };
function emptySlot(): Slot {
  return { pointer: null, u: 0, v: 0, x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, live: false };
}


/** Shared-vertex Canvas2D fallback. Its owner supplies the animation clock. */
export class CanvasPortraitEngine {
  readonly rendererName = 'canvas2d' as const;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private faces: HTMLCanvasElement[] = [];
  private blend: HTMLCanvasElement;
  private blendCtx: CanvasRenderingContext2D;
  private mesh = createMesh(GRID);
  private occupied = new Uint8Array(GRID * GRID).fill(1);
  private positions = new Float64Array(this.mesh.uv.length);
  private slots = Array.from({ length: SLOTS }, emptySlot);
  private stage: Stage = { x: 0, y: 0, size: 1 };
  private ratio = 1;
  private width = 1;
  private height = 1;
  private faceA = 0;
  private faceB = 0;
  private mix = 1;
  private last: number | null = null;
  private destroyed = false;
  private hasAtlas: boolean;

  constructor(canvas: HTMLCanvasElement, images: HTMLImageElement[], mask: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) throw new Error('Canvas2D is unavailable');
    if (images.length < 2) throw new Error('Both portrait images are required');
    this.canvas = canvas;
    this.ctx = ctx;
    this.hasAtlas = images[0] !== images[1];
    for (let face = 0; face < (this.hasAtlas ? 4 : 1); face++) {
      const image = images[face ? 1 : 0];
      const width = image.naturalWidth / (face ? 2 : 1);
      const height = image.naturalHeight / (face ? 2 : 1);
      const cutout = document.createElement('canvas');
      cutout.width = Math.max(1, Math.round(width));
      cutout.height = Math.max(1, Math.round(height));
      const context = cutout.getContext('2d');
      if (!context) throw new Error('Unable to allocate portrait cutout');
      context.imageSmoothingQuality = 'high';
      context.drawImage(image, face ? (face % 2) * width : 0, face ? Math.floor(face / 2) * height : 0,
        width, height, 0, 0, cutout.width, cutout.height);
      context.globalCompositeOperation = 'destination-in';
      context.drawImage(mask, 0, 0, cutout.width, cutout.height);
      this.faces.push(cutout);
    }
    // Read the vector mask once, never during animation. Keep any cell whose
    // source sampling rectangle (including its filter padding) contains alpha.
    // If readback is unavailable, correctness wins: retain all cells.
    try {
      const pixels = mask.getContext('2d')?.getImageData(0, 0, mask.width, mask.height).data;
      if (pixels) {
        const padX = Math.ceil(4 * mask.width / Math.min(...this.faces.map(face => face.width))) + 1;
        const padY = Math.ceil(4 * mask.height / Math.min(...this.faces.map(face => face.height))) + 1;
        for (let row = 0; row < GRID; row++) for (let col = 0; col < GRID; col++) {
          const x0 = Math.max(0, Math.floor(col * mask.width / GRID) - padX);
          const x1 = Math.min(mask.width, Math.ceil((col + 1) * mask.width / GRID) + padX);
          const y0 = Math.max(0, Math.floor(row * mask.height / GRID) - padY);
          const y1 = Math.min(mask.height, Math.ceil((row + 1) * mask.height / GRID) + padY);
          let occupied = false;
          for (let y = y0; y < y1 && !occupied; y++) for (let x = x0; x < x1; x++) {
            if (pixels[(y * mask.width + x) * 4 + 3]) { occupied = true; break; }
          }
          this.occupied[row * GRID + col] = Number(occupied);
        }
      }
    } catch { /* Canvas readback can be disabled by privacy settings. */ }
    this.blend = document.createElement('canvas');
    this.blend.width = Math.max(...this.faces.map(face => face.width));
    this.blend.height = Math.max(...this.faces.map(face => face.height));
    const blendCtx = this.blend.getContext('2d');
    if (!blendCtx) throw new Error('Unable to allocate portrait blend');
    this.blendCtx = blendCtx;
  }

  resize(width: number, height: number, dpr: number, stage: Stage) {
    this.width = Math.max(1, width);
    this.height = Math.max(1, height);
    this.stage = { ...stage, size: Math.max(1, stage.size) };
    this.ratio = Math.max(1, Math.min(2, dpr));
    const w = Math.round(Math.max(1, width) * this.ratio);
    const h = Math.round(Math.max(1, height) * this.ratio);
    if (this.canvas.width !== w) this.canvas.width = w;
    if (this.canvas.height !== h) this.canvas.height = h;
  }
  setFace(index: number, reducedMotion = false) {
    const next = this.hasAtlas ? Math.max(0, Math.min(3, Math.round(index))) : 0;
    if (reducedMotion) {
      this.faceA = this.faceB = next;
      this.mix = 1;
    } else if (next !== this.faceB) {
      if (this.mix >= 0.5) this.faceA = this.faceB;
      this.faceB = next;
      this.mix = 0;
    }
  }

  grab(pointer: number, u: number, v: number) {
    if (this.destroyed || u < 0 || v < 0 || u > 1 || v > 1) return false;
    if (this.slots.some(slot => slot.pointer === pointer)) return false;
    const slot = this.slots.find(s => !s.live) ?? this.slots.find(s => s.pointer === null);
    if (!slot) return false;
    Object.assign(slot, emptySlot(), { pointer, u, v, live: true });
    return true;
  }

  drag(pointer: number, dx: number, dy: number) {
    const slot = this.slots.find(s => s.pointer === pointer);
    if (!slot) return;
    const bounded = clampPull(slot.u, slot.v, dx, dy, this.stage, this.width, this.height);
    const target = rubberBand(bounded.x, bounded.y, this.stage.size);
    slot.tx = target.x;
    slot.ty = target.y;
  }

  release(pointer: number) {
    const slot = this.slots.find(s => s.pointer === pointer);
    if (slot) slot.pointer = null;
  }

  releaseAll(reducedMotion = false) {
    for (const slot of this.slots) {
      slot.pointer = null;
      if (reducedMotion) Object.assign(slot, emptySlot());
    }
  }

  poke() {
    const slot = this.slots.find(s => !s.live);
    if (slot) Object.assign(slot, emptySlot(), { u: 0.5, v: 0.45, vy: this.stage.size * 0.9, live: true });
  }

  reset() {
    this.releaseAll(true);
    this.faceA = this.faceB;
    this.mix = 1;
    this.last = null;
  }

  get held() { return this.slots.some(s => s.pointer !== null); }
  get moving() { return this.mix < 1 || this.slots.some(s => s.live); }

  render(time: number, reducedMotion: boolean) {
    if (this.destroyed) return;
    const dt = this.last === null ? 1 / 60 : Math.max(0, Math.min((time - this.last) / 1000, 1 / 30));
    this.last = time;
    if (reducedMotion) {
      this.releaseAll(true);
      this.mix = 1;
    } else {
      for (const slot of this.slots) {
        if (!slot.live) continue;
        if (slot.pointer !== null) {
          const follow = 1 - Math.exp(-38 * dt);
          const dx = (slot.tx - slot.x) * follow;
          const dy = (slot.ty - slot.y) * follow;
          slot.vx = dt > 0 ? dx / dt : 0;
          slot.vy = dt > 0 ? dy / dt : 0;
          slot.x += dx;
          slot.y += dy;
        } else {
          stepSpring(slot, dt);
          if (Math.hypot(slot.x, slot.y) < 0.25 && Math.hypot(slot.vx, slot.vy) < 6) Object.assign(slot, emptySlot());
        }
      }
      this.mix = Math.min(1, this.mix + dt / 0.09);
    }
    if (this.mix === 1) this.faceA = this.faceB;

    let texture = this.faces[this.faceB];
    if (this.mix < 1) {
      const ctx = this.blendCtx;
      const { width, height } = this.blend;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1 - this.mix;
      ctx.drawImage(this.faces[this.faceA], 0, 0, width, height);
      // Add premultiplied colors so crossfading preserves cutout alpha.
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = this.mix;
      ctx.drawImage(texture, 0, 0, width, height);
      ctx.globalAlpha = 1;
      texture = this.blend;
    }
    const ctx = this.ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.setTransform(this.ratio, 0, 0, this.ratio, 0, 0);
    if (!this.slots.some(s => s.live && (Math.abs(s.x) > 0.01 || Math.abs(s.y) > 0.01))) {
      ctx.drawImage(texture, this.stage.x, this.stage.y, this.stage.size, this.stage.size);
      return;
    }
    const { uv, indices } = this.mesh;
    const p = this.positions;
    // Evaluate each vertex once; every adjacent triangle uses this same position.
    for (let i = 0; i < uv.length; i += 2) {
      let x = this.stage.x + uv[i] * this.stage.size;
      let y = this.stage.y + uv[i + 1] * this.stage.size;
      for (const slot of this.slots) {
        if (!slot.live) continue;
        const du = uv[i] - slot.u, dv = uv[i + 1] - slot.v;
        const sigma = pullSigma(Math.hypot(slot.x, slot.y) / this.stage.size);
        const weight = Math.exp(-(du * du + dv * dv) / (2 * sigma * sigma));
        x += slot.x * weight; y += slot.y * weight;
      }
      p[i] = x; p[i + 1] = y;
    }
    for (let i = 0; i < indices.length; i += 6) {
      if (!this.occupied[i / 6]) continue;
      this.drawTriangle(texture, indices[i] * 2, indices[i + 1] * 2, indices[i + 2] * 2);
      this.drawTriangle(texture, indices[i + 3] * 2, indices[i + 4] * 2, indices[i + 5] * 2);
    }
  }

  private drawTriangle(texture: HTMLCanvasElement, a: number, b: number, c: number) {
    const p = this.positions, uv = this.mesh.uv, ctx = this.ctx;
    const x0 = p[a], y0 = p[a + 1], x1 = p[b], y1 = p[b + 1], x2 = p[c], y2 = p[c + 1];
    if (Math.abs((x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0)) < 0.00001) return;
    const u0 = uv[a] * texture.width, v0 = uv[a + 1] * texture.height;
    const u1 = uv[b] * texture.width - u0, v1 = uv[b + 1] * texture.height - v0;
    const u2 = uv[c] * texture.width - u0, v2 = uv[c + 1] * texture.height - v0;
    const det = u1 * v2 - u2 * v1;
    const aa = ((x1 - x0) * v2 - (x2 - x0) * v1) / det;
    const bb = ((y1 - y0) * v2 - (y2 - y0) * v1) / det;
    const cc = ((x2 - x0) * u1 - (x1 - x0) * u2) / det;
    const dd = ((y2 - y0) * u1 - (y1 - y0) * u2) / det;
    const cx = (x0 + x1 + x2) / 3, cy = (y0 + y1 + y2) / 3;
    ctx.save();
    ctx.beginPath();
    // Subpixel overlap hides rasterizer hairlines without detaching shared vertices.
    for (const offset of [a, b, c]) {
      const dx = p[offset] - cx, dy = p[offset + 1] - cy;
      const expand = 0.65 / this.ratio / Math.max(0.001, Math.hypot(dx, dy));
      const x = p[offset] + dx * expand, y = p[offset + 1] + dy * expand;
      if (offset === a) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath(); ctx.clip();
    ctx.transform(aa, bb, cc, dd, x0 - aa * u0 - cc * v0, y0 - bb * u0 - dd * v0);
    // Sample only the source cell plus padding for the expanded clip.
    const sx = Math.max(0, Math.floor(Math.min(u0, u0 + u1, u0 + u2)) - 3);
    const sy = Math.max(0, Math.floor(Math.min(v0, v0 + v1, v0 + v2)) - 3);
    const sw = Math.min(texture.width, Math.ceil(Math.max(u0, u0 + u1, u0 + u2)) + 3) - sx;
    const sh = Math.min(texture.height, Math.ceil(Math.max(v0, v0 + v1, v0 + v2)) + 3) - sy;
    ctx.drawImage(texture, sx, sy, sw, sh, sx, sy, sw, sh);
    ctx.restore();
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.reset();
    for (const face of this.faces) { face.width = 1; face.height = 1; }
    this.faces = [];
    this.blend.width = this.blend.height = 1;
  }
}
