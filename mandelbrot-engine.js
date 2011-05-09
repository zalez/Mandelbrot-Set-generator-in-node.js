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


/*
 * "Object" definitions for Mandelbrot set image stuctures.
 */

// Describe a particular point of the mandelbrot set, with a max iteration value.
function point(re, im, max) {
  this.re = re;
  this.im = im;
  this.max = max;
  return;
}

// A method for image: Clear the buffer.
function image_clear() {
  for (var i = 0; i < this.size * this.size; i++) {
    this.buffer[i] = 0.0;
  }
  return;
};

/*
 * Describe an image table for a rendition of the Mandelbrot set.
 * buffer: An array containing iteration results, one per x/y coordinate. If this is
 *         null, a new buffer will be created.
 * size:   The total width and height of the image. An index + size brings us to the next line
 *         at the same x co-ordinate. This also means that the whole image is always quadratic.
 * x,y:    Starting co-ordinates of the subimage.
 * sx, sy: x and y sizes of the subimage.
 */
function image(buffer, size, x, y, sx, sy) {
  if (buffer != null) {
    this.buffer = buffer;
  } else {
    this.buffer = new Array(size * size);
  }

  this.size = size;
  this.x = x;
  this.y = y;
  this.sx = sx;
  this.sy = sy;

  // Convenience values.

  // Number of index values to go from the end of a line to the beginning of next.
  this.xextra = this.size - this.sx;
  this.startpos = this.y * this.size + this.x;

  // Add a method for clearing the whole image buffer
  this.clear = image_clear;

  return;
}

// Method for mandset: Return a new mandset Object that references the specified subimage.
function mandset_subimage(x, y, sizex, sizey) {
  return new mandset(
    this.center,
    new image(this.image.buffer, this.image.size, x, y, sizex, sizey),
    this.ppu
  );
}

/*
 * Method for mandset: Return a new mandset which describes the intersection with the given
 * coordinates in the complex plane. This is used to apply different optimizations to different
 * areas of interest in the set.
 *
 * Args:
 * re1, im1: Top left corner of the region to intersect with. Can be null for "unlimited top/left".
 * re2, im2: Bottom right corner of the region to intersect with. Can be null for "unlimited bottom/right".
 *
 * Returns:
 * A new mandset Object with an image region that is the intersection of the old Object and the parameters.
 */
function mandset_intersect(re1, im1, re2, im2) {
  var newx = this.image.x;
  var newy = this.image.y;
  var newsx = this.image.sx;
  var newsy = this.image.sy;

  // Figure out the new x and sx values.
  if (re1 == null || re1 <= this.lre) { // Keep newx = x;
    if (re2 != null && this.rre > re2) {
      newsx = Math.floor((re2 - this.lre) * this.ppu + 0.5); // +0.5 so we can avoid floating point SNAFUs.
    } // Otherwise keep newsx = old sx.
  } else {
    newx = Math.floor((re1 - this.lre) * ppu + 0.5);
    if (re2 != null && this.rre > re2) {
      newsx = Math.floor((re2 - newx) * this.ppu + 0.5); // +0.5 so we can avoid floating point SNAFUs.
    } else {
      newsx = Math.floor((this.rre - newx) * this.ppu + 0.5);
    }
  }

  // Figure out the new y and sy values.
  if (im1 == null || im1 >= this.tim) { // Keep newy = y;
    if (im2 != null && this.bim < im2) {
      newsy = Math.floor((this.tim - im2) * this.ppu + 0.5); // +0.5 so we can avoid floating point SNAFUs.
    } // Otherwise keep newsx = old sx.
  } else {
    newy = Math.floor((this.tim - im1) * ppu + 0.5);
    if (im2 != null && this.bim < im2) {
      newsy = Math.floor((newy - im2) * this.ppu + 0.5); // +0.5 so we can avoid floating point SNAFUs.
    } else {
      newsy = Math.floor((newy - this.tim) * this.ppu + 0.5);
    }
  }
    
  return this.subimage(newx, newy, newsx, newsy);

}

// Method for mandset: Dump data for diagnostic purposes.
function mandset_dump() {
  return "Center: " + this.center.re + " + " + this.center.im + "i. Max: " + this.center.max + "\n" +
    "Image: Size: " + this.image.size + ", x: " + this.image.x + ", y:" + this.image.y + ", " + this.image.sx + "x" + this.image.sy + "\n" +
    "Minre: " + this.minre + ", Maxim: " + this.maxim + "\n";
}

