[![Build Status](https://secure.travis-ci.org/mapbox/node-sphericalmercator.svg?branch=master)](http://travis-ci.org/mapbox/node-sphericalmercator)

`node-sphericalmercator` provides projection math for converting between
mercator meters, screen pixels (of 256x256 or configurable-size tiles), and
latitude/longitude.

Compatible with nodejs packages and in-browser.

## Installation

`npm install @mapbox/sphericalmercator`

## API

Some datatypes are assumed to be arrays: `ll` is `[lon, lat]`, `xy` and `px` are
`[x, y]`.

```javascript
// By default, precomputes up to z30
var merc = new SphericalMercator({
    size: 256
});
```

### `px(ll, zoom)`

Convert lon, lat to screen pixel x, y from 0, 0 origin, at a certain zoom level.
The inverse of `ll`

### `ll(px, zoom)`

Convert screen pixel value to lon, lat, at a certain zoom level. The inverse
of `px`

### `bbox(x, y, zoom, tms_style, srs)`

Convert tile xyz value to bbox of the form `[w, s, e, n]`

* `x` {Number} x (longitude) number.
* `y` {Number} y (latitude) number.
* `zoom` {Number} zoom.
* `tms_style` {Boolean} whether to compute using tms-style. (optional, default false)
* `srs` {String} projection for resulting bbox (WGS84|900913). (optional, default WGS84)

Returns bbox array of values in form `[w, s, e, n]`.

### `xyz(bbox, zoom, tms_style, srs)`

Convert bbox to xyz bounds

* `bbox` {Number} bbox in the form `[w, s, e, n]`.
* `zoom` {Number} zoom.
* `tms_style` {Boolean} whether to compute using tms-style. (optional, default false)
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

## See Also

* [mercantile](https://github.com/sgillies/mercantile) provides similar utilities for projection and tile math in Python
