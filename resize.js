/*
 * Resize.js
 */

/*
 * A simple image buffer resizing library in JavaScript.
 */

// Compute the n x n Gaussian kernel with sigma s, for use in applying the filter.
function gauss(n, s) {
  var kernel = new Array(n * n);
  var center = n/2; 
  var x = 0, y = 0;
  var sum = 0;

  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) {
      y = i - center;
      x = j - center;
      sample = (1/(2 * Math.PI * (s*s))) * Math.exp(- ((x*x+y*y)/(2*s*s)));
      sum += sample;
      kernel[i * n + j] = sample;
    }
  }

  // Normalize the kernel.
  for (var i = 0; i < n * n; i++) {
    kernel[i] = kernel[i] / sum;
  }

  return kernel;
}

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
  var stride = size * 3;
  var newsize = size / 3;
  var newimage = new Buffer(newsize * newsize * 3);
  var kernel = gauss(3, 0.5);

  // Apply the Gauss filter
  var i = 0, j = 0, r = 0, g = 0, b = 0;
  for (var y = 0; y < newsize; y++) {
    for (var x = 0; x < newsize; x++) {
      // Apply Filter kernel

      r  = image[j++] * kernel[0];
      g  = image[j++] * kernel[0];
      b  = image[j++] * kernel[0];

      r += image[j++] * kernel[1];
      g += image[j++] * kernel[1];
      b += image[j++] * kernel[1];

      r += image[j++] * kernel[2];
      g += image[j++] * kernel[2];
      b += image[j]   * kernel[2];

      j += stride;

      b += image[j--] * kernel[5];
      g += image[j--] * kernel[5];
      r += image[j--] * kernel[5];

      b += image[j--] * kernel[4];
      g += image[j--] * kernel[4];
      r += image[j--] * kernel[4];

      b += image[j--] * kernel[3];
      g += image[j--] * kernel[3];
      r += image[j]   * kernel[3];

      j += stride;

      r += image[j++] * kernel[6];
      g += image[j++] * kernel[6];
      b += image[j++] * kernel[6];

      r += image[j++] * kernel[7];
      g += image[j++] * kernel[7];
      b += image[j++] * kernel[7];

      r += image[j++] * kernel[8];
      g += image[j++] * kernel[8];
      b += image[j++] * kernel[8];

      // Write the new values down
      newimage[i++] = r;
      newimage[i++] = g;
      newimage[i++] = b;

      // Bring the j index to the next pixel
      j -= stride << 1;
    }
    // Bring the j index to the next row
    j += stride << 1;
  }

  return newimage;
}

/*
 * Resize a quadratic image to an nth of its size using a supplied kernel. Assumes that the
 * Image is quadratic and that the size is dividable by n.
 *
 * image: A node.js Buffer containing the source image in rgb notation.
 * size:  The size of the source image.
 * n: The factor to shrink the image by.
 *
 * Returns: A node.js Buffer with the result image, 1/5 of the size.
 */
exports.resizento1 = function (image, size, n) {
  var stride = size * n;
  var newsize = size / n;
  var newimage = new Buffer(newsize * newsize * 3);
  var kernel = gauss(n, 0.5);

  var i = 0, j = 0, r = 0, g = 0, b = 0;
  for (var y = 0; y < newsize; y++) {
    for (var x = 0; x < newsize; x++) {
      r = 0; g = 0; b = 0;
      for (var k = 0; k < n; k++) {
        for (var l = 0; l < n ; l++) {
          r += image[j++] * kernel[k * n + l];
          g += image[j++] * kernel[k * n + l];
          b += image[j++] * kernel[k * n + l];
        }
        j += stride - n * 3;
      }

      // Write the new values down
      newimage[i++] = r;
      newimage[i++] = g;
      newimage[i++] = b;

      // Bring the j index to the next pixel
      j -= stride * (n - 1);
    }
    // Bring the j index to the next row
    j += stride * (n - 1);
  }

  return newimage;
}

