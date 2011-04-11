/*
 * server.js
 *
 * A simple connect HTTP server, used to dispatch to more interesting functions.
 *
 */

// Modules we want to use.
var connect = require('connect');

// Our self-written modules.
var simplemandelbrot = require('simplemandelbrot.js');

// Simple HTTP server with some dispatch logic.
var server = connect.createServer(
  connect.profiler(),
  connect.favicon(__dirname + '/static/images/favicon.ico'),
  connect.logger()
);

server.use('/simplemandelbrot', simplemandelbrot.handler);

server.listen(80);
