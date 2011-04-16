/*
 * mandelbrot-handler.js
 *
 * Basic handler for a mandelbrot server URL namespace in node.
 *
 * Can be mounted within a connect server instance.
 */

// Constants.

// Image constants.
const X_SIZE = 800.0; // Default value
const Y_SIZE = 600.0; // Default value
const MAX_X_SIZE = 10000;
const MAX_Y_SIZE = 10000;

// Which subset to render?
const RE_CENTER = -0.75; // X-Center of the picture will represent this value on the real axis.
const IM_CENTER = 0.0;   // Y-Center of the picture will represent this value on the imaginary axis.
const PXPERUNIT = 150;   // How much units in the complex plane are covered by one pixel?

// Other iteration parameters.
const MAX_ITER = 100;
const COLORS = MAX_ITER * 10;

// Modules we want to use.
var connect = require('connect');
var mandelbrot = require('mandelbrot-engine.js');
var colormap = require('colormap.js');
var png = require ('png').Png;
var url = require ('url')

// Show a Mandelbrot set image.
function show_image(req, res) {
  // Extract parameters from the request
  var params = url.parse(req.url, true);

  // Check parameters and determine final values
  var xsize = Number(params.query.xsize) || X_SIZE;
  if (xsize == Number.NaN) {xsize = X_SIZE;}
  if (xsize > MAX_X_SIZE) { xsize = MAX_X_SIZE;}
  if (xsize < 0) {xsize = X_SIZE;}
  
  var ysize = Number(params.query.ysize) || Y_SIZE;
  if (ysize == Number.NaN) {ysize = X_SIZE;}
  if (ysize > MAX_Y_SIZE) {ysize = MAX_Y_SIZE;}
  if (ysize < 0) {ysize = Y_SIZE;}
  
  var ppu = Number(params.query.ppu) || PXPERUNIT;
  if (ppu == Number.NaN) {ppu = PXPERUNIT;}
  if (ppu < 0) {ppu = PXPERUNIT;}
  
  var max = Number(params.query.max) || MAX_ITER;
  if (max == Number.NaN) {max = MAX_ITER;}
  if (max < 0) {max = MAX_ITER;}

  // Render a Mandelbrot set into a result array
  var result = mandelbrot.render(xsize, ysize, RE_CENTER, IM_CENTER, ppu, max);

  // Create a colormap.
  var map = colormap.colormap(COLORS);

  // Create an image buffer.
  var image = new Buffer(xsize * ysize * 3);

  // Fill the image buffer with the result from the Mandelbrot set, mapped to the colormap.
  var pos = 0;
  var color = [];
  for (i = 0; i < xsize * ysize; i++) {
    index=Math.floor(result[i]*COLORS);
    color = map[index];
    image[pos++] = color[0];
    image[pos++] = color[1];
    image[pos++] = color[2];
  }

  // Convert the image into PNG format.
  var png_image = new png(image, xsize, ysize, 'rgb');
  var png_file = png_image.encodeSync();

  // Return the image to the browser.
  res.writeHead(200, { "Content-Type": "image/png" });
  res.end(png_file.toString('binary'), 'binary');
}

exports.handler = connect.router(function(app) {
  app.get('/', function(req, res) {
    res.writeHead(307, { "Location": "/mandelbrot/image.png" });
    res.end();
  });
  app.get('/image.png', show_image);
});
