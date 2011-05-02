/*
 * User interface for Mandelbrot web service on http://constantin.glez.de/mandelbrot
 */

// Constants
const imageDivId = "mandelbrot-image";
const controlsDivId = "mandelbrot-controls";
const depthDisplayId = "depthDisplay";

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
  re: -0.75,
  im: 0.0,
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

  // Add a timestamp to the end of the URL to prevent caching.
  url += "date=" + new Date().getTime();

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
  var value = select.options[select.selectedIndex].value;

  if (model.aa != value) {
    model.aa = value;
    updateImage();
  }
  return;
}

// Zoom deeper into the Mandelbrot Set.
function zoom() {
  model.ppu = model.ppu * 2;
  updateImage();

  return;
}

function deeper() {
  model.max = model.max * 2;
  updateImage();

  var depthDisplayElement = document.getElementById(depthDisplayId);
  depthDisplayElement.replaceChild(document.createTextNode(model.max), depthDisplayElement.firstChild);

  return;
}

// Create the DOM elements needed for the controls.
function createControls() {
  // Antialiasing controls: A popup menu with options.
  var aaSelection = document.createElement("select");
  aaSelection.name = "aaSelect";
  aaSelection.onchange = function() { updateAA(this); };

  var aaOption;
  for (var i = 0; i < aaValues.length; i++) {
    aaOption = document.createElement("option");
    aaOption.value = i;
    if (i == model.aa) {
      aaOption.selected = "selected";
    }
    aaOption.appendChild(document.createTextNode(aaValues[i]));
    aaSelection.appendChild(aaOption);
  }

  // Zoom button: 2x zoom at every press.
  var zoomButton = document.createElement("input");
  zoomButton.type = "button";
  zoomButton.value = "Zoom";
  zoomButton.onclick = function() { zoom(); };

  // Increase Maximum number of recursions.
  var maxDepth = document.createElement("div");
  maxDepth.id="maxDepth";
  maxDepth.appendChild(document.createTextNode("Maximum depth: "));

  var maxDepthDisplay = document.createElement("span");
  maxDepthDisplay.id = depthDisplayId;
  maxDepthDisplay.appendChild(document.createTextNode(model.max));
  maxDepth.appendChild(maxDepthDisplay);
  
  var maxDepthButton = document.createElement("input");
  maxDepthButton.type = "button";
  maxDepthButton.value = "Deeper";
  maxDepthButton.onclick =  function() { deeper(); };
  maxDepth.appendChild(maxDepthButton);

  var form = document.createElement("form");
  form.name = "aaForm";
  form.appendChild(aaSelection);
  form.appendChild(zoomButton);
  form.appendChild(maxDepth);

  controls = document.getElementById(controlsDivId);
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
