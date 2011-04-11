/*
 * server.js
 *
 * A simple connect HTTP server, used to dispatch to more interesting functions.
 *
 */

// Modules we want to use.
var connect = require('connect');

// Our self-written modules.
var simplemandelbrot = require('simplemandelbrot.js'); // Simple demo Mandelbrot generator.
var mandelbrot = require('mandelbrot-handler.js'); // A more complex Mandelbrot generator.

// Simple HTTP server with some dispatch logic.
var server = connect.createServer(
  connect.profiler(),
  connect.favicon(__dirname + '/static/images/favicon.ico'),
  connect.logger(),
  connect.static(__dirname + '/html', { maxAge: 0}) // Static pages go here.
);

server.use('/simplemandelbrot', simplemandelbrot.handler(req, res));
server.use('/mandelbrot', mandelbrot.handler(req, res));

server.listen(80);
