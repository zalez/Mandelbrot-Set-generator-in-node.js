/*
 * mandelbrot-engine.js
 *
 * A node.js implementation of the Mandelbrot set.
 * Basic engine that generates an array of results for the mandelbrot iteration.
 * This array can then be mixed with a colormap to create nice pictures.
 *
 */

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
  var result = 0;

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
      result[pos++] = iterate(zre, zim) / max; // Normalized result in [0..1)
    }
  }

  return result;
}
