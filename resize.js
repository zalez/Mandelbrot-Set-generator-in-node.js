/*
 * Resize.js
 */

/*
 * A simple image buffer resizing library in JavaScript.
 */

// The Gauss Kernel, courtesy of http://www.embege.com/gauss/
const gauss = [
0.07511360795411207, 0.12384140315297386, 0.07511360795411207, 
0.12384140315297386, 0.20417995557165622, 0.12384140315297386, 
0.07511360795411207, 0.12384140315297386, 0.07511360795411207
]

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
      // Apply Filter kernel

      r = image[j++] * gauss[0];
      g = image[j++] * gauss[0];
      b = image[j++] * gauss[0];

      r += image[j++] * gauss[1];
      g += image[j++] * gauss[1];
      b += image[j++] * gauss[1];

      r += image[j++] * gauss[2];
      g += image[j++] * gauss[2];
      b += image[j] * gauss[2];

      j += stride;

      b += image[j--] * gauss[5];
      g += image[j--] * gauss[5];
      r += image[j--] * gauss[5];

      b += image[j--] * gauss[4];
      g += image[j--] * gauss[4];
      r += image[j--] * gauss[4];

      b += image[j--] * gauss[3];
      g += image[j--] * gauss[3];
      r += image[j] * gauss[3];

      j += stride;

      r += image[j++] * gauss[6];
      g += image[j++] * gauss[6];
      b += image[j++] * gauss[6];

      r += image[j++] * gauss[7];
      g += image[j++] * gauss[7];
      b += image[j++] * gauss[7];

      r += image[j++] * gauss[8];
      g += image[j++] * gauss[8];
      b += image[j++] * gauss[8];

      // Write the new values down
      newimage[i++] = r;
      newimage[i++] = g;
      newimage[i++] = b;

      // Bring the j index to the next pixel
      j -= stride << 1;
    }
    // Bring the j index to the next row
  }

  return newimage;
}

