## v2.0.0

```js
import { SphericalMercator } from '@mapbox/sphericalmercator'
```

- No default module export
- Migrate project to Typescript
- Use GitHub Actions
- Test with Node.js v20.x
- Use vitest for running tests
- Remove the bin commands, which were undocumented and not tested

## v1.2.0

- Add support for calculating `px` values for longitudes >180 (@riastrad) [#44](https://github.com/mapbox/sphericalmercator/pull/44)

## v1.1.0

- Add support for floating point zoom levels in `ll` and `px` methods (@orionstein) [#32](https://github.com/mapbox/sphericalmercator/pull/32)

## v1.0.5

- If any x or y produced by `.xyz()` are negative, set them to zero
