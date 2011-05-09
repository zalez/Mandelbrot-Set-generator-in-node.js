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
  for (var i = 1; i < max; i++) {
    // z = z^2 ...
    t = zr2 - zi2;
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
    if (m2 > 4) { // Mandelbrot escape radius is 2, r^2=4
      // Return smoothed escape value.
      // Look up Mandelbrot on Wikipedia and Google to get the smoothing equation.
      return (i + 1 - (Math.log(Math.log(Math.sqrt(m2))) / Math.LN2));
    }
  }

  return 0;
}

// Find out whether this complex number is in the mandelbrot set or not.
// Optimization: Test if the point is in the period 1 or 2 bulbs before iterating.
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
  for (var i = 1; i < max; i++) {
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
      return (i + 1 - (Math.log(Math.log(Math.sqrt(m2))) / Math.LN2));
    }
  }

  return 0;
}

// Perform the iteration, test for the period 1 bulb to avoid calculation.
// cr: Real part of complex number c to iterate with.
// ci: Imaginary part of complex number c to iterate with.
//
// Returns a value mu, which is the number of iterations needed to escape the e
// (or 0 if the formula never escaped), plus some extra fractional value to all
// smooth coloring.
function iterate_opt_1(cr, ci, max) {
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

  // Ok, we'll have to go through the whole iteration thing.
  for (var i = 1; i < max; i++) {
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
      return (i + 1 - (Math.log(Math.log(Math.sqrt(m2))) / Math.LN2));
    }
  }

  return 0;
}

// Find out whether this complex number is in the mandelbrot set or not.
// Optimization: Test if the point is in the period 2 bulb before iterating.
// cr: Real part of complex number c to iterate with.
// ci: Imaginary part of complex number c to iterate with.
//
// Returns a value mu, which is the number of iterations needed to escape the e
// (or 0 if the formula never escaped), plus some extra fractional value to all
// smooth coloring.
function iterate_opt_2(cr, ci, max) {
  var zr = 0;
  var zi = 0;
  var t  = 0; // A temporary store.
  var m2 = 0; // The modulo of the complex number z, squared.
  var zr2 = 0; // Real part of z, squared. Will be reused in this variable late
  var zi2 = 0; // Imaginary part of z, squared.

  // Before we iterate, we'll perform some tests for optimization purposes.

  // Test if the point is in the period 2 bulb
  var y2 = ci * ci;
  if (((cr + 1) * (cr + 1) + y2) < (1 / 16)) {
    return 0;
  }

  // Ok, we'll have to go through the whole iteration thing.
  for (var i = 1; i < max; i++) {
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
      return (i + 1 - (Math.log(Math.log(Math.sqrt(m2))) / Math.LN2));
    }
  }

  return 0;
}

// Describe a particular center of the mandelbrot set.
function mandset(re, im, max) {
  this.re = re;
  this.im = im;
  this.max = max;
  return;
}

/*
 * Describe a region inside an image table of iteration results.
 * buffer: An array containing iteration results, one per x/y coordinate.
 * stride: The total width of the image. An index + stride brings us to the next line
 *         at the same x co-ordinate.
 * x,y:    Starting co-ordinates of the subimage.
 * sx, sy: x and y sizes of the subimage.
 * ppu:    Number of pixels per numerical unit: ppu = 100, then [0..1] is 100 pixels.
 */
function subimage(buffer, stride, x, y, sx, sy, ppu) {
  this.buffer = buffer;
  this.stride = stride;
  this.x = x;
  this.y = y;
  this.sx = sx;
  this.sy = sy;
  this.ppu = ppu;
  // Convenience values
  this.inc = 1 / ppu; // The increment in complex value per pixel.
  this.resize = sx / ppu; // The width of the image in the complex plane.
  this.imsize = sy / ppu; // The height of the image in the complex plane.
  
  return;
}

/*
 * Set up a buffer, then render the Mandelbrot set into it.
 */
