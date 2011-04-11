/*
 * simplemandelbrot.js
 *
 * A node.js implementation of the Mandelbrot set.
 * Trying to be as simple as possible.
 *
 */

// Modules we want to use.
var Png = require('png').Png;

/*
 * Constants
 */

// Image constants.
const X_SIZE = 800.0;
const Y_SIZE = 600.0;

// Algorithm constants. Sometimes derived from image constants.

// Which subset to render?
const RE_CENTER = -0.75; // X-Center of the picture will represent this value on the real axis.
const IM_CENTER = 0.0;   // Y-Center of the picture will represent this value on the imaginary axis.
const PXPERUNIT = 200.0;      // Amount of pixels that map to a distance of 1 in the real/imaginary axis.

// The following are derivatives of the above.
const RE_MIN = RE_CENTER - (X_SIZE / PXPERUNIT / 2);
const RE_MAX = RE_CENTER + (X_SIZE / PXPERUNIT / 2);
const RE_INCR = (RE_MAX - RE_MIN) / X_SIZE;

const IM_MIN = IM_CENTER - (Y_SIZE / PXPERUNIT / 2);
const IM_MAX = IM_CENTER + (Y_SIZE / PXPERUNIT / 2);
const IM_INCR = (IM_MAX - IM_MIN) / Y_SIZE;

// Other iteration parameters.
const MAX_ITER = 100;
const ESCAPE_RADIUS = 2;
const ESCAPE_RADIUS2 = ESCAPE_RADIUS * ESCAPE_RADIUS;

/*
 * Functions that we'll attach to complex numbers as methods.
 */

// Find out whether this complex number is in the mandelbrot set or not.
// cr: Real part of complex number c to iterate with.
// ci: Imaginary part of complex number c to iterate with.
//
// Returns a value mu, which is the number of iterations needed to escape the equation
// (or 0 if the formula never escaped), plus some extra fractional value to allow for
// smooth coloring.
function iterate(cr, ci) {
  var zr = 0;
  var zi = 0;
  var t  = 0; // A temporary store.
  var m2 = 0; // The modulo of the complex number z, squared.

  for (var i = 0; i < MAX_ITER; i++) {
    // z = z^2 ...
    t = zr * zr - zi * zi;
    zi = 2 * zr * zi;
    zr = t;

    // ... + c    
    zr += cr;
    zi += ci;

    // Test if we escaped the equation
    m2 = zr * zr + zi * zi;
    if (m2 > ESCAPE_RADIUS2) {
      return i + 1.0 - Math.log(Math.log(Math.sqrt(m2))) / Math.LN2;
    }
  }

  return 0;
}

// Our main function that does the work.
function render() {
  var buffer = new Buffer(X_SIZE * Y_SIZE * 3);
  var pos = 0;
  var result = 0;

  for (y = IM_MIN; y < IM_MAX; y = y + IM_INCR) {
    for (x = RE_MIN; x < RE_MAX; x = x + RE_INCR) {
      result = iterate(x,y) / MAX_ITER; // Normalized result in [0..1)

      // Some fancy sine wave magic to generate interesting colors.
      if (result) {
        buffer[pos++] = Math.floor((Math.sin(result * 2 * Math.PI) + 1) * 256 / 2);
        buffer[pos++] = Math.floor((Math.sin(result * 3 * Math.PI) + 1 ) * 256 / 2);
        buffer[pos++] = Math.floor((Math.sin(result * Math.PI + Math.PI / 2) + 1) * 256 / 2);
      } else {
        buffer[pos++] = 0;
        buffer[pos++] = 0;
        buffer[pos++] = 0;
      }
    }
  }

  return buffer;
}

// The main function to export.
exports.render = function () {
  var png = new Png(render(), X_SIZE, Y_SIZE, 'rgb');
  var png_image = png.encodeSync();
  return png_image.toString('binary');
}
