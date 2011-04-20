/*
 * Resize.js
 */

/*
 * A simple image buffer resizing library in JavaScript.
 */

// Compute the n x n Gaussian kernel with sigma s, for use in applying the filter.
exports.gauss = function(n, s) {
  var kernel = new Array(n * n);
  var center = n/2; 
  var x = 0, y = 0;
  var sum = 0;
  var sample = 0;

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

// Compute the n x n Mitchell-Netravali filter kernel with parameters b and c.
exports.mitchell = function(n, b, c) {
  var kernel = new Array(n * n);
  var center = n / 2;
  var x = 0, y = 0;
  var sum = 0;
  var m = 0;
  var sample = 0;

  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) {
      y = i - center;
      x = j - center;

      // First pass, horizontal.
      m = Math.abs(x); // Modulus of x
      if (m < 1) {
        sample = ((12 - 9 * b - 6 * c) * m * m * m + (-18 + 12 * b + 6 * c) * m * m) / 6;
      } else if (m < 2) {
        sample = ((-b - 6 * c) * m * m * m + (6 * b + 30 * c) * m * m) / 6;
      } else {
        sample = 0;
      }

      // Second pass, vertical.
      m = Math.abs(y); // Modulus of y
      if (m < 1) {
        sample += ((12 - 9 * b - 6 * c) * m * m * m + (-18 + 12 * b + 6 * c) * m * m) / 6;
      } else if (m < 2) {
        sample += ((-b - 6 * c) * m * m * m + (6 * b + 30 * c) * m * m) / 6;
      } else {
        sample += 0;
      }

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
 * Resize a quadratic image to an nth of its size using a supplied kernel. Assumes that the
 * Image is quadratic and that the size is dividable by n.
 *
 * image:  A node.js Buffer containing the source image in rgb notation.
 * size:   The size of the source image.
 * n:      The factor to shrink the image by.
 * kernel: The filter kernel to use.
 *
 * Returns: A node.js Buffer with the result image, 1/n of the size.
 */
exports.resizento1 = function (image, size, n, kernel) {
  var stride = size * 3;
  var newsize = size / n;
  var newimage = new Buffer(newsize * newsize * 3);

  var i = 0, j = 0, r = 0, g = 0, b = 0, m = 0;
  for (var y = 0; y < newsize; y++) {
    for (var x = 0; x < newsize; x++) {
      r = 0; g = 0; b = 0; m = 0;
      for (var k = 0; k < n; k++) {
        for (var l = 0; l < n ; l++) {
          r += image[j++] * kernel[m];
          g += image[j++] * kernel[m];
          b += image[j++] * kernel[m++];
        }
        j += stride - n * 3;
      }

      // Write the new values down
      newimage[i++] = r;
      newimage[i++] = g;
      newimage[i++] = b;

      // Bring the j index to the next pixel
      j -= stride * n - n * 3;
    }
    // Bring the j index to the next row
    j += stride * (n - 1);
  }

  return newimage;
}

