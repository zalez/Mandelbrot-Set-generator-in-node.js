/*
 * mandelbrot-handler.js
 *
 * Basic handler for a mandelbrot server URL namespace in node.
 *
 * Can be mounted within a connect server instance.
 */

// Constants.

// Image constants.
const X_SIZE = 800.0;
const Y_SIZE = 600.0;

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
var Png = require ('png').Png;

// Show a Mandelbrot set image.
function show_image(req, res) {
  // Render a Mandelbrot set into a result array
  var result = mandelbrot.render(X_SIZE, Y_SIZE, RE_CENTER, IM_CENTER, PXPERUNIT, MAX_ITER);

  // Create a colormap.
  var map = colormap.colormap(COLORS);

  // Create an image buffer.
  var image = new Buffer(X_SIZE * Y_SIZE * 3);

  // Fill the image buffer with the result from the Mandelbrot set, mapped to the colormap.
  var pos = 0;
  var color = [];
  for (i = 0; i < X_SIZE * Y_SIZE; i++) {
    //color = map[Math.floor(result[i]*COLORS)];
    color = map[0];
    image[pos++] = color[0];
    image[pos++] = color[1];
    image[pos++] = color[2];
  }

  // Convert the image into PNG format.
  var png = new Png(image, X_SIZE, Y_SIZE, 'rgb');
  var png_image = png.encodeSync();

  // Return the image to the browser.
  res.writeHead(200, { "Content-Type": "image/png" });
  res.end(png_image.toString('binary'), 'binary');
}

exports.handler = connect.router(function(app) {
  app.get('/', function(req, res) {
    res.writeHead(307, { "Location": "/mandelbrot/image.png" });
    res.end();
  });
  app.get('/image.png', show_image);
});
