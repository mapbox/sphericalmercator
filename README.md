`node-sphericalmercator` provides projection math for converting between
mercator meters, screen pixels (of 256x256 or configurable-size tiles), and
latitude/longitude.

Compatible with nodejs packages and in-browser.

```javascript
// By default, precomputes up to z30
var myProjectionObject = new SphericalMercator({
    size: 256
});
```
