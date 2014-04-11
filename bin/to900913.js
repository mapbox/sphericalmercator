#!/usr/bin/env node
var SphericalMercator = require('../sphericalmercator');
var sm = new SphericalMercator({ size: 256 });

function usage() {
    console.log("to900913 <lon> <lat>");
}

process.argv.shift(); // drop the `node`
process.argv.shift(); // drop the `path to executable`

if (process.argv.length < 2) return usage();

var lon = process.argv.shift();
var lat = process.argv.shift();

var xy = sm.forward([lon,lat]);

console.log(JSON.stringify(xy));