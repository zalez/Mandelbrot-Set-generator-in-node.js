/*
 * mandelbrot-engine.js
 *
 * A node.js implementation of the Mandelbrot set.
 * Basic engine that generates an array of results for the mandelbrot iteration.
 * This array can then be mixed with a colormap to create nice pictures.
 *
 */

/*
 * Find out whether this complex number is in the mandelbrot set or not.
 * cr: Real part of complex number c to iterate with.
 * ci: Imaginary part of complex number c to iterate with.
 *
 * Returns a value mu, which is the number of iterations needed to escape the e
 * (or 0 if the formula never escaped), plus some extra fractional value to all
 * smooth coloring.
 *
 * Simple, basic implementation without any optimizations.
 */
function iterate_basic(cr, ci, max) {
  var zr = 0;
  var zi = 0;
  var t  = 0; // A temporary store.
  var m2 = 0; // The modulo of the complex number z, squared.
  var zr2 = 0; // Real part of z, squared. Will be reused in this variable late
  var zi2 = 0; // Imaginary part of z, squared.

  // Iterate through all pixels.
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

// Find out whether this complex number is in the mandelbrot set or not.
// cr: Real part of complex number c to iterate with.
// ci: Imaginary part of complex number c to iterate with.
//
// Returns a value mu, which is the number of iterations needed to escape the e
// (or 0 if the formula never escaped), plus some extra fractional value to all
// smooth coloring.
function iterate_opt(cr, ci, max) {
  var zr = 0;
  var zi = 0;
  var t  = 0; // A temporary store.
  var m2 = 0; // The modulo of the complex number z, squared.
  var zr2 = 0; // Real part of z, squared. Will be reused in this variable late
  var zi2 = 0; // Imaginary part of z, squared.

  // Before we iterate, we'll perform some tests for optimization purposes.

  // Test if the point is within the cardioid bulb to avoid calculation...
  var x4 = cr - 0.25;
  var y2 = ci * ci;
  var q = x4 * x4 + y2;
  t = q * (q + x4);
  if (t < y2 * 0.25) {
    return 0;
  }
  // ...Maybe it's within the period-2-bulb...
  if (((cr + 1) * (cr + 1) + y2) < (1 / 16)) {
    return 0;
  }

  // Ok, we'll have to go through the whole iteration thing.
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
 * Set up a buffer, then render the Mandelbrot set into it.
 */
exports.render = function (size, re, im, ppu, max, opt) {
  // Create the result array and fill it with zeroes.
  var result = new Array(size * size);

  /*
   * Four levels of optimization:
   * 0: No optimization.
   * 1: Check for known bulbs.
   * 2: Subdivide areas, then check if the circumference is in the set.
   * 3: Both subdivision and known bulb check.
   */

  switch (opt) {
    case 0:
      render_basic(re, im, ppu, max, size, result, iterate_basic);
      return result;

    case 1:
      render_basic(re, im, ppu, max, size, result, iterate_opt);
      return result;

    case 2:
      // The subdivision algorithm assumes that the buffer has been zeroed.
      for (var i = 0; i < size * size; i++) {
        result[i] = 0.0;
      }
      render_opt(re, im, ppu, max, size, 0, 0, 9, result, iterate_basic);
      return result;

    case 3:
      // The subdivision algorithm assumes that the buffer has been zeroed.
      for (var i = 0; i < size * size; i++) {
        result[i] = 0.0;
      }
      render_opt(re, im, ppu, max, size, 0, 0, 9, result, iterate_opt);
      return result;
  }
}

/*
 * Our main function that does the work.
 * Arguments:
 * xsize, ysize: Image size.
 * re, im: Real and imaginary part of the center of the image.
 * ppu: Number of pixels in the image per unit in the complex plane (zoom factor).
 * max: Maximum value to iterate to.
 *
 * Returns: An xsize * ysize array with iteration results.
 */
function render_basic(re, im, ppu, max, size, result, iterator) {
  var minre = re - size / ppu / 2;
  var minim = im - size / ppu / 2;
  var inc = 1 / ppu;

  var zre = 0;
  var zim = 0;

  var pos = 0;

  for (y = 0; y < size; y++) {
    zim = minim + y * inc;
    for (x = 0; x < size; x++) {
      zre = minre + x * inc;
      result[pos++] = iterator(zre, zim, max) / (max + 1); // Normalized result in [0..1)
    }
  }

  return;
}

/*
 * Here's a different approach: Segment the picture into quadrants, then apply some
 * Optimization by figuring out if the circumference of quadrants is inside the mandelbrot
 * Set. Since the Mandelbrot set is interconnected, there can't be any holes or islands, so if the
 * whole circumference of a quadrant is 0, the whole quadrant must be.
 *
 * We will call this function recursively to look at sub-tiles.
 *
 * Inputs:
 * re, im, ppu, max as usual.
 * size is the size of the whole tile.
 * startx, starty are the top left coordinates of the subtile to look at.
 * order is the order of the subtile. It's the exponent of 2 that yields the size of the
 * subtile: 2 is a 2x2 tile, 3 is 8x8 and so on.
 * buffer is a pre-allocated buffer for the whole tile. We assume that the buffer has been
 * zeroed from the beginning.
 */
function render_opt(re, im, ppu, max, size, startx, starty, order, result, iterator) {
  var inc = 1 / ppu; // increment per pixel.
  var subsize = 1 << order;

  // Minimum real and imaginary values for the whole master tile.
  var minre = re - size / ppu / 2;
  var minim = im - size / ppu / 2;

  // Figure out the real and imaginary values for the 4 corners of our subtile.
  var lre = minre + startx * inc;      // Left real.
  var rre = lre + (subsize - 1) * inc; // Right real.
  var tim = minim + starty * inc;      // Top imaginary.
  var bim = tim + (subsize - 1) * inc; // Bottom imaginary.

  // Treat the lower order levels as special cases to save on overhead.
  switch (order) {

    // Special case: If we're just a 2x2 subtile, just render.
    case 1:
      var pos = starty * size + startx;
      result[pos++] = iterator(lre, tim, max) / (max + 1); // Top left pixel.
      result[pos] = iterator(rre, tim, max) / (max + 1); // Top right pixel.
      pos += size;
      result[pos-- ] = iterator(rre, bim, max) / (max + 1); // Bottom right pixel.
      result[pos] = iterator(lre, bim, max) / (max + 1); // Bottom left pixel.
      return;

    // Special case: 4x4.
    case 2:
      var pos = starty * size + startx;
      var touche = 0;
      var zre = lre;
      var zim = tim;

      // Walk the 4x4 circumference by hand.
      if (result[pos++] = iterator(zre, zim, max) / (max + 1)) touche = 1;
      zre += inc;
      if (result[pos++] = iterator(zre, zim, max) / (max + 1)) touche = 1;
      zre += inc;
      if (result[pos++] = iterator(zre, zim, max) / (max + 1)) touche = 1;
      zre = rre;
      if (result[pos] = iterator(zre, zim, max) / (max + 1)) touche = 1;
      zim += inc;
      pos += size;
      if (result[pos] = iterator(zre, zim, max) / (max + 1)) touche = 1;
      zim += inc;
      pos += size;
      if (result[pos] = iterator(zre, zim, max) / (max + 1)) touche = 1;
      zim = bim;
      pos += size;
      if (result[pos--] = iterator(zre, zim, max) / (max + 1)) touche = 1;
      zre -= inc;
      if (result[pos--] = iterator(zre, zim, max) / (max + 1)) touche = 1;
      zre -= inc;
      if (result[pos--] = iterator(zre, zim, max) / (max + 1)) touche = 1;
      zre == lre;
      if (result[pos] = iterator(zre, zim, max) / (max + 1)) touche = 1;
      pos -= size;
      zim -= inc;
      if (result[pos] = iterator(zre, zim, max) / (max + 1)) touche = 1;
      pos -= size;
      zim -= inc;
      if (result[pos++] = iterator(zre, zim, max) / (max + 1)) touche = 1;
      // Fill the rectangle only if needed.
      if (touche) {
        zre += inc;
        result[pos++] = iterator(zre, zim, max) / (max + 1);
        zre += inc;
        result[pos] = iterator(zre, zim, max) / (max + 1);
        zim += inc;
        pos += size;
        result[pos--] = iterator(zre, zim, max) / (max + 1);
        zre -= inc;
        result[pos] = iterator(zre, zim, max) / (max + 1);
      }

      return;

    // The 8x8 case is interesting. We draw the circumference, then the remaining inner part
    // can be subdivided into a 4x4 and 5 2x2 parts, if rendering is necessary.
    case 3:
      // Walk the circumference of the buffer, then figure out if we need to draw the inside.
      // We draw 4 lines simultaneously to minimize loop overhead.
      var pos1 = starty * size + startx;
      var pos2 = pos1 + subsize - 1;
      var pos3 = pos2 + size * (subsize -1);
      var pos4 = pos3 - subsize + 1;
      var zre1 = lre;
      var zre2 = rre;
      var zre3 = rre;
      var zre4 = lre;
      var zim1 = tim;
      var zim2 = tim;
      var zim3 = bim;
      var zim4 = bim;
      var touche = 0;

      for (var i = 0; i < subsize - 1; i++) { // No need to go all the way, as the corner's already covered elsewhere.
        // Upper edge
        if (result[pos1++] = iterator(zre1, zim1, max) / (max + 1)) touche = 1;
        zre1 += inc;

        // Right edge
        if (result[pos2] = iterator(zre2, zim2, max) / (max + 1)) touche = 1;
        zim2 += inc;
        pos2 += size;

        // Bottom edge
        if (result[pos3--] = iterator(zre3, zim3, max) / (max + 1)) touche = 1;
        zre3 -= inc;

        // Left edge
        if (result[pos4] = iterator(zre4, zim4, max) / (max + 1)) touche = 1;
        zim4 -= inc;
        pos4 -= size;
      }

      // If we need to fill out the inner part, subdivide into squares of size 4 and 2.
      if (touche) {
        // Big 4x4 box on the top left of the inner rectangle.
        render_opt(re, im, ppu, max, size, startx + 1, starty + 1, 2, result, iterator);
        // Two 2x2 boxes to the top and middle right of the 4x4 box.
        render_opt(re, im, ppu, max, size, startx + 5, starty + 1, 1, result, iterator);
        render_opt(re, im, ppu, max, size, startx + 5, starty + 3, 1, result, iterator);
        // One 2x2 box at the bottom right corner
        render_opt(re, im, ppu, max, size, startx + 5, starty + 5, 1, result, iterator);
        // Two 2x2 boxes at the bottom middle and left.
        render_opt(re, im, ppu, max, size, startx + 3, starty + 5, 1, result, iterator);
        render_opt(re, im, ppu, max, size, startx + 1, starty + 5, 1, result, iterator);
      }

      return; 

    default:
      // Walk the circumference of the buffer, then figure out if all values were equal.

      // Test all four edges simultaneously.
      for (var i = 0; i < subsize - 1; i++) { // No need to go all the way, as the corner's already covered elsewhere.
        // Upper edge
        if (iterator(lre + i * inc, tim, max)) break;

        // Right edge
        if (iterator(rre, tim + i * inc, max)) break;

        // Bottom edge
        if (iterator(rre - i * inc, bim, max)) break;

        // Left edge
        if (iterator(lre, bim - i * inc, max)) break;
      }

      // If there was any iteration different from 0, we have work to do.
      if (i < subsize - 1) {
        // Split up the subtile into 4 quadrants and recurse.
        render_opt(re, im, ppu, max, size, startx, starty, order - 1, result, iterator);
        render_opt(re, im, ppu, max, size, startx + (subsize >> 1), starty, order - 1, result, iterator);
        render_opt(re, im, ppu, max, size, startx, starty + (subsize >> 1), order - 1, result, iterator);
        render_opt(re, im, ppu, max, size, startx + (subsize >> 1), starty + (subsize >> 1), order - 1, result, iterator);
      }

      return;
  }
}
