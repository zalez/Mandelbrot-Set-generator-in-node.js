/*
 * User interface for Mandelbrot web service on http://constantin.glez.de/mandelbrot
 */

// Constants
const imageDivId="mandelbrot-image";
const controlsDivId="mandelbrot-controls";

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
  document.getElementById(imageDivId).appendChild(image);
  updateImage();
}

function createControls() {
  var form = document.createElement("form");
  var aaSelection,aaOption;

  controls = document.getElementById(controlsDivId);

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
  model = defaultModel;

  createImage();
  createControls();
}

function updateImage() {
  var url = "http://constantin.no.de/mandelbrot/image.png?";

  for (var key in model) {
    url += key + "=" + model[key] + "&";
  }

  image.src = url;
}

document.write("<div id=\"" + imageDivId + "\"></div><div id=\"" + controlsDivId + "\"></div>\n");
init();
