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

// This model carries the configuration of the Mandelbrot view to be rendered.
var model = new Object ({
  size: 512,
  max: 100,
  ppu: 150,
  aa: 0
});

var image = document.getElementById("mandelbrot_image");
var controls = document.getElementById("mandelbrot_controls");

function createControls() {

  var form = document.createElement("form");
  var aaSelection,aaOption;

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
  createControls();
  updateImage();
}

function updateImage() {
  var url = "http://constantin.no.de/mandelbrot/image.png?";

  var keys = model.keys();
  for (var i = 0; i < keys.length; i++) {
    url += keys[i] + "=" + model[keys[i]] + "&";
  }

  image.src = url;
}

init();
