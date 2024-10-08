var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList;
var SpeechRecognitionEvent =
  SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var colors = [
  "aqua",
  "azure",
  "beige",
  "bisque",
  "black",
  "blue",
  "brown",
  "chocolate",
  "coral",
  "crimson",
  "cyan",
  "fuchsia",
  "ghostwhite",
  "gold",
  "goldenrod",
  "gray",
  "green",
  "indigo",
  "ivory",
  "khaki",
  "lavender",
  "lime",
  "linen",
  "magenta",
  "maroon",
  "moccasin",
  "navy",
  "olive",
  "orange",
  "orchid",
  "peru",
  "pink",
  "plum",
  "purple",
  "red",
  "salmon",
  "sienna",
  "silver",
  "snow",
  "tan",
  "teal",
  "thistle",
  "tomato",
  "turquoise",
  "violet",
  "white",
  "yellow",
];

var recognition = new SpeechRecognition();
if (SpeechGrammarList) {
  // SpeechGrammarList is not currently available in Safari, and does not have any effect in any other browser.
  // This code is provided as a demonstration of possible capability. You may choose not to use it.
  var speechRecognitionList = new SpeechGrammarList();
  var grammar =
    "#JSGF V1.0; grammar colors; public <color> = " + colors.join(" | ") + " ;";
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
}
recognition.continuous = false;
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var diagnostic = document.querySelector(".output");
var bg = document.querySelector("html");
var hints = document.querySelector(".hints");

var colorHTML = "";
colors.forEach(function (v, i, a) {
  console.log(v, i);
  colorHTML += '<span style="background-color:' + v + ';"> ' + v + " </span>";
});
hints.innerHTML =
  "Tap/click then say a color to change the background color of the app. Try " +
  colorHTML +
  ".";

let isRecognizing = false;

document.body.onclick = function () {
  if (!isRecognizing) {
    recognition.start();
    diagnostic.textContent = "Ready to receive a color command.";
  }
};

recognition.onresult = function (event) {
  console.log(event);
  var color = event.results[0][0].transcript;
  diagnostic.textContent = "Result received: " + color + ".";
  if (!typeof color == "string") {
    color = `${color}`;
  }
  const cleanedStr = color.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
  bg.style.backgroundColor = cleanedStr;
  console.log("Confidence: " + event.results[0][0].confidence);
};

recognition.onnomatch = function (event) {
  diagnostic.textContent =
    "I didn't recognize that color. Event details: " +
    event.results[0][0].transcript;
};

recognition.onerror = function (event) {
  diagnostic.textContent = "Error occurred in recognition: " + event.error;
};

recognition.onspeechend = () => {
  isRecognizing = true;
  recognition.start();
};
