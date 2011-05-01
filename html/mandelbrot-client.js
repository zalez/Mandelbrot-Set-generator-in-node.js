/*
 * User interface for Mandelbrot web service on http://constantin.glez.de/mandelbrot
 */

// Constants
const imageDivId = "mandelbrot-image";
const controlsDivId = "mandelbrot-controls";
const imageBaseURL = "http://constantin.no.de/mandelbrot/image.png?";
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

// Update the mandelbrot image with a new set of parameters.
function updateImage() {
  var url = imageBaseURL;

  // Convert all keys in our model to URL parameters.
  for (var key in model) {
    url += key + "=" + model[key] + "&";
  }

  // Truncate the last & if we added parameters.
  if (url != imageBaseURL) {
    url = url.substring(0, url.length - 1);
  }

  // Update the URL of the image. This will trigger a reload.
  image.src = url;

  return;
}

// Create the DOM elements needed to display the image.
function createImage() {
  image = document.createElement("img");

  image.alt = "The Mandelbrot Set";
  document.getElementById(imageDivId).appendChild(image);
  updateImage();

  return;
}

// Update the anti-aliasing settings and trigger an update of the image.
function updateAA(select) {
  var value = select.form.aaSelect.options[select.form.aaSelect.selectedIndex].value;

  if (model.aa != value) {
    model.aa = value;
    updateImage();
  }
  return;
}

// Create the DOM elements needed for the controls.
function createControls() {
  controls = document.getElementById(controlsDivId);

  var form = document.createElement("form");
  form.name = "aaForm";

  var aaSelection = document.createElement("select");
  aaSelection.name = "aaSelect";
  aaSelection.onchange="updateAA(this)";

  var aaOption;
  for (var i = 0; i < aaValues.length; i++) {
    aaOption = document.createElement("option");
    aaOption.value = i;
    aaOption.appendChild(document.createTextNode(aaValues[i]));
    aaSelection.appendChild(aaOption);
  }

  form.appendChild(aaSelection);
  controls.appendChild(form);
}

// Initialize everything.
function init() {
  model = defaultModel;

  createImage();
  createControls();
}

// This writes two div tags at the place this script was loaded. They'll be filled
// with the Mandelbrot image and its controls.
document.write("<div id=\"" + imageDivId + "\"></div><div id=\"" + controlsDivId + "\"></div>\n");

// Initialize.
init();
