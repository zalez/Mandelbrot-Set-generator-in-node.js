/*
 * timer.js
 *
 * Simple timing functions.
 */

var time = 0, elapsed = 0;

exports.start = function() {
  time = Date.now();
  return;
}

exports.stop = function() {
  elapsed = Date.now() - time;
  return elapsed;
}
