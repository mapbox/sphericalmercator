import {
  D2R,
  R2D,
  A,
  MAXEXTENT,
  SPHERICAL_MERCATOR_SRS,
  WGS84,
} from './constants';

interface Options {
  size?: number;
  antimeridian?: boolean;
}

interface XYZ {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

type XY = [number, number];
type LonLat = [number, number];
type Zoom = number;
type West = number;
type South = number;
type East = number;
type North = number;
type BBox = [West, South, East, North];
type SRS = typeof SPHERICAL_MERCATOR_SRS | typeof WGS84;

const cache: Record<any, any> = {};
function isFloat(n: number): boolean {
  return Number(n) === n && n % 1 !== 0;
}

export class SphericalMercator {
  #size: number;
  #expansion: 1 | 2;
  #Bc: number[];
  #Cc: number[];
  #zc: number[];
  #Ac: number[];

  constructor(options: Options = {}) {
    this.#size = options.size || 256;
    this.#expansion = options.antimeridian ? 2 : 1;

    if (!cache[this.#size]) {
      let size = this.#size;
      const c: Record<any, any> = (cache[this.#size] = {});
      c.Bc = [];
      c.Cc = [];
      c.zc = [];
      c.Ac = [];
      for (let d = 0; d < 30; d++) {
        c.Bc.push(size / 360);
        c.Cc.push(size / (2 * Math.PI));
        c.zc.push(size / 2);
        c.Ac.push(size);
        size *= 2;
      }
    }
    this.#Bc = cache[this.#size].Bc;
    this.#Cc = cache[this.#size].Cc;
    this.#zc = cache[this.#size].zc;
    this.#Ac = cache[this.#size].Ac;
  }

  public px(ll: LonLat, zoom: Zoom): XY {
    if (isFloat(zoom)) {
      const size = this.#size * Math.pow(2, zoom);
      const d = size / 2;
      const bc = size / 360;
      const cc = size / (2 * Math.PI);
      const ac = size;
      const f = Math.min(Math.max(Math.sin(D2R * ll[1]), -0.9999), 0.9999);
      let x = d + ll[0] * bc;
      let y = d + 0.5 * Math.log((1 + f) / (1 - f)) * -cc;
      x > ac * this.#expansion && (x = ac * this.#expansion);
      y > ac && (y = ac);
      //(x < 0) && (x = 0);
      //(y < 0) && (y = 0);
      return [x, y];
    } else {
      const d = this.#zc[zoom];
      const f = Math.min(Math.max(Math.sin(D2R * ll[1]), -0.9999), 0.9999);
      let x = Math.round(d + ll[0] * this.#Bc[zoom]);
      let y = Math.round(
        d + 0.5 * Math.log((1 + f) / (1 - f)) * -this.#Cc[zoom],
      );
      x > this.#Ac[zoom] * this.#expansion &&
        (x = this.#Ac[zoom] * this.#expansion);
      y > this.#Ac[zoom] && (y = this.#Ac[zoom]);
      //(x < 0) && (x = 0);
      //(y < 0) && (y = 0);
      return [x, y];
    }
  }

  public ll(px: XY, zoom: Zoom): LonLat {
    if (isFloat(zoom)) {
      const size = this.#size * Math.pow(2, zoom);
      const bc = size / 360;
      const cc = size / (2 * Math.PI);
      const zc = size / 2;
      const g = (px[1] - zc) / -cc;
      const lon = (px[0] - zc) / bc;
      const lat = R2D * (2 * Math.atan(Math.exp(g)) - 0.5 * Math.PI);
      return [lon, lat];
    } else {
      const g = (px[1] - this.#zc[zoom]) / -this.#Cc[zoom];
      const lon = (px[0] - this.#zc[zoom]) / this.#Bc[zoom];
      const lat = R2D * (2 * Math.atan(Math.exp(g)) - 0.5 * Math.PI);
      return [lon, lat];
    }
  }

  public convert(bbox: BBox, to: SRS): BBox {
    if (to === SPHERICAL_MERCATOR_SRS) {
      return [
        ...this.forward(bbox.slice(0, 2) as LonLat),
        ...this.forward(bbox.slice(2, 4) as LonLat),
      ];
    } else {
      return [
        ...this.inverse(bbox.slice(0, 2) as XY),
        ...this.inverse(bbox.slice(2, 4) as XY),
      ];
    }
  }

  public inverse(xy: XY): LonLat {
    return [
      (xy[0] * R2D) / A,
      (Math.PI * 0.5 - 2.0 * Math.atan(Math.exp(-xy[1] / A))) * R2D,
    ];
  }

  public forward(ll: LonLat): XY {
    const xy: LonLat = [
      A * ll[0] * D2R,
      A * Math.log(Math.tan(Math.PI * 0.25 + 0.5 * ll[1] * D2R)),
    ];
    // if xy value is beyond maxextent (e.g. poles), return maxextent.
    xy[0] > MAXEXTENT && (xy[0] = MAXEXTENT);
    xy[0] < -MAXEXTENT && (xy[0] = -MAXEXTENT);
    xy[1] > MAXEXTENT && (xy[1] = MAXEXTENT);
    xy[1] < -MAXEXTENT && (xy[1] = -MAXEXTENT);
    return xy;
  }

  public bbox(
    x: number,
    y: number,
    zoom: Zoom,
    tmsStyle?: boolean,
    srs?: string,
  ): BBox {
    // Convert xyz into bbox with srs WGS84
    if (tmsStyle) {
      y = Math.pow(2, zoom) - 1 - y;
    }
    // Use +y to make sure it's a number to avoid inadvertent concatenation.
    const ll: LonLat = [x * this.#size, (+y + 1) * this.#size]; // lower left
    // Use +x to make sure it's a number to avoid inadvertent concatenation.
    const ur: LonLat = [(+x + 1) * this.#size, y * this.#size]; // upper right
    const bbox: BBox = [...this.ll(ll, zoom), ...this.ll(ur, zoom)];

    // If web mercator requested reproject to 900913.
    if (srs === SPHERICAL_MERCATOR_SRS)
      return this.convert(bbox, SPHERICAL_MERCATOR_SRS);

    return bbox as BBox;
  }

  public xyz(bbox: BBox, zoom: Zoom, tmsStyle?: boolean, srs?: SRS): XYZ {
    // If web mercator provided reproject to WGS84.
    const box =
      srs === SPHERICAL_MERCATOR_SRS ? this.convert(bbox, WGS84) : bbox;

    const ll: LonLat = [box[0], box[1]]; // lower left
    const ur: LonLat = [box[2], box[3]]; // upper right
    const px_ll = this.px(ll, zoom);
    const px_ur = this.px(ur, zoom);
    // Y = 0 for XYZ is the top hence minY uses px_ur[1].
    const x = [
      Math.floor(px_ll[0] / this.#size),
      Math.floor((px_ur[0] - 1) / this.#size),
    ];
    const y = [
      Math.floor(px_ur[1] / this.#size),
      Math.floor((px_ll[1] - 1) / this.#size),
    ];
    const bounds = {
      minX: Math.min.apply(Math, x) < 0 ? 0 : Math.min.apply(Math, x),
      minY: Math.min.apply(Math, y) < 0 ? 0 : Math.min.apply(Math, y),
      maxX: Math.max.apply(Math, x),
      maxY: Math.max.apply(Math, y),
    };
    if (tmsStyle) {
      const tms = {
        minY: Math.pow(2, zoom) - 1 - bounds.maxY,
        maxY: Math.pow(2, zoom) - 1 - bounds.minY,
      };
      bounds.minY = tms.minY;
      bounds.maxY = tms.maxY;
    }

    return bounds;
  }
}
