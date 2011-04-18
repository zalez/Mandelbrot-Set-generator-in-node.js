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
      // Return smoothed escape value.
      return (i + 1 - Math.log(Math.log(Math.sqrt(m2))) / Math.log(2)) / (max + 1); // Normalized to 0..1
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
      // Return smoothed escape value.
      return (i + 1 - Math.log(Math.log(Math.sqrt(m2))) / Math.log(2)) / (max + 1); // Normalized to 0..1
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
   * 0: Use default (= 4).
   * 1: No optimization.
   * 2: Check for known bulbs.
   * 3: Subdivide areas, then check if the circumference is in the set.
   * 4: Both subdivision and known bulb check.
   */
  process.stdout.write("Rendering Mandelbrot Set at " + re + " + " + im + " * i with " + ppu + " pixels per unit.\n");
  process.stdout.write("Image size: " + size + ", maximum iteration level: " + max + ", optimization level: " + opt + "\n");

  switch (opt) {
    case 1:
      render_basic(re, im, ppu, max, size, result, iterate_basic);
      return result;

    case 2:
      render_basic(re, im, ppu, max, size, result, iterate_opt);
      return result;

    case 3:
      // The subdivision algorithm assumes that the buffer has been zeroed.
      for (var i = 0; i < size * size; i++) {
        result[i] = 0.0;
      }
      render_opt(re, im, ppu, max, size, 0, 0, size, result, iterate_basic);
      return result;

    default:
      // The subdivision algorithm assumes that the buffer has been zeroed.
      for (var i = 0; i < size * size; i++) {
        result[i] = 0.0;
      }
      render_opt(re, im, ppu, max, size, 0, 0, size, result, iterate_opt);
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
      result[pos++] = iterator(zre, zim, max);
    }
  }

  return;
}


/*
 * Walk the circumference of a quadratic area of the mandelbrot set and compute the iterations.
 * Return 0 if all results were 0, 1 otherwise.
 * This will be used to determine if a quadratic area is contained in the Mandelbrot set. Its
 * inner part doesn't need to be rendered if the circumference is completelty part of it.
 */
