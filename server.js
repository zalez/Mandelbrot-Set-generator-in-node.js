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

function do_simplemandelbrot(req, res) {
  res.writeHead(200, { "Content-Type": "image/png" })
  res.end(simplemandelbrot.render(), 'binary');
}

// Simple HTTP server with some dispatch logic.
var server = connect.createServer(
  connect.favicon(__dirname + '/images/favicon.ico'),
  connect.logger()
);

server.listen(80);
