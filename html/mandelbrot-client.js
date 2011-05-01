/*
 * User interface for Mandelbrot web service on http://constantin.glez.de/mandelbrot
 */

// Constants
const aaValues = [
  "No Antialiasing",
  "Simple: 3x3 Antialiasing, Gaussian filter",
  "Good: 3x3 Antialiasing, Mitchell/Netravali filter",
  "Better: 5x5 Antialiasing, Gaussian filter",
  "Best: 5x5 Antialiasing, Mitchell/Netravali filter"
];

// Default configuration of the Mandelbrot view to be rendered.
const defaultModel = {
  size: 512,
  max: 100,
  ppu: 150,
  aa: 0
};

var image;    // The <img> element that contains the Mandelbrot image.
var controls; // The <div> element that containes the controls.
var model;    // The Mandelbrot view configuration.

function createImage() {
  image = document.createElement("img");

  image.alt = "The Mandelbrot Set";
  document.getElementById("mandelbrot_image").addChild(image);
  updateImage();
}

function createControls() {
  var form = document.createElement("form");
  var aaSelection,aaOption;

  controls = document.getElementById("mandelbrot_controls");

  aaSelection = document.createElement("select");

  for (var i = 0; i < aaValues.length; i++) {
    aaOption = document.createElement("option");
    aaOption.value = i;
    aaOption.appendChild(document.createTextNode(aaValues[i]));
    aaSelection.appendChild(aaOption);
  }

  form.appendChild(aaSelection);
  controls.appendChild(form);
}

function init() {
  model = new Object(defaultModel);

  createImage();
  createControls();
}

function updateImage() {
  var url = "http://constantin.no.de/mandelbrot/image.png?";

  var keys = model.keys();
  for (var i = 0; i < keys.length; i++) {
    url += keys[i] + "=" + model[keys[i]] + "&";
  }

  image.src = url;
}

document.write("<div id=\"mandelbrot-image\"></div><div id=\"mandelbrot-controls\"></div>\n");
init();
