#!/usr/bin/env node
var SphericalMercator = require('../sphericalmercator');
var sm = new SphericalMercator({ size: 256 });

function usage() {
    console.log("bbox <x> <y> <zoom> [--tms_style | -t] [900913 | WGS84]");
}

process.argv.shift(); // drop the `node`
process.argv.shift(); // drop the `path to executable`

if (process.argv.length < 3) return usage();
var x = process.argv.shift();
var y = process.argv.shift();
var z = process.argv.shift();

var tms_style = process.argv.indexOf('--tms_style') !== -1 || process.argv.indexOf('-t') !== -1;
var proj = process.argv.indexOf('900913') !== -1 ? '900913' : 'WGS84';

var bbox = sm.bbox(x, y, z, tms_style, proj)

console.log(JSON.stringify(bbox));