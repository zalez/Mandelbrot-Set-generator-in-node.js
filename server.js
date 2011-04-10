/*
 * server.js
 *
 * A simple HTTP server in node, used to dispatch to more interesting scripts.
 *
 */

// Modules we want to use.
var http = require('http');
var url = require('url');

function do_simplemandelbrot(req, res) {
  res.writeHead(200, { "Content-Type": "text/plain" })
  res.end("Prepare for some Mandelbrot action!");
}

// Simple HTTP server with some dispatch logic.
var server = http.createServer(function (req, res) {
  requrl = url.parse(req.url);
  switch(requrl.pathname) {
    case '/simplemandelbrot':
      do_simplemandelbrot(req, res);
    default:
      res.writeHead(200, { "Content-Type": "text/plain" })
      res.end("Sorry, can't find path \"" + requrl.pathname + "\".");
  }
});
 
server.listen(process.env.PORT || 8001);