/*
 * Describe a Mandelbrot set rendition.
 * center: A point referencing the center of the mandelbrot set to be rendered, plus max iteration.
 * image:  The image (portion) to render into.
 * ppu:    The resolution: How many pixels to use per complex plane unit.
 */
function mandset(center, img, ppu) {
  this.center = center;
  this.image = img;
  this.ppu = ppu;

  // Convenience values
  this.inc = 1 / this.ppu; // The increment in complex value per pixel.
  // Minimum real and maximum imaginary values for the whole image.
  this.minre = this.center.re - (this.image.size / this.ppu) / 2;
  this.maxim = this.center.im + (this.image.size / this.ppu) / 2;

  // Figure out the real and imaginary values for the 4 corners of the (sub)image.
  this.lre = this.minre + this.image.x * this.inc;      // Left real.
  this.rre = this.lre + (this.image.sx - 1) * this.inc; // Right real.
  this.tim = this.maxim - this.image.y * this.inc;      // Top imaginary.
  this.bim = this.tim - (this.image.sy - 1) * this.inc; // Bottom imaginary.

  // Add a method for returning a subimage.
  this.subimage = mandset_subimage;

  // Add a method for returning an intersectio with a complex rectangular area.
  this.intersect = mandset_intersect;

  // Add a method for dumping our data.
  this.dump = mandset_dump;
  
  return;
}

/*
 * Set up a buffer, then render the Mandelbrot set into it.
 */
