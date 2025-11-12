import test from 'node:test';
import assert from 'node:assert/strict';
import { SphericalMercator } from '../src/index.ts';

const MAX_EXTENT_MERC = [
  -20037508.342789244, -20037508.342789244, 20037508.342789244,
  20037508.342789244,
];
const MAX_EXTENT_WGS84 = [-180, -85.0511287798066, 180, 85.0511287798066];

const sm = new SphericalMercator();
const smAnti = new SphericalMercator({ antimeridian: true });

test('bbox', () => {
  assert.deepEqual(
    sm.bbox(0, 0, 0, true, 'WGS84'),
    [-180, -85.05112877980659, 180, 85.0511287798066],
  );
  assert.deepEqual(
    sm.bbox(0, 0, 1, true, 'WGS84'),
    [-180, -85.05112877980659, 0, 0],
  );
});

test('xyz', () => {
  assert.deepEqual(
    sm.xyz([-180, -85.05112877980659, 180, 85.0511287798066], 0, true, 'WGS84'),
    { minX: 0, minY: 0, maxX: 0, maxY: 0 },
  );
  assert.deepEqual(sm.xyz([-180, -85.05112877980659, 0, 0], 1, true, 'WGS84'), {
    minX: 0,
    minY: 0,
    maxX: 0,
    maxY: 0,
  });
});

test('xyz, broken', () => {
  const extent = [-0.087891, 40.95703, 0.087891, 41.044916];
  const xyz = sm.xyz(extent, 3, true, 'WGS84');
  assert.ok(xyz.minX <= xyz.maxX);
  assert.ok(xyz.minY <= xyz.maxY);
});

test('xyz, negative', () => {
  const extent = [-112.5, 85.0511, -112.5, 85.0511];
  const xyz = sm.xyz(extent, 0);
  assert.equal(xyz.minY, 0);
});

test('xyz, fuzz', () => {
  for (let i = 0; i < 1000; i++) {
    const x = [-180 + 360 * Math.random(), -180 + 360 * Math.random()];
    const y = [-85 + 170 * Math.random(), -85 + 170 * Math.random()];
    const z = Math.floor(22 * Math.random());
    const extent = [
      Math.min.apply(Math, x),
      Math.min.apply(Math, y),
      Math.max.apply(Math, x),
      Math.max.apply(Math, y),
    ];
    const xyz = sm.xyz(extent, z, true, 'WGS84');
    assert.ok(xyz.minX <= xyz.maxX);
    assert.ok(xyz.minY <= xyz.maxY);
  }
});

test('convert', () => {
  assert.deepEqual(sm.convert(MAX_EXTENT_WGS84, '900913'), MAX_EXTENT_MERC);
  assert.deepEqual(sm.convert(MAX_EXTENT_MERC, 'WGS84'), MAX_EXTENT_WGS84);
});

test('extents', () => {
  assert.deepEqual(sm.convert([-240, -90, 240, 90], '900913'), MAX_EXTENT_MERC);
  assert.deepEqual(sm.xyz([-240, -90, 240, 90], 4, true, 'WGS84'), {
    minX: 0,
    minY: 0,
    maxX: 15,
    maxY: 15,
  });
});

test('ll', () => {
  assert.deepEqual(sm.ll([200, 200], 9), [-179.45068359375, 85.00351401304403]);
  assert.deepEqual(
    sm.ll([200, 200], 8.6574),
    [-179.3034449476476, 84.99067388699072],
  );
});

test('ll, high precision float', () => {
  const withInt = sm.ll([200, 200], 4);
  const withFloat = sm.ll([200, 200], 4.0000000001);

  function round(val) {
    return Math.round(val * 1e6) / 1e6;
  }

  assert.equal(round(withInt[0]), round(withFloat[0]));
  assert.equal(round(withInt[1]), round(withFloat[1]));
});

test('px', () => {
  assert.deepEqual(sm.px([-179, 85], 9), [364, 215]);
  assert.deepEqual(
    sm.px([-179, 85], 8.6574),
    [287.12734093961626, 169.30444219392666],
  );
  assert.deepEqual(sm.px([250, 3], 4), [4096, 2014]);
  assert.deepEqual(smAnti.px([250, 3], 4), [4892, 2014]);
  assert.deepEqual(smAnti.px([400, 3], 4), [6599, 2014]);
  assert.deepEqual(smAnti.px([400, 3], 4), [6599, 2014]);
});
