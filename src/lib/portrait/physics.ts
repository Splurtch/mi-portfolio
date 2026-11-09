export type SpringState = { x: number; y: number; vx: number; vy: number };
export type Stage = { x: number; y: number; size: number };

export const PULL_SIGMA_BASE = 0.072;
export const PULL_SIGMA_GROWTH = 0.72;

/** Growth exceeds exp(-0.5), keeping a single Gaussian pull's Jacobian positive. */
export function pullSigma(stretch: number) {
  return PULL_SIGMA_BASE + PULL_SIGMA_GROWTH * Math.abs(stretch);
}

/** Shared vertices keep adjacent triangles connected throughout every pull. */
export function createMesh(grid = 128) {
  if (!Number.isInteger(grid) || grid < 1 || grid > 255) throw new RangeError('Invalid portrait grid');
  const n = grid + 1;
  const uv = new Float32Array(n * n * 2);
  const indices = new Uint16Array(grid * grid * 6);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const offset = (y * n + x) * 2;
    uv[offset] = x / grid;
    uv[offset + 1] = y / grid;
  }
  let offset = 0;
  for (let y = 0; y < grid; y++) for (let x = 0; x < grid; x++) {
    const a = y * n + x;
    indices.set([a, a + 1, a + n, a + 1, a + n + 1, a + n], offset);
    offset += 6;
  }
  return { uv, indices };
}

export function fitPortrait(width: number, height: number): Stage {
  const size = Math.max(0, Math.min(width, height));
  return { x: (width - size) / 2, y: (height - size) / 2, size };
}

export function rubberBand(dx: number, dy: number, size: number) {
  const length = Math.hypot(dx, dy);
  if (!length || size <= 0) return { x: 0, y: 0 };
  const max = size * 1.1;
  const k = max * Math.tanh(length / max) / length;
  return { x: dx * k, y: dy * k };
}

/** Limit the absolute pointer target, then pass its displacement to rubberBand. */
export function clampPull(u: number, v: number, dx: number, dy: number, stage: Stage, width: number, height: number) {
  const ax = stage.x + u * stage.size;
  const ay = stage.y + v * stage.size;
  const marginX = Math.min(4, width / 2);
  const marginY = Math.min(4, height / 2);
  return {
    x: Math.max(marginX, Math.min(width - marginX, ax + dx)) - ax,
    y: Math.max(marginY, Math.min(height - marginY, ay + dy)) - ay,
  };
}

export function stepSpring(state: SpringState, dt: number) {
  const h = Math.max(0, Math.min(dt, 1 / 30)) / 3;
  for (let i = 0; i < 3; i++) {
    state.vx += (-260 * state.x - 11 * state.vx) * h;
    state.vy += (-260 * state.y - 11 * state.vy) * h;
    state.x += state.vx * h;
    state.y += state.vy * h;
  }
}
