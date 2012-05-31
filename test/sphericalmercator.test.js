var assert = require('assert');
var fs = require('fs');
var path = require('path');
var sm = new (require('..'));


describe('Unit tests', function() {

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
        sm.convert([-180,-85.05112877980659,180,85.0511287798066],'900913'),
        [-20037508.34,-20037508.34,20037508.34,20037508.34],
        'WGS84 converted to 900913.'
    );
    assert.deepEqual(
        sm.convert([-20037508.34,-20037508.34,20037508.34,20037508.34],'WGS84'),
        [-179.99999997494382,-85.05112877764509,179.99999997494382,85.05112877764508],
        '900913 converted to WGS84.'
    );
});

it('extents', function() {
    assert.deepEqual(
        sm.convert([-240,-90,240,90],'900913'),
        [-20037508.34,-20037508.34,20037508.34,20037508.34],
        'Maximum extents enforced on conversion to 900913.'
    );
    assert.deepEqual(
        sm.xyz([-240,-90,240,90],4,true,'WGS84'),
        {minX:-3,minY:0,maxX:15, maxY:20}, // Result of https://github.com/mapbox/node-sphericalmercator/issues/1
        //{minX:0,minY:0,maxX:15, maxY:15},
        'Maximum extents enforced on conversion to tile ranges.'
    );
});

});

var bboxes = fs.readFileSync(path.join(__dirname, 'fixtures/bboxes.csv'), 'utf8').split("\n");
bboxes = bboxes.slice(0, 10);

describe('Conversion', function() {
    bboxes.forEach(function(row) {
        // ISO, WGS84, 900913
        cols= row.split(',');
        cols[1] = cols[1].split(' ');
        cols[2] = cols[2].split(' ');

        // TODO ALL TESTS FAIL - Decide on tolerance!
        it('should convert ' + cols[0] + ' to 900913', function(){
            assert.deepEqual(sm.convert(cols[1], '900913'), cols[2]);
        });
        it('should convert ' + cols[0] + ' to WGS84', function(){
            assert.deepEqual(sm.convert(cols[2], 'WGS84'), cols[1]);
        });
    });
});
