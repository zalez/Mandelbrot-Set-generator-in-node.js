/*
 * colormap.js
 *
 * A module to deal with colormaps when rendering JavaScript
 */

// Generate a colormap of the given size. This is a table with 3-color-entries, each color a byte.
exports.colormap = function (size) {
  colormap = new Array(size);
  var j = 0;

  for (var i = 0; i < size; i++) {
    j = i / size;
    colormap[i] = [
      (Math.sin(j * 2 * Math.PI) + 1) * 255,
      (Math.sin(j * 3 * Math.PI) + 1) * 255,
      (Math.sin(j * 4 * Math.PI) + 1) * 255
    ]
  }

  // The entry for 0 is always black
  colormap [0] = [0,0,0];
  
  return colormap;
}