exports.render = function (size, re, im, ppu, max, opt) {
  // Create some data structures.
  var center = new point(re, im, max);
  // The subimage structure contains the whole image at first.
  var img = new image(null, size, 0, 0, size, size); // The whole image.
  // Now combine into the mandelbrot set structure.
  var set = new mandset(center, img, ppu);

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
      render_basic(set, iterate_basic);
      return set.image.buffer;

    case 2:
      render_basic(set, iterate_opt);
      return set.image.buffer;

    case 3:
      // The subdivision algorithm assumes that the buffer has been zeroed.
      set.image.clear();
      render_opt(set, iterate_basic);
      return set.image.buffer;

    case 4:
      // The subdivision algorithm assumes that the buffer has been zeroed.
      set.image.clear();
      render_opt(set, iterate_opt);
      return set.image.buffer;

    default: // 0 = 5 = best algorithm.
      // The subdivision algorithm assumes that the buffer has been zeroed.
      set.image.clear();
      render_adaptive(set);
      return set.image.buffer;
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
 */
function render_basic(set, iterator) {
  var zre = 0;
  var zim = 0;

  var pos = set.image.startpos;

  // For debugging.
  //process.stdout.write("Render Basic:\n" + set.dump());

  for (var y = set.image.y; y < set.image.y + set.image.sy; y++) {
    zim = set.maxim - y * set.inc;
    for (var x = set.image.x; x < set.image.x + set.image.sx; x++) {
      zre = set.minre + x * set.inc;
      set.image.buffer[pos++] = iterator(zre, zim, set.center.max);
    }
    pos += set.image.xextra;
  }

  return;
}

/*
 * Walk the circumference of a quadratic area of the mandelbrot set and compute the iterations.
 * Return 0 if all results were 0, 1 otherwise.
 * This will be used to determine if a quadratic area is contained in the Mandelbrot set. Its
 * inner part doesn't need to be rendered if the circumference is completelty part of it.
 */
function walk_around(set, iterator) {
  // We draw 4 lines simultaneously to minimize loop overhead.
  var pos1 = set.image.startpos
  var pos2 = pos1 + set.image.sx - 1;
  var pos3 = pos2 + set.image.size * (set.image.sy - 1);
  var pos4 = pos3 - set.image.sx + 1;
  var zre1 = set.lre;
  var zre2 = set.rre;
  var zre3 = zre2;
  var zre4 = zre1;
  var zim1 = set.tim;
  var zim2 = zim1;
  var zim3 = set.bim
  var zim4 = zim3;
  var touche = 0;

  // Walk the horizontal paths
  for (var i = 0; i < set.image.sx - 1; i++) { // No need to go all the way, the corner's covered elsewhere.
    // Upper edge
    if (set.image.buffer[pos1++] = iterator(zre1, zim1, set.center.max)) touche = 1;
    zre1 += set.inc;

    // Bottom edge
    if (set.image.buffer[pos3--] = iterator(zre3, zim3, set.center.max)) touche = 1;
    zre3 -= set.inc;
  }

  // Walk the vertical paths
  for (var i = 0; i < set.image.sy - 1; i++) { // No need to go all the way, the corner's covered elsewhere.
    // Right edge
    if (set.image.buffer[pos2] = iterator(zre2, zim2, set.center.max)) touche = 1;
    zim2 -= set.inc;
    pos2 += set.image.size;

    // Left edge
    if (set.image.buffer[pos4] = iterator(zre4, zim4, set.center.max)) touche = 1;
    zim4 += set.inc;
    pos4 -= set.image.size;
  }

  return touche;
}

/*
 * Render a horizontal line of pixels. We'll render the top line of the image specified in the set.
 */
function render_hline(set, iterator) {
  var pos = set.image.startpos;
  var zre = set.lre;
  for (var x = set.image.x; x < set.image.x + set.image.sx; x++) {
    set.image.buffer[pos++] = iterator(zre, set.tim, set.center.max);
    zre += set.inc; 
  }
  return;
}

/*
 * Render a vertical line of pixels. We'll render the left vertical line of the image given.
 */
function render_vline(set, iterator) {
  var pos = set.image.startpos;
  var zim = set.tim;
  for (var y = set.image.y; y < set.image.y + set.image.sy; y++) {
    set.image.buffer[pos] = iterator(set.lre, zim, set.center.max);
    pos += set.image.size;
    zim -= set.inc; 
  }
  return;
}

/*
 * Segment the picture into quadrants, then apply some optimization by figuring out if the
 * circumference of a quadrant is contained inside the Mandelbrot set. Since the Mandelbrot
 * set is interconnected, there can't be any holes or islands, so if the whole circumference
 * of a quadrant is 0, the whole quadrant must be.
 *
 * We will call this function recursively to look at sub-tiles.
 *
 * Inputs:
 * set:      A data structure describing the set and the (sub)image.
 *           We assume that the buffer has been zeroed from the beginning.
 * iterator: A function that computes the Mandelbrot set iteration for us.
 *
 * Assumption: The image to be rendered are quadratic. We will only use set.image.sx
 *             for determining a quadratic tile's size.
 */
function render_opt(set, iterator) {
  var pos = set.image.startpos;

  // For debugging.
  //process.stdout.write("Render Opt:\n" + set.dump());

  // Treat the lower subsizes as special cases to save on overhead.
  switch (set.image.sx) {
    case 1:
      set.image.buffer[pos] = iterator(set.lre, set.tim, set.center.max);
      return;

    // Special case: If we're just a 2x2 subtile, render all.
    case 2:
      set.image.buffer[pos++] = iterator(set.lre, set.tim, set.center.max); // Top left pixel.
      set.image.buffer[pos] = iterator(set.rre, set.tim, set.center.max); // Top right pixel.
      pos += set.image.size;
      set.image.buffer[pos--] = iterator(set.rre, set.bim, set.center.max); // Bottom right pixel.
      set.image.buffer[pos] = iterator(set.lre, set.bim, set.center.max); // Bottom left pixel.
      return;

    // Special case: 3x3.
    case 3:
      var touche = 0;
      var zre = set.lre;
      var zim = set.tim;

      // Walk the 3x3 circumference by hand. Faster than a subroutine and/or loop.
      if (set.image.buffer[pos++] = iterator(zre, zim, set.center.max)) touche = 1;
      zre += set.inc;
      if (set.image.buffer[pos++] = iterator(zre, zim, set.center.max)) touche = 1;
      zre += set.inc;
      if (set.image.buffer[pos] = iterator(zre, zim, set.center.max)) touche = 1;
      zim += set.inc;
      pos += set.image.size;
      if (set.image.buffer[pos] = iterator(zre, zim, set.center.max)) touche = 1;
      zim += set.inc;
      pos += set.image.size;
      if (set.image.buffer[pos--] = iterator(zre, zim, set.center.max)) touche = 1;
      zre -= set.inc;
      if (set.image.buffer[pos--] = iterator(zre, zim, set.center.max)) touche = 1;
      zre -= set.inc;
      if (set.image.buffer[pos] = iterator(zre, zim, set.center.max)) touche = 1;
      pos -= set.image.size;
      zim -= set.inc;
      if (set.image.buffer[pos++] = iterator(zre, zim, set.center.max)) touche = 1;
      // Fill the rectangle only if needed.
      if (touche) {
        zre += set.inc;
        set.image.buffer[pos] = iterator(zre, zim, set.center.max);
      }
      return;

    // Special case: 4x4.
    case 4:
      var touche = 0;
      var zre = set.lre;
      var zim = set.tim;

      // Walk the 4x4 circumference by hand. Faster than a subroutine and/or loop.
      if (set.image.buffer[pos++] = iterator(zre, zim, set.center.max)) touche = 1;
      zre += set.inc;
      if (set.image.buffer[pos++] = iterator(zre, zim, set.center.max)) touche = 1;
      zre += set.inc;
      if (set.image.buffer[pos++] = iterator(zre, zim, set.center.max)) touche = 1;
      zre = set.rre;
      if (set.image.buffer[pos] = iterator(zre, zim, set.center.max)) touche = 1;
      zim += set.inc;
      pos += set.image.size;
      if (set.image.buffer[pos] = iterator(zre, zim, set.center.max)) touche = 1;
      zim += set.inc;
      pos += set.image.size;
      if (set.image.buffer[pos] = iterator(zre, zim, set.center.max)) touche = 1;
      zim = set.bim;
      pos += set.image.size;
      if (set.image.buffer[pos--] = iterator(zre, zim, set.center.max)) touche = 1;
      zre -= set.inc;
      if (set.image.buffer[pos--] = iterator(zre, zim, set.center.max)) touche = 1;
      zre -= set.inc;
      if (set.image.buffer[pos--] = iterator(zre, zim, set.center.max)) touche = 1;
      zre == set.lre;
      if (set.image.buffer[pos] = iterator(zre, zim, set.center.max)) touche = 1;
      pos -= set.image.size;
      zim -= set.inc;
      if (set.image.buffer[pos] = iterator(zre, zim, set.center.max)) touche = 1;
      pos -= set.image.size;
      zim -= set.inc;
      if (set.image.buffer[pos++] = iterator(zre, zim, set.center.max)) touche = 1;

      // Fill the rectangle only if needed.
      if (touche) {
        zre += set.inc;
        set.image.buffer[pos++] = iterator(zre, zim, set.center.max);
        zre += set.inc;
        set.image.buffer[pos] = iterator(zre, zim, set.center.max);
        zim += set.inc;
        pos += set.image.size;
        set.image.buffer[pos--] = iterator(zre, zim, set.center.max);
        zre -= set.inc;
        set.image.buffer[pos] = iterator(zre, zim, set.center.max);
      }

      return;

    default:
      // Walk the circumference of the buffer, then figure out if all values were equal.

      if (walk_around(set, iterator)) {

        var newsize = 0;
        // Figure out how to best subdivide the remainder.
        if ((set.image.sx - 2) % 2 == 0) { // We can divide the remainder evenly
          newsize = (set.image.sx - 2) >> 1;
          render_opt(set.subimage(set.image.x + 1, set.image.y + 1, newsize, newsize), iterator);
          render_opt(set.subimage(set.image.x + 1 + newsize, set.image.y + 1, newsize, newsize), iterator);
          render_opt(set.subimage(set.image.x + 1, set.image.y + 1 + newsize, newsize, newsize), iterator);
          render_opt(set.subimage(set.image.x + 1 + newsize, set.image.y + 1 + newsize, newsize, newsize), iterator);
        } else if ((set.image.sx - 2) % 3 == 0) { // We can subdivide by 3.
          newsize = Math.floor((set.image.sx - 2) / 3); // Protect against float imprecision.
          render_opt(set.subimage(set.image.x + 1, set.image.y + 1, newsize, newsize), iterator);
          render_opt(set.subimage(set.image.x + 1 + newsize, set.image.y + 1, newsize, newsize), iterator);
          render_opt(set.subimage(set.image.x + 1 + (newsize << 1), set.image.y + 1, newsize, newsize), iterator);
          render_opt(set.subimage(set.image.x + 1, set.image.y + 1 + newsize, newsize, newsize), iterator);
          render_opt(set.subimage(set.image.x + 1 + newsize, set.image.y + 1 + newsize, newsize, newsize), iterator);
          render_opt(set.subimage(set.image.x + 1 + (newsize << 1), set.image.y + 1 + newsize, newsize, newsize), iterator);
          render_opt(set.subimage(set.image.x + 1, set.image.y + 1 + (newsize << 1), newsize, newsize), iterator);
          render_opt(set.subimage(set.image.x + 1 + newsize, set.image.y + 1 + (newsize << 1), newsize, newsize), iterator);
          render_opt(set.subimage(set.image.x + 1 + (newsize << 1), set.image.y + 1 + (newsize << 1), newsize, newsize), iterator);
        } else { // A generic uneven subsize.
          // Render 1 pixel stripes at bottom and right, then subdivide by 2.
          render_hline(set.subimage(set.image.x, set.image.y + set.image.sy - 2, set.image.sx - 1, 1), iterator);
          render_vline(set.subimage(set.image.x + set.image.sx - 2, set.image.y, 1, set.image.sy - 1), iterator);
           
          newsize = (set.image.sx - 3) >> 1;
          render_opt(set.subimage(set.image.x + 1, set.image.y + 1, newsize, newsize), iterator);
          render_opt(set.subimage(set.image.x + 1 + newsize, set.image.y + 1, newsize, newsize), iterator);
          render_opt(set.subimage(set.image.x + 1, set.image.y + 1 + newsize, newsize, newsize), iterator);
          render_opt(set.subimage(set.image.x + 1 + newsize, set.image.y + 1 + newsize, newsize, newsize), iterator);
        }
        return;
    }
  }
}

/*
 * Subdivide the given subarea of the Mandelbrot set into quadratic regions that are as large as
 * possible, then render them using the optimized quadratic method.
 */
function subdivide_quadratic(set, iterator) {
  // Perhaps we're already quadratic?
  if (set.image.sx == set.image.sy) {
    render_opt(set, iterator);
    return;
  } else if (set.image.sx > set.image.sy) { // wider than tall
    var subsize = set.image.sy;
    // Render all quadratic areas with size y
    var x = 0;
    for (x = set.image.x; x < set.image.x + set.image.sx - subsize; x += subsize) {
      render_opt(set.subimage(x, set.image.y, subsize, subsize), iterator);
    }
    // Recurse over the rest, if necessary.
    if (set.image.sx % subsize) {
      subdivide_quadratic(set.subset(x, set.image.y, set.image.sx % subsize, set.image.sy), iterator);
    } else { // If there's no rest, then there's still one more left to render.
      render_opt(set.subset(x, set.image.y, subsize, subsize), iterator);
    }
    return;
  } else { // taller than wide
    var subsize = set.image.sx;
    // Render all quadratic areas with size x
    var y = 0;
    for (y = set.image.y; y < set.image.y + set.image.sy - subsize; y += subsize) {
      render_opt(set.subimage(set.image.x, y, subsize, subsize), iterator);
    }
    // Recurse over the rest, if necessary.
    if (set.image.sy % subsize) {
      subdivide_quadratic(set.subset(set.image.x, y, set.image.sx, set.image.sy & subsize), iterator);
    } else {
      render_opt(set.subimage(set.image.x, y, subsize, subsize), iterator);
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
function render_adaptive(set) {
  // We will fill a todo-list-array with set descriptions, method and iterators, then
  // go through that todo list.
  var todo = [];
  var newset = null;

  // Render the top part until +1.2i with minimal optimization, as it's very easy anyway.
  newset = set.intersect(null, null, null, 1.2);
  if (newset.image.sy > 0) {
    todo.push({
      set: newset,
      method: "basic",
      iterator: iterate_basic
    });
  }


  // Use more optimization for the part between 1.2i and 0.75i. No need to test for bulbs, though.
  // Use the brain-dead algorithm for everything < 0.75 (re) and the subdivision algorithm for the right part.
  newset = set.intersect(null, 0.75, 1.2, 0.75);
  if (newset.image.sy > 0 && newset.image.sx > 0) {
    todo.push({
      set: newset,
      method: "basic",
      iterator: iterate_basic
    });
  }

  newset = set.intersect(0.75, null, 1.2, 0.75);
  if (newset.image.sy > 0 && newset.image.sx > 0) {
    todo.push({
      set: newset,
      method: "subdivide",
      iterator: iterate_basic
    });
  }
  
  // Complete todo-list.
  for (var i = 0; i < todo.length; i++) {
    switch (todo[i].method) {
      case "basic":
        render_basic(todo[i].set, todo[i].iterator);
        break;

      case "subdivide":
        subdivide_quadratic(todo[i].set, todo[i].iterator);
        break;
    }
  }
}

/*
 * Render the Mandelbrot set using adaptive optimization: Decompose the image into areas,
 * then select the right strategies for each area.
 * Old, unused implementation, for reference use only.
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
