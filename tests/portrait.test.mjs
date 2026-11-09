import test from 'node:test';
import assert from 'node:assert/strict';
let math = {};
try { math = await import('../src/lib/portrait/physics.ts'); } catch { /* initial red: renderer has no shared mesh */ }
test('portrait uses a connected 128×128 indexed surface, not independent tiles', () => {
  assert.equal(typeof math.createMesh, 'function', 'continuous mesh implementation is missing');
  const { uv, indices } = math.createMesh();
  assert.equal(uv.length, 129 * 129 * 2);
  assert.equal(indices.length, 128 * 128 * 6);
  assert.deepEqual([...indices.slice(0, 6)], [0, 1, 129, 1, 130, 129]);
  assert.equal(indices[6], indices[1]);
  assert.equal(Math.max(...indices), 129 * 129 - 1);
});
test('the complete square portrait fits wide and narrow stages without cropping', () => {
  assert.equal(typeof math.fitPortrait, 'function');
  for (const [w, h] of [[420, 270], [290, 350], [700, 420]]) {
    const r = math.fitPortrait(w, h);
    assert.equal(r.size, Math.min(w, h));
    assert.ok(r.x >= 0 && r.y >= 0);
    assert.ok(r.x + r.size <= w && r.y + r.size <= h);
  }
});
test('pull limits are radial and continuous with no componentwise hard stop', () => {
  assert.equal(typeof math.rubberBand, 'function');
  const d = math.rubberBand(1000, 1000, 300);
  assert.ok(Math.hypot(d.x, d.y) <= 330);
  assert.equal(d.x, d.y);
  assert.deepEqual(math.rubberBand(0, 0, 300), {x: 0, y: 0});
});
test('springs return to rest at 30/60/120 Hz and clamp long interruptions', () => {
  assert.equal(typeof math.stepSpring, 'function');
  for (const hz of [30, 60, 120]) {
    const s = {x: 100, y: -50, vx: 0, vy: 0};
    for (let i = 0; i < hz * 3; i++) math.stepSpring(s, 1 / hz);
    assert.ok(Math.hypot(s.x, s.y) < 0.01);
  }
  const s = {x: 100, y: -50, vx: 0, vy: 0};
  math.stepSpring(s, 100);
  assert.ok(Number.isFinite(s.x) && Math.abs(s.x) < 150);
});

test('drag targets stay inside the overlay before rubber banding', () => {
  assert.equal(typeof math.clampPull, 'function');
  const stage = {x: 180, y: 120, size: 300};
  assert.deepEqual(math.clampPull(0.5, 0.1, 0, -10000, stage, 660, 540), {x: 0, y: -146});
  assert.deepEqual(math.clampPull(0.5, 0.5, 10000, 10000, stage, 660, 540), {x: 326, y: 266});
  assert.deepEqual(math.clampPull(0.5, 0.5, 10, -20, stage, 660, 540), {x: 10, y: -20});
});

test('mesh guard rejects invalid sizes and sizes exceeding Uint16 indices', () => {
  for (const grid of [0, -1, 1.5, 256, NaN, Infinity]) assert.throws(() => math.createMesh(grid), RangeError);
  const mesh = math.createMesh(255);
  assert.equal(mesh.indices.reduce((max, value) => Math.max(max, value), 0), 65535);
});

test('single pulls keep a positive Jacobian and ordered vertices even beyond the rubber limit', () => {
  assert.equal(typeof math.pullSigma, 'function');
  for (const stretch of [0, 0.05, 0.2, 0.5, 1.1, 2]) {
    const sigma = math.pullSigma(stretch);
    // The largest opposing Gaussian slope is reached one sigma from its anchor.
    const minimumDerivative = 1 - stretch / sigma * Math.exp(-0.5);
    assert.ok(minimumDerivative > 0, `folding at stretch ${stretch}`);
    for (const direction of [-1, 1]) {
      let previous = -Infinity;
      for (let i = 0; i <= 1024; i++) {
        const u = i / 1024;
        const mapped = u + direction * stretch * Math.exp(-((u - 0.5) ** 2) / (2 * sigma * sigma));
        assert.ok(mapped > previous, `reversed adjacent vertices at stretch ${stretch}`);
        previous = mapped;
      }
    }
  }
});
