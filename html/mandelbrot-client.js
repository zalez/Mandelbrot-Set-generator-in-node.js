/*
 * User interface for Mandelbrot web service on http://constantin.glez.de/mandelbrot
 */

// Constants
const imageDivId = "mandelbrot-image-div";
const imageId = "mandelbrot-image-img";
const paramsDivId = "mandelbrot-image-div";
const reDisplayId = "mandelbrot-params-re";
const imDisplayId = "mandelbrot-params-im";
const maxDisplayId = "mandelbrot-params-max";
const ppuDisplayId = "mandelbrot-params-ppu";
const aaDisplayId = "mandelbrot-params-aa";
const optDisplayId = "mandelbrot-params-opt";
const controlsDivId = "mandelbrot-controls-div";

const imageBaseURL = "http://constantin.no.de/mandelbrot/image.png?";

const aaValues = [
  "No Antialiasing",
  "Simple: 3x3 Antialiasing, Gaussian filter",
  "Good: 3x3 Antialiasing, Mitchell/Netravali filter",
  "Better: 5x5 Antialiasing, Gaussian filter",
  "Best: 5x5 Antialiasing, Mitchell/Netravali filter"
];

const optValues = [
  "Default Optimization Level",
  "No Optimization",
  "Check for 2 biggest bulbs",
  "Subdivide areas, search for black circumferences",
  "Both subdivision and known bulb check",
  "Adaptive: Per-area optimization (experimental)"
];

// Default configuration of the Mandelbrot view to be rendered.
const defaultModel = {
  re: -0.75,
  im: 0.0,
  size: 512,
  max: 100,
  ppu: 150,
  aa: 0,
  opt: 0
};

var image = null;    // The <img> element that contains the Mandelbrot image.
var params = null;   // The <div> element that displays the current parameters.
var reDisplaySpan = null; // The <span> element that displays the real value of the center value for c.
var imDisplaySpan = null; // The <span> element that didplays the imaginary value of the center for c.
var ppuDisplaySpan = null; // The <span> element that displays the pixel per unit zoom value.
var controls = null; // The <div> element that containes the controls.
var model = null;    // The Mandelbrot view configuration.

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

// Update the anti-aliasing settings and trigger an update of the image.
function updateAA(select) {
  var value = select.options[select.selectedIndex].value;

  if (model.aa != value) {
    model.aa = value;
    updateImage();
  }
  return;
}

// Update the optimization settings and trigger an update of the image.
function updateOpt(select) {
  var value = select.options[select.selectedIndex].value;

  if (model.opt != value) {
    model.opt = value;
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

// Increase the iteration depth.
function deeper() {
  model.max = model.max * 2;
  updateImage();

  var depthDisplayElement = document.getElementById(maxDisplayId);
  depthDisplayElement.replaceChild(document.createTextNode(model.max), depthDisplayElement.firstChild);

  return;
}

// Find the x,y coordinates of a given element on the page.
// Code from here: http://www.quirksmode.org/js/findpos.html
function findPos(obj) {
  var curleft = curtop = 0;
  if (obj.offsetParent) {
    do {
      curleft += obj.offsetLeft;
      curtop +=obj.offsetTop;
    } while (obj = obj.offsetParent);
  }
  return [curleft, curtop];
}


// Figure out the new center position for the image. (onclick handler)
function newPosition(e) {
  var imageElement = document.getElementById(imageId);
  var imageXY = findPos(imageElement);

  var x = e.pageX - imageXY[0];
  var y = e.pageY - imageXY[1];

  model.re = model.re - (model.size/model.ppu)/2 + x / model.ppu;
  model.im = model.im + (model.size/model.ppu)/2 - y / model.ppu;

  updateImage();

  return;
}

// Create the DOM elements needed to display the image.
function createImage() {
  image = document.createElement("img");

  image.alt = "The Mandelbrot Set";
  image.onclick = function() { newPosition(event); }
  image.onload = function() { updateParams(); }
  image.id = imageId;
  document.getElementById(imageDivId).appendChild(image);
  updateImage();

  return;
}

// Create the DOM elements that display the current parameters.
function createParams() {
  // Display center coordinates in the complex plane.
  var reimDisplayDiv = document.createElement("div");

  reimDisplayDiv.appendChild(document.createTextNode("Center: "));

  reDisplaySpan = document.createElement("span");
  reDisplaySpan.id = reDisplayId;
  reimDisplayDiv.appendChild(reDisplaySpan);

  reimDisplayDiv.appendChild(document.createTextNode(" + "));

  imDisplaySpan = document.createElement("span");
  imDisplaySpan.id = imDisplayId;
  reimDisplayDiv.appendChild(imDisplaySpan);

  reimDisplayDiv.appendChild(document.createTextNode("i"));

  // Display zoom level (pixels per unit)
  var ppuDisplayDiv = document.createElement("div");

  ppuDisplayDiv.appendChild(document.createTextNode("Zoom level: "));
  ppuDisplaySpan = document.createElement("span");
  ppuDisplaySpan.id = ppuDisplayId;
  ppuDisplayDiv.appendChild(ppuDisplaySpan);
  ppuDisplayDiv.appendChild(document.createTextNode(" pixel per unit.");

  params = document.getElementById(paramsDivId);
  params.appendChild(reimDisplayDiv);
  params.appendChild(ppuDisplayDiv);

  return;
}

// Update parameter display section with current values.
function updateParams() {
  var text = document.createTextNode(model.re);

  if (reDisplaySpan) {
    if (reDisplaySpan.firstChild) {
      reDisplaySpan.replaceChild(text, reDisplaySpan.firstChild);
    } else {
      reDisplaySpan.appendChild(text);
    }
  }

  text = document.createTextNode(model.im);

  if (imDisplaySpan) {
    if (imDisplaySpan.firstChild) {
      imDisplaySpan.replaceChild(text, imDisplaySpan.firstChild);
    } else {
      imDisplaySpan.appendChild(text);
    }
  }

  text = document.createTextNode(model.ppu);

  if (ppuDisplaySpan) {
    if (ppuDisplaySpan.firstChild) {
      ppuDisplaySpan.replaceChild(text, ppuDisplaySpan.firstChild);
    } else {
      ppuDisplaySpan.appendChild(text);
    }
  }

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

  // Optimization controls: A popup menu with options.
  var optSelection = document.createElement("select");
  optSelection.name = "optSelect";
  optSelection.onchange = function() { updateOpt(this); };

  var optOption;
  for (var i = 0; i < optValues.length; i++) {
    optOption = document.createElement("option");
    optOption.value = i;
    if (i == model.opt) {
      optOption.selected = "selected";
    }
    optOption.appendChild(document.createTextNode(optValues[i]));
    optSelection.appendChild(optOption);
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
  maxDepthDisplay.id = maxDisplayId;
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
  form.appendChild(optSelection);
  form.appendChild(zoomButton);
  form.appendChild(maxDepth);

  controls = document.getElementById(controlsDivId);
  controls.appendChild(form);
}

// Initialize everything.
function init() {
  model = defaultModel;

  createImage();
  createParams();
  createControls();
}

// This writes three div tags at the place this script was loaded. They'll be filled
// with the Mandelbrot image and its controls.
document.write("<div id=\"" + imageDivId + "\"></div><div id=\"" + paramsDivId + "\"></div><div id=\"" + controlsDivId + "\"></div>\n");

// Initialize.
init();