function walk_around(minre, minim, inc, max, size, startx, starty, subsize, result, iterator) {
  // We draw 4 lines simultaneously to minimize loop overhead.
  var pos1 = starty * size + startx;
  var pos2 = pos1 + subsize - 1;
  var pos3 = pos2 + size * (subsize - 1);
  var pos4 = pos3 - subsize + 1;
  var zre1 = minre;
  var zre2 = minre + (subsize - 1) * inc;
  var zre3 = zre2;
  var zre4 = minre;
  var zim1 = minim;
  var zim2 = minim;
  var zim3 = minim + (subsize - 1) * inc;
  var zim4 = zim3;
  var touche = 0;

  for (var i = 0; i < subsize - 1; i++) { // No need to go all the way, the corner's covered elsewhere.
    // Upper edge
    if (result[pos1++] = iterator(zre1, zim1, max)) touche = 1;
    zre1 += inc;

    // Right edge
    if (result[pos2] = iterator(zre2, zim2, max)) touche = 1;
    zim2 += inc;
    pos2 += size;

    // Bottom edge
    if (result[pos3--] = iterator(zre3, zim3, max)) touche = 1;
    zre3 -= inc;

    // Left edge
    if (result[pos4] = iterator(zre4, zim4, max)) touche = 1;
    zim4 -= inc;
    pos4 -= size;
  }

  return touche;
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
 * subsize is the size of the subtile.
 * buffer is a pre-allocated buffer for the whole tile. We assume that the buffer has been
 * zeroed from the beginning.
 *
 * Assumptions: Size must be an even number, and the tiles are of course quadratic.
 */
function render_opt(re, im, ppu, max, size, startx, starty, subsize, result, iterator) {
  var inc = 1 / ppu; // increment per pixel.

  // Minimum real and imaginary values for the whole master tile.
  var minre = re - size / ppu / 2;
  var minim = im - size / ppu / 2;

  // Figure out the real and imaginary values for the 4 corners of our subtile.
  var lre = minre + startx * inc;      // Left real.
  var rre = lre + (subsize - 1) * inc; // Right real.
  var tim = minim + starty * inc;      // Top imaginary.
  var bim = tim + (subsize - 1) * inc; // Bottom imaginary.

  // process.stdout.write("Subsize: " + subsize + "\n");

  // Treat the lower subsizes as special cases to save on overhead.
  switch (subsize) {
    case 1:
      result[starty * size + startx] = iterator(lre, tim, max);
      return;

    // Special case: If we're just a 2x2 subtile, render all.
    case 2:
      var pos = starty * size + startx;
      result[pos++] = iterator(lre, tim, max); // Top left pixel.
      result[pos] = iterator(rre, tim, max); // Top right pixel.
      pos += size;
      result[pos-- ] = iterator(rre, bim, max); // Bottom right pixel.
      result[pos] = iterator(lre, bim, max); // Bottom left pixel.
      return;

    // Special case: 3x3.
    case 3:
      var pos = starty * size + startx;
      var touche = 0;
      var zre = lre;
      var zim = tim;

      // Walk the 3x3 circumference by hand. Faster than a subroutine and/or loop.
      if (result[pos++] = iterator(zre, zim, max)) touche = 1;
      zre += inc;
      if (result[pos++] = iterator(zre, zim, max)) touche = 1;
      zre += inc;
      if (result[pos] = iterator(zre, zim, max)) touche = 1;
      zim += inc;
      pos += size;
      if (result[pos] = iterator(zre, zim, max)) touche = 1;
      zim += inc;
      pos += size;
      if (result[pos--] = iterator(zre, zim, max)) touche = 1;
      zre -= inc;
      if (result[pos--] = iterator(zre, zim, max)) touche = 1;
      zre -= inc;
      if (result[pos] = iterator(zre, zim, max)) touche = 1;
      pos -= size;
      zim -= inc;
      if (result[pos++] = iterator(zre, zim, max)) touche = 1;
      // Fill the rectangle only if needed.
      if (touche) {
        zre += inc;
        result[pos] = iterator(zre, zim, max);
      }
      return;

    // Special case: 4x4.
    case 4:
      var pos = starty * size + startx;
      var touche = 0;
      var zre = lre;
      var zim = tim;

      // Walk the 4x4 circumference by hand. Faster than a subroutine and/or loop.
      if (result[pos++] = iterator(zre, zim, max)) touche = 1;
      zre += inc;
      if (result[pos++] = iterator(zre, zim, max)) touche = 1;
      zre += inc;
      if (result[pos++] = iterator(zre, zim, max)) touche = 1;
      zre = rre;
      if (result[pos] = iterator(zre, zim, max)) touche = 1;
      zim += inc;
      pos += size;
      if (result[pos] = iterator(zre, zim, max)) touche = 1;
      zim += inc;
      pos += size;
      if (result[pos] = iterator(zre, zim, max)) touche = 1;
      zim = bim;
      pos += size;
      if (result[pos--] = iterator(zre, zim, max)) touche = 1;
      zre -= inc;
      if (result[pos--] = iterator(zre, zim, max)) touche = 1;
      zre -= inc;
      if (result[pos--] = iterator(zre, zim, max)) touche = 1;
      zre == lre;
      if (result[pos] = iterator(zre, zim, max)) touche = 1;
      pos -= size;
      zim -= inc;
      if (result[pos] = iterator(zre, zim, max)) touche = 1;
      pos -= size;
      zim -= inc;
      if (result[pos++] = iterator(zre, zim, max)) touche = 1;

      // Fill the rectangle only if needed.
      if (touche) {
        zre += inc;
        result[pos++] = iterator(zre, zim, max);
        zre += inc;
        result[pos] = iterator(zre, zim, max);
        zim += inc;
        pos += size;
        result[pos--] = iterator(zre, zim, max);
        zre -= inc;
        result[pos] = iterator(zre, zim, max);
      }

      return;

    default:
      // Walk the circumference of the buffer, then figure out if all values were equal.

      if (walk_around(lre, tim, inc, max, size, startx, starty, subsize, result, iterator)) {

        var new_subsize = 0;
        // Figure out how to best subdivide the remainder.
        if ((subsize - 2) % 2 == 0) { // We can divide the remainder evenly
          new_subsize = (subsize - 2) >> 1;
          render_opt(re, im, ppu, max, size, startx + 1, starty + 1, new_subsize, result, iterator);
          render_opt(re, im, ppu, max, size, startx + 1 + new_subsize, starty + 1, new_subsize, result, iterator);
          render_opt(re, im, ppu, max, size, startx + 1, starty + 1 + new_subsize, new_subsize, result, iterator);
          render_opt(re, im, ppu, max, size, startx + 1 + new_subsize, starty + 1 + new_subsize, new_subsize, result, iterator);
        } else if ((subsize - 2) % 3 == 0) { // We can subdivide by 3.
          new_subsize = (subsize - 2) / 3;
          render_opt(re, im, ppu, max, size, startx + 1, starty + 1, new_subsize, result, iterator);
          render_opt(re, im, ppu, max, size, startx + 1 + new_subsize, starty + 1, new_subsize, result, iterator);
          render_opt(re, im, ppu, max, size, startx + 1 + 2 * new_subsize, starty + 1, new_subsize, result, iterator);
          render_opt(re, im, ppu, max, size, startx + 1, starty + 1 + new_subsize, new_subsize, result, iterator);
          render_opt(re, im, ppu, max, size, startx + 1 + new_subsize, starty + 1 + new_subsize, new_subsize, result, iterator);
          render_opt(re, im, ppu, max, size, startx + 1 + 2 * new_subsize, starty + 1 + new_subsize, new_subsize, result, iterator);
          render_opt(re, im, ppu, max, size, startx + 1, starty + 1 + 2 * new_subsize, new_subsize, result, iterator);
          render_opt(re, im, ppu, max, size, startx + 1 + new_subsize, starty + 1 + 2 * new_subsize, new_subsize, result, iterator);
          render_opt(re, im, ppu, max, size, startx + 1 + 2 * new_subsize, starty + 1 + 2 * new_subsize, new_subsize, result, iterator);
        } else { // A generic uneven subsize.
          // Render 1 pixel stripes at bottom and right, then subdivide by 2.
          for (var i = 1; i < subsize - 1; i++) {
            result[(starty + subsize - 2) * size + startx + i] = iterator(lre + i * inc, bim - inc, max);
            result[(starty + i) * size + startx + subsize - 2] = iterator(lre + (subsize - 2) * inc, tim + i * inc, max);
          }
           
          new_subsize = (subsize - 3) >> 1;
          render_opt(re, im, ppu, max, size, startx + 1, starty + 1, new_subsize, result, iterator);
          render_opt(re, im, ppu, max, size, startx + 1 + new_subsize, starty + 1, new_subsize, result, iterator);
          render_opt(re, im, ppu, max, size, startx + 1, starty + 1 + new_subsize, new_subsize, result, iterator);
          render_opt(re, im, ppu, max, size, startx + 1 + new_subsize, starty + 1 + new_subsize, new_subsize, result, iterator);
        }
        return;
    }
  }
}
