[![Run tests](https://github.com/mapbox/sphericalmercator/actions/workflows/test.yml/badge.svg)](https://github.com/mapbox/sphericalmercator/actions/workflows/test.yml)

# sphericalmercator

Provides projection math for converting between mercator meters, screen pixels (of 256x256 or configurable-size tiles), and latitude/longitude. Compatible with nodejs packages and in-browser.

See also 

* [tilebelt](https://github.com/mapbox/tilebelt) provides ZXY tile math utilities in javascript
* [mercantile](https://github.com/sgillies/mercantile) provides similar utilities for projection and tile math in Python


## Installation

`npm install @mapbox/sphericalmercator`

## API

Some datatypes are assumed to be arrays: `ll` is `[lon, lat]`, `xy` and `px` are `[x, y]`.

```javascript
import { SphericalMercator } from '@mapbox/sphericalmercator';

// By default, precomputes up to z30
const merc = new SphericalMercator({
  size: 256,
  antimeridian: true
});
```

### `px(ll, zoom)`

Convert lon, lat to screen pixel x, y from 0, 0 origin, at a certain zoom level. The inverse of `ll`. If `antimeridian: true` is passed on initialization of the `SphericalMercator` object, this method will support converting longitude values up to 360°.

### `ll(px, zoom)`

Convert screen pixel value to lon, lat, at a certain zoom level. The inverse of `px`.

### `bbox(x, y, zoom, tmsStyle, srs)`

Convert tile xyz value to bbox of the form `[w, s, e, n]`

* `x` {Number} x (longitude) number.
* `y` {Number} y (latitude) number.
* `zoom` {Number} zoom.
* `tmsStyle` {Boolean} whether to compute using [tms-style](https://en.wikipedia.org/wiki/Tile_Map_Service). (optional, default false)
* `srs` {String} projection for resulting bbox (WGS84|900913). (optional, default WGS84)

Returns bbox array of values in form `[w, s, e, n]`.

### `xyz(bbox, zoom, tmsStyle, srs)`

Convert bbox to xyz bounds

* `bbox` {Number} bbox in the form `[w, s, e, n]`.
* `zoom` {Number} zoom.
* `tmsStyle` {Boolean} whether to compute using [tms-style](https://en.wikipedia.org/wiki/Tile_Map_Service). (optional, default false)
* `srs` {String} projection of input bbox (WGS84|900913). (optional, default WGS84)

Returns {Object} XYZ bounds containing minX, maxX, minY, maxY properties.

### `convert(bbox, to)`

Convert bbox from 900913 to WGS84 or vice versa

* `bbox` {Number} bbox in the form `[w, s, e, n]`.
* `to` {String} projection of resulting bbox (WGS84|900913). (optional, default WGS84)

Returns bbox array of values in form `[w, s, e, n]`.

### `forward(ll)`

Convert lon, lat values to mercator x, y

### `inverse(xy)`

Convert mercator x, y values to lon, lat

## Developing

```sh
npm ci          # install
npm test        # run tests
npm run format  # format files with prettier
```
