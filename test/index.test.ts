import { test, expect } from 'vitest';
import { SphericalMercator } from '../src';

const MAX_EXTENT_MERC = [
  -20037508.342789244, -20037508.342789244, 20037508.342789244,
  20037508.342789244,
];
const MAX_EXTENT_WGS84 = [-180, -85.0511287798066, 180, 85.0511287798066];

const sm = new SphericalMercator();
const smAnti = new SphericalMercator({ antimeridian: true });

test('bbox', () => {
  expect(sm.bbox(0, 0, 0, true, 'WGS84')).toStrictEqual([
    -180, -85.05112877980659, 180, 85.0511287798066,
  ]);
  expect(sm.bbox(0, 0, 1, true, 'WGS84')).toStrictEqual([
    -180, -85.05112877980659, 0, 0,
  ]);
});

test('xyz', () => {
  expect(
    sm.xyz([-180, -85.05112877980659, 180, 85.0511287798066], 0, true, 'WGS84'),
  ).toStrictEqual({ minX: 0, minY: 0, maxX: 0, maxY: 0 });
  expect(
    sm.xyz([-180, -85.05112877980659, 0, 0], 1, true, 'WGS84'),
  ).toStrictEqual({ minX: 0, minY: 0, maxX: 0, maxY: 0 });
});

test('xyz, broken', () => {
  const extent = [-0.087891, 40.95703, 0.087891, 41.044916];
  const xyz = sm.xyz(extent as any, 3, true, 'WGS84');
  expect(xyz.minX).toBeLessThanOrEqual(xyz.maxX);
  expect(xyz.minY).toBeLessThanOrEqual(xyz.maxY);
});

test('xyz, negative', () => {
  const extent = [-112.5, 85.0511, -112.5, 85.0511];
  const xyz = sm.xyz(extent as any, 0);
  expect(xyz.minY).toBe(0);
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
    const xyz = sm.xyz(extent as any, z, true, 'WGS84');
    if (xyz.minX > xyz.maxX) {
      expect(xyz.minX).toBeLessThanOrEqual(xyz.maxX);
    }
    if (xyz.minY > xyz.maxY) {
      expect(xyz.minY).toBeLessThanOrEqual(xyz.maxY);
    }
  }
});

test('convert', () => {
  expect(sm.convert(MAX_EXTENT_WGS84 as any, '900913')).toStrictEqual(
    MAX_EXTENT_MERC,
  );
  expect(sm.convert(MAX_EXTENT_MERC as any, 'WGS84')).toStrictEqual(
    MAX_EXTENT_WGS84,
  );
});

test('extents', () => {
  expect(sm.convert([-240, -90, 240, 90], '900913')).toStrictEqual(
    MAX_EXTENT_MERC,
  );
  expect(sm.xyz([-240, -90, 240, 90], 4, true, 'WGS84')).toStrictEqual({
    minX: 0,
    minY: 0,
    maxX: 15,
    maxY: 15,
  });
});

test('ll', () => {
  expect(sm.ll([200, 200], 9)).toStrictEqual([
    -179.45068359375, 85.00351401304403,
  ]);
  expect(sm.ll([200, 200], 8.6574)).toStrictEqual([
    -179.3034449476476, 84.99067388699072,
  ]);
});

test('ll, high precision float', () => {
  const withInt = sm.ll([200, 200], 4);
  const withFloat = sm.ll([200, 200], 4.0000000001);

  function round(val: any) {
    return parseFloat(val).toFixed(6);
  }

  expect(round(withInt[0])).toEqual(round(withFloat[0]));
  expect(round(withInt[1])).toEqual(round(withFloat[1]));
});

test('px', () => {
  expect(sm.px([-179, 85], 9)).toStrictEqual([364, 215]);
  expect(sm.px([-179, 85], 8.6574)).toStrictEqual([
    287.12734093961626, 169.30444219392666,
  ]);
  expect(sm.px([250, 3], 4)).toStrictEqual([4096, 2014]);
  expect(smAnti.px([250, 3], 4)).toStrictEqual([4892, 2014]);
  expect(smAnti.px([400, 3], 4)).toStrictEqual([6599, 2014]);
  expect(smAnti.px([400, 3], 4)).toStrictEqual([6599, 2014]);
});
