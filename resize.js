/*
 * Resize.js
 */

/*
 * A simple image buffer resizing library in JavaScript.
 */

// The Gauss Kernel (crude approximation for now), normalized to 0.5 because applied twice.
const gauss = [0.275 / 2, 0.45 / 2, 0.275 / 2];

/*
 * Resize a quadratic image to a third of its size using a Gaussian kernel. Assumes that the
 * Image is quadratic and that the size is dividable by three.
 *
 * image: A node.js Buffer containing the source image in rgb notation.
 * size:  The size of the source image.
 *
 * Returns: A node.js Buffer with the result image, 1/3 of the size.
 */
exports.resize3to1 = function (image, size) {
  var stride = size * 3 * 3; // Due to rgb and 3 x size in both dimensions
  var newsize = size / 3;
  var newstride = newsize * 3; // rgb
  var newimage = new Buffer(newsize * newstride);

  // Apply the Gauss filter
  var i = 0, j = 0, r = 0, g = 0, b = 0;
  for (var y = 0; y < newsize; y++) {
    for (var x = 0; x < newsize; x++) {
      i = y * newstride + x * 3;  // Index into the new array. * 3 due to rgb tuples.

      // Apply Gauss kernel horizontally
      j = y * stride + x * 3 * 3; 

      r = image[j++] * gauss[0];
      g = image[j++] * gauss[0];
      b = image[j++] * gauss[0];

      r += image[j++] * gauss[1];
      g += image[j++] * gauss[1];
      b += image[j++] * gauss[1];

      r += image[j++] * gauss[0];
      g += image[j++] * gauss[0];
      b += image[j++] * gauss[0];

      // Apply Gauss kernel vertically
      j = y * stride + x * 3 * 3; 

      r += image[j++] * gauss[0];
      g += image[j++] * gauss[0];
      b += image[j] * gauss[0];

      j += stride - 2;
      r += image[j++] * gauss[1];
      g += image[j++] * gauss[1];
      b += image[j] * gauss[1];

      j += stride - 2;
      r += image[j++] * gauss[0];
      g += image[j++] * gauss[0];
      b += image[j] * gauss[0];

      // Write the new value down
      newimage[i++] = r;
      newimage[i++] = g;
      newimage[i++] = b;
    }
  }

  return newimage;
}

