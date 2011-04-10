/*
 * mandelbrotnode.js
 *
 * A node.js implementation of the Mandelbrot set. Let's see where this
 * leads us.
 *
 */

// Modules we want to use.
var http = require('http');
var Png = require('png').Png;

// Constants
const RE_MIN = -2.5;
const RE_MAX = 1.0;
const RE_SIZE = 800.0;
const RE_INCR = (RE_MAX - RE_MIN) / RE_SIZE;
const IM_MIN = -1.0;
const IM_MAX = 1.0;
const IM_SIZE = 600.0;
const IM_INCR = (IM_MAX - IM_MIN) / IM_SIZE;
const MAX_ITER = 1000;

/*
 * Functions that we'll attach to complex numbers as methods.
 */

// Add a complex number to this one
function complexAdd(c) {
  this.re = this.re + c.re;
  this.im = this.im + c.im;
}

// Square a complex number
function complexSq() {
  var tmp = this.re * this.re - this.im * this.im;
  this.im = 2 * this.re * this.im;
  this.re = tmp;
}

// Compute the squared modulus (It's cheaper than the real modulus)
function complexMod2() {
  return this.re * this.re + this.im * this.im;
}

// Find out whether this complex number is in the mandelbrot set or not.
// Accepts the maximun number of iterations to perform.
function iterate(max) {
  var i = 0;
  var c = new complex(0, 0);

  while (c.mod2() <= 4 && i < max) {
    c.sq();
    c.add(this);
    i = i + 1;
  }

  if (i == max) {
    return 0;
  } else {
    mu = i + 1.0 - Math.log(Math.log(Math.sqrt(c.mod2()))) / Math.log2;
    return mu;
  }
}

// A constructor for a complex number, including methods.
function complex(re, im) {
  // Our individual values
  this.re = re;
  this.im = im;

  // Standard methods for complex numbers
  this.add = complexAdd;
  this.sq = complexSq;
  this.mod2 = complexMod2;
  this.iterate = iterate;
}

// Our main function that does the work.
// Draw an ASCII art mandelbrot set.
function render() {
  var z = new complex (0, 0);
  var buffer = new Buffer(RE_SIZE * IM_SIZE * 3);
  var rowpos = 0;
  var pos = 0;
  var result = 0;
  var color = 0;

  for (y = IM_MIN; y < IM_MAX; y = y + IM_INCR) {
    for (x = RE_MIN; x < RE_MAX; x = x + RE_INCR) {
      z.re = x;
      z.im = y;

      result = z.iterate(MAX_ITER);
      color = (result / MAX_ITER) * 256 * 256 * 256;
      
      buffer[pos++] = Math.abs(color / (256 * 256));
      buffer[pos++] = Math.abs((color / 256) % 256);
      buffer[pos++] = Math.abs(color % 256);
    }
  }

  return buffer;
}

// The main wrapper for stuff to do
function doit() {
  var png = new Png(render(), RE_SIZE, IM_SIZE, 'rgb');
  var png_image = png.encodeSync();
  return png_image.toString('binary');
}
 
var server = http.createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "image/png" })
  res.end(doit(), 'binary');
});
 
server.listen(process.env.PORT || 8001);

