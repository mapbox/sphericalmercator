var sm = new (require('..')),
    assert = require('assert');

var MAX_EXTENT_MERC = [-20037508.342789244,-20037508.342789244,20037508.342789244,20037508.342789244];
var MAX_EXTENT_WGS84 = [-180,-85.0511287798066,180,85.0511287798066];

it('bbox', function() {
    assert.deepEqual(
        sm.bbox(0,0,0,true,'WGS84'),
        [-180,-85.05112877980659,180,85.0511287798066],
        '[0,0,0] converted to proper bbox.'
    );
    assert.deepEqual(
        sm.bbox(0,0,1,true,'WGS84'),
        [-180,-85.05112877980659,0,0],
        '[0,0,1] converted to proper bbox.'
    );
});

it('xyz', function() {
    assert.deepEqual(
        sm.xyz([-180,-85.05112877980659,180,85.0511287798066],0,true,'WGS84'),
        {minX:0,minY:0,maxX:0, maxY:0},
        'World extents converted to proper tile ranges.'
    );
    assert.deepEqual(
        sm.xyz([-180,-85.05112877980659,0,0],1,true,'WGS84'),
        {minX:0,minY:0,maxX:0, maxY:0},
        'SW converted to proper tile ranges.'
    );
});

it('convert', function() {
    assert.deepEqual(
        sm.convert(MAX_EXTENT_WGS84,'900913'),
        MAX_EXTENT_MERC
    );
    assert.deepEqual(
        sm.convert(MAX_EXTENT_MERC,'WGS84'),
        MAX_EXTENT_WGS84
    );
});

it('extents', function() {
    assert.deepEqual(
        sm.convert([-240,-90,240,90],'900913'),
        MAX_EXTENT_MERC
    );
    assert.deepEqual(
        sm.xyz([-240,-90,240,90],4,true,'WGS84'), {
            minX: -3,
            minY: 0,
            maxX: 15,
            maxY: 20
        },
        'Maximum extents enforced on conversion to tile ranges.'
    );
});
