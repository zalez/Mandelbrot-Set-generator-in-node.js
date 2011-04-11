/*
 * mandelbrot-handler.js
 *
 * Basic handler for a mandelbrot server URL namespace in node.
 *
 * Can be mounted within a connect server instance.
 */

// Constants.

// Must match equal constants in mandelbrot-engine.js
const X_SIZE = 800;
const Y_SIZE = 600;

// Modules we want to use.
var connect = require('connect');
var mandelbrot = require('mandelbrot-engine.js');
var Png = require ('png').Png;

// Show a Mandelbrot set image.
function show_image(req, res) {
  var png = new Png(mandelbrot.render_basic(), X_SIZE, Y_SIZE, 'rgb');
  var png_image = png.encodeSync();

  res.writeHead(200, { "Content-Type": "image/png" });
  res.end(png_image.toString('binary'), 'binary');
}

exports.handler = show_image;
