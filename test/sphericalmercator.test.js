var tape = require('tape');
var sm = new (require('..'));

var MAX_EXTENT_MERC = [-20037508.342789244,-20037508.342789244,20037508.342789244,20037508.342789244];
var MAX_EXTENT_WGS84 = [-180,-85.0511287798066,180,85.0511287798066];

tape('bbox', function(assert) {
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
    assert.end();
});

tape('xyz', function(assert) {
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
    assert.end();
});

tape('xyz-broken', function(assert) {
    var extent = [ -0.087891, 40.95703, 0.087891, 41.044916 ]
    var xyz = sm.xyz(extent, 3, true, 'WGS84');
    assert.equal(xyz.minX <= xyz.maxX, true, 'x: ' + xyz.minX + ' <= ' + xyz.maxX + ' for ' + JSON.stringify(extent));
    assert.equal(xyz.minY <= xyz.maxY, true, 'y: ' + xyz.minY + ' <= ' + xyz.maxY + ' for ' + JSON.stringify(extent));
    assert.end();
});

tape('xyz-negative', function(assert) {
    var extent = [-112.5, 85.0511, -112.5, 85.0511];
    var xyz = sm.xyz(extent, 0);
    assert.equal(xyz.minY, 0, 'returns zero for y value');
    assert.end();
});

tape('xyz-fuzz', function(assert) {
    for (var i = 0; i < 1000; i++) {
        var x = [-180 + (360*Math.random()), -180 + (360*Math.random())];
        var y = [-85 + (170*Math.random()), -85 + (170*Math.random())];
        var z = Math.floor(22*Math.random());
        var extent = [
            Math.min.apply(Math, x),
            Math.min.apply(Math, y),
            Math.max.apply(Math, x),
            Math.max.apply(Math, y)
        ];
        var xyz = sm.xyz(extent, z, true, 'WGS84');
        if (xyz.minX > xyz.maxX) {
            assert.equal(xyz.minX <= xyz.maxX, true, 'x: ' + xyz.minX + ' <= ' + xyz.maxX + ' for ' + JSON.stringify(extent));
        }
        if (xyz.minY > xyz.maxY) {
            assert.equal(xyz.minY <= xyz.maxY, true, 'y: ' + xyz.minY + ' <= ' + xyz.maxY + ' for ' + JSON.stringify(extent));
        }
    }
    assert.end();
});

tape('convert', function(assert) {
    assert.deepEqual(
        sm.convert(MAX_EXTENT_WGS84,'900913'),
        MAX_EXTENT_MERC
    );
    assert.deepEqual(
        sm.convert(MAX_EXTENT_MERC,'WGS84'),
        MAX_EXTENT_WGS84
    );
    assert.end();
});

tape('extents', function(assert) {
    assert.deepEqual(
        sm.convert([-240,-90,240,90],'900913'),
        MAX_EXTENT_MERC
    );
    assert.deepEqual(
        sm.xyz([-240,-90,240,90],4,true,'WGS84'), {
            minX: 0,
            minY: 0,
            maxX: 15,
            maxY: 15
        },
        'Maximum extents enforced on conversion to tile ranges.'
    );
    assert.end();
});
