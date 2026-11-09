import { clampPull, createMesh, PULL_SIGMA_BASE, PULL_SIGMA_GROWTH, rubberBand, stepSpring } from './physics';
import type { SpringState, Stage } from './physics';

const SLOTS = 4;
const VERTEX = `#version 300 es
in vec2 aUv;
uniform vec2 uView;
uniform vec3 uStage;
uniform vec4 uGrab[4];
out vec2 vUv;
void main() {
  vec2 p = uStage.xy + aUv * uStage.z;
  for (int i = 0; i < 4; i++) {
    vec2 delta = aUv - uGrab[i].xy;
    float stretch = length(uGrab[i].zw) / uStage.z;
    float sigma = ${PULL_SIGMA_BASE} + ${PULL_SIGMA_GROWTH} * stretch;
    float weight = exp(-dot(delta, delta) / (2.0 * sigma * sigma));
    p += uGrab[i].zw * weight;
  }
  vUv = aUv;
  vec2 clip = p / uView * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}`;
const FRAGMENT = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uBase;
uniform sampler2D uAtlas;
uniform sampler2D uMask;
uniform int uFaceA;
uniform int uFaceB;
uniform float uMix;
uniform vec2 uAtlasSize;
out vec4 outColor;
vec4 portrait(int face) {
  if (face == 0) return texture(uBase, vUv);
  vec2 origin = face == 1 ? vec2(0.5, 0.0) : face == 2 ? vec2(0.0, 0.5) : vec2(0.5, 0.5);
  vec2 inset = 0.5 / uAtlasSize;
  vec2 uv = clamp(origin + vUv * 0.5, origin + inset, origin + 0.5 - inset);
  return texture(uAtlas, uv);
}
void main() {
  vec4 color = mix(portrait(uFaceA), portrait(uFaceB), uMix);
  outColor = color * texture(uMask, vUv).a;
}`;

type Slot = SpringState & { pointer: number | null; u: number; v: number; tx: number; ty: number; live: boolean };
function emptySlot(): Slot {
  return { pointer: null, u: 0, v: 0, x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, live: false };
}

/** A single continuous surface. Its owner supplies the shared animation clock. */
export class FaceEngine {
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext | WebGL2RenderingContext;
  readonly rendererName: 'webgl2' | 'webgl';
  private program: WebGLProgram | null = null;
  private attribute = 0;
  private atlasSize = { width: 1, height: 1 };
  private shaders: WebGLShader[] = [];
  private buffers: WebGLBuffer[] = [];
  private textures: WebGLTexture[] = [];
  private uniforms: Record<string, WebGLUniformLocation | null> = {};
  private count = 0;
  private width = 1;
  private height = 1;
  private stage: Stage = { x: 0, y: 0, size: 1 };
  private slots = Array.from({ length: SLOTS }, emptySlot);
  private grabs = new Float32Array(SLOTS * 4);
  private faceA = 0;
  private faceB = 0;
  private mix = 1;
  private last: number | null = null;
  private destroyed = false;
  private hasAtlas = true;

  constructor(canvas: HTMLCanvasElement, images: HTMLImageElement[], mask: HTMLCanvasElement) {
    this.canvas = canvas;
    const options = { alpha: true, premultipliedAlpha: true, antialias: true };
    const gl2 = canvas.getContext('webgl2', options) as WebGL2RenderingContext | null;
    const gl = gl2 ?? canvas.getContext('webgl', options) as WebGLRenderingContext | null;
    if (!gl) throw new Error('WebGL is unavailable');
    this.rendererName = gl2 ? 'webgl2' : 'webgl';
    this.gl = gl;
    try {
      if (images.length < 2) throw new Error('Both portrait images are required');
      this.hasAtlas = images[1] !== images[0];
      this.atlasSize = { width: images[1].naturalWidth, height: images[1].naturalHeight };
      const program = gl.createProgram();
      if (!program) throw new Error('Unable to allocate portrait program');
      this.program = program;
      const vertex = gl2 ? VERTEX : VERTEX.replace('#version 300 es\n', '').replace('in vec2 aUv;', 'attribute vec2 aUv;').replace('out vec2 vUv;', 'varying vec2 vUv;');
      const fragment = gl2 ? FRAGMENT : FRAGMENT.replace('#version 300 es\n', '').replace('in vec2 vUv;', 'varying vec2 vUv;').replace('out vec4 outColor;', '').replaceAll('texture(', 'texture2D(').replace('outColor =', 'gl_FragColor =');
      for (const [type, source] of [[gl.VERTEX_SHADER, vertex], [gl.FRAGMENT_SHADER, fragment]] as const) {
        const shader = gl.createShader(type);
        if (!shader) throw new Error('Unable to allocate portrait shader');
        this.shaders.push(shader);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) || 'Portrait shader compilation failed');
        gl.attachShader(program, shader);
      }
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'Portrait program link failed');
      for (const name of ['uView', 'uStage', 'uGrab[0]', 'uBase', 'uAtlas', 'uMask', 'uFaceA', 'uFaceB', 'uMix', 'uAtlasSize']) {
        this.uniforms[name] = gl.getUniformLocation(program, name);
      }
      const { uv, indices } = createMesh();
      this.count = indices.length;
      for (const [target, data] of [[gl.ARRAY_BUFFER, uv], [gl.ELEMENT_ARRAY_BUFFER, indices]] as const) {
        const buffer = gl.createBuffer();
        if (!buffer) throw new Error('Unable to allocate portrait buffer');
        this.buffers.push(buffer);
        gl.bindBuffer(target, buffer);
        gl.bufferData(target, data, gl.STATIC_DRAW);
      }
      this.attribute = gl.getAttribLocation(program, 'aUv');
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      for (const source of [images[0], images[1], mask]) {
        const texture = gl.createTexture();
        if (!texture) throw new Error('Unable to allocate portrait texture');
        this.textures.push(texture);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
        // WebGL1 cannot mipmap non-power-of-two source portraits (1254px).
        const width = source instanceof HTMLImageElement ? source.naturalWidth : source.width;
        const height = source instanceof HTMLImageElement ? source.naturalHeight : source.height;
        const mipmaps = !!gl2 || ((width & (width - 1)) === 0 && (height & (height - 1)) === 0);
        if (mipmaps) gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mipmaps ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      }
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    } catch (error) {
      this.destroy();
      throw error;
    }
  }

  resize(width: number, height: number, dpr: number, stage: Stage) {
    this.width = Math.max(1, width);
    this.height = Math.max(1, height);
    this.stage = { ...stage, size: Math.max(1, stage.size) };
    const ratio = Math.max(1, Math.min(2, dpr));
    const w = Math.round(this.width * ratio);
    const h = Math.round(this.height * ratio);
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
    if (this.destroyed || this.gl.isContextLost()) return;
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
    const gl = this.gl;
    const u = this.uniforms;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.program);
    gl.uniform2f(u.uView, this.width, this.height);
    gl.uniform3f(u.uStage, this.stage.x, this.stage.y, this.stage.size);
    this.grabs.fill(0);
    this.slots.forEach((slot, i) => {
      if (slot.live) this.grabs.set([slot.u, slot.v, slot.x, slot.y], i * 4);
    });
    gl.uniform4fv(u['uGrab[0]'], this.grabs);
    gl.uniform1i(u.uFaceA, this.faceA);
    gl.uniform1i(u.uFaceB, this.faceB);
    gl.uniform1f(u.uMix, this.mix);
    gl.uniform2f(u.uAtlasSize, this.atlasSize.width, this.atlasSize.height);
    this.textures.forEach((texture, i) => {
      gl.activeTexture(gl.TEXTURE0 + i);
      gl.bindTexture(gl.TEXTURE_2D, texture);
    });
    gl.uniform1i(u.uBase, 0);
    gl.uniform1i(u.uAtlas, 1);
    gl.uniform1i(u.uMask, 2);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[0]);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers[1]);
    gl.enableVertexAttribArray(this.attribute);
    gl.vertexAttribPointer(this.attribute, 2, gl.FLOAT, false, 0, 0);
    gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.reset();
    const gl = this.gl;
    this.textures.forEach(texture => gl.deleteTexture(texture));
    this.buffers.forEach(buffer => gl.deleteBuffer(buffer));
    if (this.program) gl.deleteProgram(this.program);
    this.shaders.forEach(shader => gl.deleteShader(shader));
    this.textures = [];
    this.buffers = [];
    this.shaders = [];
    this.program = null;
  }
}

export { FaceEngine as PortraitEngine };