exports.render = function (size, re, im, ppu, max, opt) {
  // Create some data structures.
  var set = new mandset(re, im, max);

  // Create the result array and fill it with zeroes.
  var buffer = new Array(size * size);

  // The subimage structure contains the whole image at first.
  var image = new subimage(buffer, size, 0, 0, size, size, ppu); // The whole image.

  /*
   * Four levels of optimization:
   * 0: Use default (= 4).
   * 1: No optimization.
   * 2: Check for known bulbs.
   * 3: Subdivide areas, then check if the circumference is in the set.
   * 4: Both subdivision and known bulb check.
   * 5: Adaptive rendering: Decompose the rendering area into known areas with specific choice
   *    of optimization strategy. Easy areas render in basic mode, complex areas with more
   *    optimization, mirror bottom image if top has been rendered already, etc.
   */
  switch (opt) {
    case 1:
      render_basic(set, image, iterate_basic);
      return result;

    case 2:
      render_basic(set, image, iterate_opt);
      return result;

    case 3:
      // The subdivision algorithm assumes that the buffer has been zeroed.
      for (var i = 0; i < size * size; i++) {
        result[i] = 0.0;
      }
      render_opt(set, image, iterate_basic);
      return result;

    case 4:
      // The subdivision algorithm assumes that the buffer has been zeroed.
      for (var i = 0; i < size * size; i++) {
        result[i] = 0.0;
      }
      render_opt(set, image, iterate_opt);
      return result;

    default: // 0 = 5 = best algorithm.
      // The subdivision algorithm assumes that the buffer has been zeroed.
      for (var i = 0; i < size * size; i++) {
        result[i] = 0.0;
      }
      render_adaptive(set, image, iterate_opt);
      return result;
  }
}

/*
 * Our main function that does the work.
 *
 * Arguments:
 * set: The description of the Mandelbrot subset to render.
 * image: The description of the (sub)image structure to render into.
 *        We assume that the image is quadratic, i.e. sx = sy. We only use sx and ignore sy.
 *
 * Returns: An xsize * ysize array with iteration results.
 */
function render_basic(set, image, iterator) {
  var minre = set.re - image.resize / 2;
  var maxim = set.im + image.imsize / 2;
  var xextra = image.stride - image.sx;

  var zre = 0;
  var zim = 0;

  var pos = image.y * image.stride + image.x;

  for (var y = image.y; y < image.y + image.sy; y++) {
    zim = maxim - y * image.inc;
    for (var x = image.x; x < image.x + image.sx; x++) {
      zre = minre + x * image.inc;
      result[pos++] = iterator(zre, zim, max);
    }
    pos += xextra;
  }

  return;
}


/*
 * Walk the circumference of a quadratic area of the mandelbrot set and compute the iterations.
 * Return 0 if all results were 0, 1 otherwise.
 * This will be used to determine if a quadratic area is contained in the Mandelbrot set. Its
 * inner part doesn't need to be rendered if the circumference is completelty part of it.
 */
