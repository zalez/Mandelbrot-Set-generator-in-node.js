/*
 * mandelbrot-engine.js
 *
 * A node.js implementation of the Mandelbrot set.
 * Basic engine that generates an array of results for the mandelbrot iteration.
 * This array can then be mixed with a colormap to create nice pictures.
 *
 */

// Find out whether this complex number is in the mandelbrot set or not.
// cr: Real part of complex number c to iterate with.
// ci: Imaginary part of complex number c to iterate with.
//
// Returns a value mu, which is the number of iterations needed to escape the e
// (or 0 if the formula never escaped), plus some extra fractional value to all
// smooth coloring.
function iterate(cr, ci, max) {
  var zr = 0;
  var zi = 0;
  var t  = 0; // A temporary store.
  var m2 = 0; // The modulo of the complex number z, squared.
  var zr2 = 0; // Real part of z, squared. Will be reused in this variable late
  var zi2 = 0; // Imaginary part of z, squared.

  for (var i = 0; i < max; i++) {
    // z = z^2 ...
    t = zr2  - zi2;
    zi = 2 * zr * zi;
    zr = t;

    // ... + c    
    zr += cr;
    zi += ci;

    // To be reused in the test and the next iteration.
    zr2 = zr * zr;
    zi2 = zi * zi;

    // Test if we escaped the equation
    m2 = zr2 + zi2
    if (m2 > 4) { // Mandelbrot escape radius is 2, hence 4 since we compare to
      return i + 1.0 - Math.log(Math.log(Math.sqrt(m2))) / Math.LN2;
    }
  }

  return 0;
}

/*
 * Our main function that does the work.
 * Arguments:
 * xsize, ysize: Image size.
 * re, im: Real and imaginary part of the center of the image.
 * ppu: Number of pixels in the image per unit in the complex plane (zoom factor).
 * max: Maximum value to iterate to.
 * Returns: An xsize * ysize array with iteration results.
 */
exports.render = function (xsize, ysize, re, im, ppu, max) {
  var minre = re - xsize / ppu / 2;
  var minim = im - ysize / ppu / 2;
  var inc = 1 / ppu;

  var zre = 0;
  var zim = 0;
  var x4 = 0;
  var y2 = 0;
  var q = 0;
  var t = 0;

  var result = new Array(xsize * ysize);
  var pos = 0;

  for (y = 0; y < ysize; y++) {
    zim = minim + y * inc;
    for (x = 0; x < xsize; x++) {
      zre = minre + x * inc;

      // Test if the point is within the cardioid bulb to avoid calculation...
      x4 = zre - 0.25;
      y2 = zim * zim;
      q = x4 * x4 + y2;
      t = q * (q + x4);
      if (t < y2 * 0.25) {
        result[pos++] = 0;
      } else
      // ...Maybe it's within the period-2-bulb...
      if (((re + 1) * (re + 1) + y2) < (1 / 16)) {
        result[pos++] = 0;
      } else 
      // OK we have to go through the full calculation.
      result[pos++] = iterate(zre, zim, max) / max; // Normalized result in [0..1)
    }
  }

  return result;
}
