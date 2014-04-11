#!/usr/bin/env node
var SphericalMercator = require('../sphericalmercator');
var sm = new SphericalMercator({ size: 256 });

function usage() {
    console.log("bbox <west> <south> <east> <north> <zoom> [--tms_style | -t] [900913 | WGS84]");
}

process.argv.shift(); // drop the `node`
process.argv.shift(); // drop the `path to executable`

if (process.argv.length < 5) return usage();

var w = process.argv.shift();
var s = process.argv.shift();
var e = process.argv.shift();
var n = process.argv.shift();
var z = process.argv.shift();

var tms_style = process.argv.indexOf('--tms_style') !== -1 || process.argv.indexOf('-t') !== -1;
var proj = process.argv.indexOf('900913') !== -1 ? '900913' : 'WGS84';

var xyz = sm.xyz([w,s,e,n], z, tms_style, proj);

console.log(JSON.stringify(xyz));