function walk_around(minre, maxim, inc, max, size, startx, starty, subsize, result, iterator) {
  // We draw 4 lines simultaneously to minimize loop overhead.
  var pos1 = starty * size + startx;
  var pos2 = pos1 + subsize - 1;
  var pos3 = pos2 + size * (subsize - 1);
  var pos4 = pos3 - subsize + 1;
  var zre1 = minre;
  var zre2 = minre + (subsize - 1) * inc;
  var zre3 = zre2;
  var zre4 = minre;
  var zim1 = maxim;
  var zim2 = maxim;
  var zim3 = maxim - (subsize - 1) * inc;
  var zim4 = zim3;
  var touche = 0;

  for (var i = 0; i < subsize - 1; i++) { // No need to go all the way, the corner's covered elsewhere.
    // Upper edge
    if (result[pos1++] = iterator(zre1, zim1, max)) touche = 1;
    zre1 += inc;

    // Right edge
    if (result[pos2] = iterator(zre2, zim2, max)) touche = 1;
    zim2 -= inc;
    pos2 += size;

    // Bottom edge
    if (result[pos3--] = iterator(zre3, zim3, max)) touche = 1;
    zre3 -= inc;

    // Left edge
    if (result[pos4] = iterator(zre4, zim4, max)) touche = 1;
    zim4 += inc;
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
  var maxim = im + size / ppu / 2;

  // Figure out the real and imaginary values for the 4 corners of our subtile.
  var lre = minre + startx * inc;      // Left real.
  var rre = lre + (subsize - 1) * inc; // Right real.
  var tim = maxim - starty * inc;      // Top imaginary.
  var bim = tim - (subsize - 1) * inc; // Bottom imaginary.

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
      result[pos--] = iterator(rre, bim, max); // Bottom right pixel.
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
          new_subsize = Math.floor((subsize - 2) / 3); // Protect against float imprecision.
          render_opt(re, im, ppu, max, size, startx + 1, starty + 1, new_subsize, result, iterator);
          render_opt(re, im, ppu, max, size, startx + 1 + new_subsize, starty + 1, new_subsize, result, iterator);
          render_opt(re, im, ppu, max, size, startx + 1 + (new_subsize << 1), starty + 1, new_subsize, result, iterator);
          render_opt(re, im, ppu, max, size, startx + 1, starty + 1 + new_subsize, new_subsize, result, iterator);
          render_opt(re, im, ppu, max, size, startx + 1 + new_subsize, starty + 1 + new_subsize, new_subsize, result, iterator);
          render_opt(re, im, ppu, max, size, startx + 1 + (new_subsize << 1), starty + 1 + new_subsize, new_subsize, result, iterator);
          render_opt(re, im, ppu, max, size, startx + 1, starty + 1 + (new_subsize << 1), new_subsize, result, iterator);
          render_opt(re, im, ppu, max, size, startx + 1 + new_subsize, starty + 1 + (new_subsize << 1), new_subsize, result, iterator);
          render_opt(re, im, ppu, max, size, startx + 1 + 2 * new_subsize, starty + 1 + (new_subsize << 1), new_subsize, result, iterator);
        } else { // A generic uneven subsize.
          // Render 1 pixel stripes at bottom and right, then subdivide by 2.
          render_hline(re, im, ppu, max, size, startx, starty + subsize - 2, subsize - 1, result, iterator);
          render_vline(re, im, ppu, max, size, startx + subsize - 2, starty, subsize - 1, result, iterator);
           
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

/*
 * Render a horizontal line of pixels.
 */
function render_hline(re, im, ppu, max, size, startx, starty, sizex, result, iterator) {
  var inc = 1 / ppu; // increment per pixel.

  // Minimum real and imaginary values for the whole master tile.
  var minre = re - size / ppu / 2;
  var maxim = im + size / ppu / 2;

  // Figure out the real and imaginary values for the 4 corners of our subtile.
  var lre = minre + startx * inc;      // Left real.
  var tim = maxim - starty * inc;      // Top imaginary.

  var pos = starty * size + startx;
  var zre = lre;
  for (var x = startx; x < startx + sizex; x++) {
    result[pos++] = iterator(zre, tim, max);
    zre += inc; 
  }
  return;
}

/*
 * Render a vertical line of pixels.
 */
function render_vline(re, im, ppu, max, size, startx, starty, sizey, result, iterator) {
  var inc = 1 / ppu; // increment per pixel.

  // Minimum real and imaginary values for the whole master tile.
  var minre = re - size / ppu / 2;
  var maxim = im + size / ppu / 2;

  // Figure out the real and imaginary values for the 4 corners of our subtile.
  var lre = minre + startx * inc;      // Left real.
  var tim = maxim - starty * inc;      // Top imaginary.

  var pos = starty * size + startx;
  var zim = tim;
  for (var y = starty; y < starty + sizey; y++) {
    result[pos] = iterator(lre, zim, max);
    pos += size;
    zim -= inc; 
  }
  return;
}

/*
 * Subdivide the given subarea of the Mandelbrot set into quadratic regions that are as large as
 * possible, then render them using the optimized quadratic method.
 */
function subdivide_quadratic(re, im, ppu, max, size, startx, starty, sizex, sizey, result, iterator) {
  // Perhaps we're already quadratic?
  if (sizex == sizey) {
    render_opt(re, im, ppu, max, size, startx, starty, sizex, result, iterator);
    return;
  } else if (sizex > sizey) { // wider than tall
    var subsize = sizey;
    // Render all quadratic areas with size y
    var x = 0;
    for (x = startx; x < startx + sizex - subsize; x += subsize) {
      render_opt(re, im, ppu, max, size, x, starty, subsize, result, iterator);
    }
    // Recurse over the rest, if necessary.
    if (sizex % subsize) {
      subdivide_quadratic(re, im, ppu, max, size,
        x,
        starty,
        sizex % subsize,
        sizey,
        result, iterator
      );
    } else { // If there's no rest, then there's still one more left to render.
      render_opt(re, im, ppu, max, size, x, starty, subsize, result, iterator);
    }
    return;
  } else { // taller than wide
    var subsize = sizex;
    // Render all quadratic areas with size x
    var y = 0;
    for (y = starty; y < starty + sizey - subsize; y += subsize) {
      render_opt(re, im, ppu, max, size, startx, y, subsize, result, iterator);
    }
    // Recurse over the rest, if necessary.
    if (sizey % subsize) {
      subdivide_quadratic(re, im, ppu, max, size,
        startx,
        y,
        sizex,
        sizey % subsize,
        result, iterator
      );
    } else {
      render_opt(re, im, ppu, max, size, startx, y, subsize, result, iterator);
    }
    return;
  }
}

/*
 * Subdivide the given area of the mandelbrot set into zones, apply a different, optimal
 * optimization setting to that zones.
 * The idea here is to save detection times for zones that are known to not profit from that
 * detection, and to exploit mirroring opportunities.
 */
function render_adaptive(re, im, ppu, max, size, startx, starty, sizex, sizey, result) {
// We will fill a todo-list-array with startx, starty, sizex, and sizey plus method and iterators, then
// go through that todo list.
var todo = [];
  var top_im = im + (size / ppu) / 2;
  var bottom_im = im - (size / ppu) / 2;

  var newsizey;

  // Render the top part until +1.2 with minimal optimization, as it's very easy anyway.
  if (top_im >= 1.2) {
    if (bottom_im < 1.2) {
      newsizey = Math.floor((top_im - 1.2) * ppu + 0.5);
    } else {
      newsizey = sizey;
    }

    // Add the job to the queue
    todo.push({
      startx: startx,
      starty: starty,
      sizex: sizex,
      sizey: newsizey,
      method: "basic",
      iterator: iterate_basic
    });
  }


  // Use more optimization for the part between 1.2 and 1.0. No need to test for bulbs, though.
  if (top_im > 1.0) {
    if (top_im > 1.2) {
      var new_top_im = 1.2;
    } else {
      var new_top_im = top_im;
    }
    var newstarty = starty + Math.floor((top_im - new_top_im) * ppu + 0.5);

    if (bottom_im < 1.0) {
      var new_bottom_im = 1.0;
    } else {
      var new_bottom_im = bottom_im;
    }
    var newsizey = Math.floor((new_top_im - new_bottom_im) * ppu + 0.5);

    // Add the job to the queue
    todo.push({
      startx: startx,
      starty: newstarty,
      sizex: sizex,
      sizey: newsizey,
      method: "subdivide",
      iterator: iterate_basic
    });
  }

  // Complete todo-list.
  for (var i = 0; i < todo.length; i++) {
    switch (todo[i].method) {
      case "basic":
        render_basic(re, im, ppu, max,
          todo[i].startx, todo[i].starty, todo[i].sizex, todo[i].sizey,
          result, todo[i].iterator, size);
        break;

      case "subdivide":
        subdivide_quadratic(re, im, ppu, max, size,
          todo[i].startx, todo[i].starty, todo[i].sizex, todo[i].sizey,
          result, todo[i].iterator);
        break;
    }
  }
}

/*
 * Render the Mandelbrot set using adaptive optimization: Decompose the image into areas,
 * then select the right strategies for each area.
 */
function render_adaptive_old(re, im, ppu, max, size, startx, starty, sizex, sizey, result) {
  /* Subdivide the image into special areas with specific optimization strategies.
   *
   * Horizontal areas of interest:
   * - Left of the whole set: Everything left of -2, variables start with lw.
   * - Left of the period 2 bulb: Between -2 and -1.25, variables start with l2.
   * - Within the period 2 bulb: Between -1.25 and -0.75, variables start with p2.
   * - Within the period 1 bulb: Between -0.75 and 0.5, variables start with p1.
   * - Right of the period 1 bulb: Everything right of 0.5, variables start with r1.
   *
   * Variables determine the width of the area within the area to render, and the start value.
   * For instance, the start value for the piece to be rendered within the period 2 bulb would
   * be p2s, and its width p2. If nothing needs to be rendered in the area, the width is 0.
   *
   * Figure out which parts touch our subset, then determine the appropriate real values for
   * rendering the subareas.
   */

  /*
   * Basic boundary values for re and im.
   */
  var inc = 1 / ppu; // increment per pixel.

  // Top left real and imaginary values for the whole tile.
  var minre = re - size / ppu / 2;
  var maxim = im + size / ppu / 2;

  // Figure out the real and imaginary values for the 4 corners of our subtile.
  var lre = minre + startx * inc;      // Left real.
  var rre = lre + (sizex - 1) * inc; // Right real.
  var tim = maxim - starty * inc;      // Top imaginary.
  var bim = tim - (sizey - 1) * inc; // Bottom imaginary.

  // When computing values, we need to use Math.floor(... +0.5) to round to the nearest integer to get
  // rid of minuscule float rounding errors.

  // Figure out values for left of the whole set. [..-2)
  var lws = 0, lw = 0;
  if (lre < -2) {
    var lws = startx; // No need to test here.
    if (rre > -2) { lw = Math.floor(-2 / inc - lre / inc + 0.5); } else { lw = sizex; }
  }

  // Figure out values for left of the period 2 bulb. [-2..-1.25)
  var l2s = 0, l2 = 0;
  if (lre < -1.25) {
    if (lre < -2) {
      l2s = Math.floor(startx + (-2 - lre) / inc + 0.5);
      if (rre > -1.25) {
        l2 = Math.floor(sizex - (rre - -1.25) / inc - (-2 - lre) / inc + 0.5); // Subtract the left and right pieces out of scope.
      } else {
        l2 = Math.floor(sizex - (-2 - lre) / inc + 0.5);
      }
    } else {
      l2s = startx;
      if (rre > -1.25) {
        l2 = Math.floor(sizex - (rre - -1.25) / inc + 0.5); // Subtract the left and right pieces out of scope.
      } else {
        l2 = sizex;
      }
    }
  }

  // Figure out values for within the period 2 bulb. [-1.25..-0.75)
  var p2s = 0, p2 = 0;
  if (lre < -0.75) {
    if (lre < -1.25) {
      p2s = Math.floor(startx + (-1.25 - lre) / inc + 0.5);
      if (rre > -0.75) {
        p2 = Math.floor(sizex - (rre - -0.75) / inc - (-1.25 - lre) / inc + 0.5); // Subtract the left and right pieces out of scope.
      } else {
        p2 = Math.floor(sizex - (-1.25 - lre) / inc + 0.5);
      }
    } else {
      p2s = startx;
      if (rre > -0.75) {
        p2 = Math.floor(sizex - (rre - -0.75) / inc + 0.5); // Subtract the left and right pieces out of scope.
      } else {
        p2 = sizex;
      }
    }
  }

  // Figure out values for within the period 1 bulb. [-0.75..0.5)
  var p1s = 0, p1 = 0;
  if (lre < 0.5) {
    if (lre < -0.75) {
      p1s = Math.floor(startx + (-0.75 - lre) / inc + 0.5);
      if (rre > 0.5) {
        p1 = Math.floor(sizex - (rre - 0.5) / inc - (-0.75 - lre) / inc + 0.5); // Subtract the left and right pieces out of scope.
      } else {
        p1 = Math.floor(sizex - (-0.75 - lre) / inc + 0.5);
      }
    } else {
      p1s = startx;
      if (rre > 0.5) {
        p1 = Math.floor(sizex - (rre - 0.5) / inc + 0.5); // Subtract the left and right pieces out of scope.
      } else {
        p1 = sizex;
      }
    }
  }

  // Figure out values for right of the period1 bulb. [0.5..]
  var r1s = 0, r1 = 0;
  if (lre >= 0.5) {
    r1s = startx;
    r1 = sizex;
  } else {
    r1s = Math.floor(startx + (0.5 - lre) / inc + 0.5);
    r1 = Math.floor(sizex - (0.5 - lre) / inc + 0.5);
  }

  var newstarty = 0;
  var newsizey = 0;

  // Render everything outside im 1.2 .. 0 with the simplest algorithm.
  // No horizontal subdivision as everything is of equal complexity.
  // Nothing to test for here, so we can be quick and dumb.
  if (tim > 1.2) {
    // Find appropriate imaginary end value for the subarea to render.
    if (bim <= 1.2) {
      var newbim = 1.2;
    } else {
      var newbim = bim;
    }

    newsizey = Math.floor((tim - newbim) / inc + 0.5);
    render_basic(re, im, ppu, max, startx, starty, sizex, newsizey, result, iterate_basic, size);
  }

  // Render the part that's between 1.2 and 1.0. The left part is still easy, but the right one
  // may have some complexity. At least we don't have to test for period 1 or 2 bulbs.
  if (tim > 1.0) {
    if (tim > 1.2) { // already been there before
      var newtim = 1.2; // the line belonging to 1.2 has already been rendered.
    } else {
      var newtim = tim;
    }
    newstarty = Math.floor((tim - newtim) / inc + 0.5);

    if (bim <= 1.0) {
      newbim = 1.0;
    } else {
      newbim = bim;
    }
    newsizey = Math.floor((newtim - newbim) / inc + 0.5) + 1;

    // The left part is much easier, so we don't need optimization.
    if (lw + l2 + p2) {
      render_basic(re, im, ppu, max, startx, newstarty, lw + l2 + p2, newsizey, result, iterate_basic, size);
    }
    // The right part can be slightly trickier, though subdivision with basic algorithm is sufficient here.
    if (p1 + r1) {
      subdivide_quadratic(re, im, ppu, max, size, p1s, newstarty, p1 + r1, newsizey, result, iterate_basic);
    }
  }

  // The part between 1.0 and 0 is where most of the action is. Each horizontal region will get its own
  // version of an optimized rendering configuration.

  // Find parameters for im within 1.0..0 that we're supposed to render.
  if (tim > 0) {
    if (tim > 1.0) {
      var newtim = 1.0;
    } else {
      var newtim = tim;
    }
    newstarty = Math.floor((tim - newtim) / inc + 0.5);

    if (bim <= 0) {
      newbim = 0;
    } else {
      newbim = bim;
    }
    newsizey = Math.floor((newtim - newbim) / inc + 0.5) + 1;

    // Render each horizontal subpart with its optimal settings.
    if (lw) render_basic(re, im, ppu, max, lws, newstarty, lw, newsizey, result, iterate_basic, size);
    if (l2) subdivide_quadratic(re, im, ppu, max, size, l2s, newstarty, l2, newsizey, result, iterate_basic);
    if (p2) subdivide_quadratic(re, im, ppu, max, size, p2s, newstarty, p2, newsizey, result, iterate_opt_2);
    if (p1) subdivide_quadratic(re, im, ppu, max, size, p1s, newstarty, p1, newsizey, result, iterate_opt_1);
    if (r1) render_basic(re, im, ppu, max, r1s, newstarty, r1, newsizey, result, iterate_basic, size);
  }

  // Can we reuse something through mirroring?
  if (tim > 0 && bim < 0) {
    if (tim > -bim) {
      newsizey = Math.floor(-bim / inc + 0.5); // Vertical size of the mirrorable range
    } else {
      newsizey = Math.floor(tim / inc + 0.5); 
    }

    var source = Math.floor(tim / inc - 1 + 0.5) * size;
    var dest = Math.floor(tim / inc + 1 + 0.5) * size; 
    for (var y = 0; y < newsizey - 1; y++) {
      source += startx * 3;
      dest += startx * 3;
      for (var x = 0; x < sizex; x++) {
        result[dest++] = result[source++];
        result[dest++] = result[source++];
        result[dest++] = result[source++];
      }
      dest += size - (startx + sizex) * 3;
      source -= (size + (startx + sizex) * 3);
    }
  }

  // Find parameters for im within 0..-1.0 that we need to render.
  if (tim > -1.0 && tim < 1.0) { // Also test if we have mirrored this completely before
    if (tim > 0) {
      var newtim = 0 - tim; // Account for already mirrored part.
    } else {
      var newtim = tim;
    }
    newstarty = Math.floor((tim - newtim) / inc + 0.5);

    if (bim <= -1.0) {
      newbim = -1.0;
    } else {
      newbim = bim;
    }
    newsizey = Math.floor((newtim - newbim) / inc + 0.5) + 1;

    // Render each horizontal subpart with its optimal settings.
    if (lw) render_basic(re, im, ppu, max, lws, newstarty, lw, newsizey, result, iterate_basic, size);
    if (l2) subdivide_quadratic(re, im, ppu, max, size, l2s, newstarty, l2, newsizey, result, iterate_basic);
    if (p2) subdivide_quadratic(re, im, ppu, max, size, p2s, newstarty, p2, newsizey, result, iterate_opt_2);
    if (p1) subdivide_quadratic(re, im, ppu, max, size, p1s, newstarty, p1, newsizey, result, iterate_opt_1);
    if (r1) render_basic(re, im, ppu, max, r1s, newstarty, r1, newsizey, result, iterate_basic, size);
  }

  return;
}
