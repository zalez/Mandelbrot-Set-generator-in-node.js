/*
 * Resize.js
 */

/*
 * A simple image buffer resizing library in JavaScript.
 */


// Matrix courtesy of http://www.embege.com/gauss/
const kernel = [ 
  0.07511360795411207, 0.12384140315297386, 0.07511360795411207, 
  0.12384140315297386, 0.20417995557165622, 0.12384140315297386, 
  0.07511360795411207, 0.12384140315297386, 0.07511360795411207
];

const rgb_kernel = [
  kernel[0], kernel[0], kernel[0], kernel[1], kernel[1], kernel[1], kernel[2], kernel[2], kernel[2],
  kernel[3], kernel[3], kernel[3], kernel[4], kernel[4], kernel[4], kernel[5], kernel[5], kernel[5],
  kernel[6], kernel[6], kernel[6], kernel[7], kernel[7], kernel[7], kernel[8], kernel[8], kernel[8]
];

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
  var newsize = size / 3;
  var newimage = Buffer(newsize * newsize * 3);

  var j = 0; // index for the source buffer.
  var r = 0, g = 0, b = 0; 

  for (var y = 0; y < newsize; y++) {
    for (var x = 0; x < newsize; x++) {
      j = y * size * 3 + x * 3; // Corresponding position in source array.
      i = y * newsize * 3 + x * 3; // Corresponding position in destination array.

      // top row, red, green and blue.
      r = image[j++] * kernel[0]; // top left red
      g = image[j++] * kernel[0]; // top left green
      b = image[j++] * kernel[0]; // top left blue

      r += image[j++] * kernel[1]; // top center red
      g += image[j++] * kernel[1]; // top center green
      b += image[j++] * kernel[1]; // ...and so on.

      r += image[j++] * kernel[2];
      g += image[j++] * kernel[2];
      b += image[j]   * kernel[2];

      // middle row
      j += size * 3; // Skip to next line in the source image

      b += image[j--] * kernel[5];
      g += image[j--] * kernel[5];
      r += image[j--] * kernel[5];

      b += image[j--] * kernel[4];
      g += image[j--] * kernel[4];
      r += image[j--] * kernel[4];

      b += image[j--] * kernel[3];
      g += image[j--] * kernel[3];
      r += image[j]   * kernel[3];

      // bottom row
      j += size * 3; // Skip again to next source line
  
      r += image[j++] * kernel[6];
      g += image[j++] * kernel[6];
      b += image[j++] * kernel[6];

      r += image[j++] * kernel[7];
      g += image[j++] * kernel[7];
      b += image[j++] * kernel[7];

      r += image[j++] * kernel[8];
      g += image[j++] * kernel[8];
      b += image[j]   * kernel[8];

      newimage[i++] = Math.floor(r);
      newimage[i++] = Math.floor(g);
      newimage[i++] = Math.floor(b);
    }
  }

  return newimage;
}

