#!/usr/bin/env node
var SphericalMercator = require('../sphericalmercator');
var sm = new SphericalMercator({ size: 256 });

function usage() {
    console.log("toWgs84 <x> <y>");
}

process.argv.shift(); // drop the `node`
process.argv.shift(); // drop the `path to executable`

if (process.argv.length < 2) return usage();

var x = process.argv.shift();
var y = process.argv.shift();

var ll = sm.inverse([x,y]);

console.log(JSON.stringify(ll));