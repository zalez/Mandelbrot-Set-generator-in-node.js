/*
 * Resize.js
 */

/*
 * A simple image buffer resizing library in JavaScript.
 */

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
  var i = 0, j = 0;
  for (var y = 0; y < newsize; y++) {
    for (var x = 0; x < newsize; x++) {
      i = y * newstride + x * 3;  // Index into the new array. * 3 due to rgb tuples.
      j = y * stride + x * 3 * 3; 

      newimage[i++] = image[j++];
      newimage[i++] = image[j++];
      newimage[i] = image[j];
    }
  }

  return newimage;
}

