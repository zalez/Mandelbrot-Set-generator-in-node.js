/*
 * mandelbrot-handler.js
 *
 * Basic handler for a mandelbrot server URL namespace in node.
 *
 * Can be mounted within a connect server instance.
 */

// Constants.

// Image constants.
const SIZE = 512; // Default value
const MAX_SIZE = 10000;

// Which subset to render?
const RE_CENTER = -0.75; // X-Center of the picture will represent this value on the real axis.
const IM_CENTER = 0.0;   // Y-Center of the picture will represent this value on the imaginary axis.
const PXPERUNIT = 150;   // How much units in the complex plane are covered by one pixel?

// Other iteration parameters.
const MAX_ITER = 300;
const COLORS = MAX_ITER * 10;
const OPT = 3; // Whether to use the optimized subseparation algorithm
const MAX_OPT = 4;

// We'll render at a much higher size than the image we produce, so we can get antialiasing.
const AA = 0; // Whether to perform anti-aliasing or not.
const AA_FACTOR = 3;

// Modules we want to use.
var connect = require('connect');
var mandelbrot = require('mandelbrot-engine.js');
var colormap = require('colormap.js');

var Png = require ('png').Png;

var Resize = require ('resize.js');

var url = require ('url')

// Show a Mandelbrot set image.
function show_image(req, res) {
  // Extract parameters from the request
  var params = url.parse(req.url, true);

  // Check parameters and determine final values
  var size = Number(params.query.size) || SIZE;
  if (size == Number.NaN) size = SIZE;
  if (size > MAX_SIZE) size = MAX_SIZE;
  if (size < 0) size = SIZE;
  
  var ppu = Number(params.query.ppu) || PXPERUNIT;
  if (ppu == Number.NaN) ppu = PXPERUNIT;
  if (ppu < 0) ppu = PXPERUNIT;
  
  var max = Number(params.query.max) || MAX_ITER;
  if (max == Number.NaN) max = MAX_ITER;
  if (max < 0) max = MAX_ITER;
  
  var opt = Number(params.query.opt) || OPT;
  if (opt == Number.NaN) opt = OPT;
  if (opt < 0) opt = OPT;
  if (opt > MAX_OPT) opt = OPT;
  
  var aa = Number(params.query.aa) || AA;
  if (aa == Number.NaN) aa = AA;
  if (aa < 0) aa = AA;
  if (aa > 1) aa = AA;

  // Render a Mandelbrot set into a result array
  if (aa) {
    var rendersize = size * AA_FACTOR;
  }
  var result = mandelbrot.render(rendersize, RE_CENTER, IM_CENTER, ppu, max, opt);

  // Create a colormap.
  var map = colormap.colormap(COLORS);

  // Create an image buffer.
  var image = new Buffer(rendersize * rendersize * 3);

  // Fill the image buffer with the result from the Mandelbrot set, mapped to the colormap.
  var pos = 0;
  var color = [];
  for (i = 0; i < rendersize * rendersize; i++) {
    index=Math.floor(result[i]*COLORS);
    color = map[index];
    image[pos++] = color[0];
    image[pos++] = color[1];
    image[pos++] = color[2];
  }

  // Resize the image using a Gaussian filter to provide high quality anti-aliasing.
  if (aa) {
    clean_image = Resize.resize3to1(image, rendersize);
  } else {
    clean_image = image;
  }

  // Convert the image into PNG format.
  var png_image = new Png(clean_image, size, size, 'rgb');
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
