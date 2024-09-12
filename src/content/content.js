import {
  extractSentence,
  isInvalidSelection,
  preprocessWord,
} from "./helperFunction.js";

// Constants
const IFRAME_WIDTH = 450;
const IFRAME_HEIGHT = 300;

async function createIframe(rect, word, sentence) {
  const iframe = document.createElement("iframe");
  iframe.src = chrome.runtime.getURL("content-popup.html");
  iframe.style.cssText = `
    all: unset;
    position: absolute;
    left: ${rect.left + window.scrollX}px;
    top: ${rect.bottom + window.scrollY + 10}px;
    z-index: 10000;
    border: none;
    width: ${IFRAME_WIDTH}px;
    height: ${IFRAME_HEIGHT}px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  `;
  // Wait for the iframe to load before sending the message
  iframe.onload = () => {
    iframe.contentWindow.postMessage(
      { action: "wordRequest", word, sentence },
      "*"
    );
  };

  return iframe;
}

function getSelectionPosition(selection) {
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  return rect;
}

document.addEventListener("dblclick", async function (event) {
  let selection = window.getSelection();
  if (isInvalidSelection(selection)) {
    return;
  }
  const processedWord = preprocessWord(selection.toString().trim());
  const selectedSentence = extractSentence(selection);
  if (processedWord) {
    const iframePosition = getSelectionPosition(selection);
    const iframe = await createIframe(
      iframePosition,
      processedWord,
      selectedSentence
    );
    addClickOutsideListener(iframe);

    document.body.appendChild(iframe);
  }
});

function addClickOutsideListener(iframe) {
  function handleClickOutside(event) {
    if (event.target !== iframe && !iframe.contains(event.target)) {
      iframe.remove();
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }

  // Use a slight delay to avoid immediate triggering
  setTimeout(() => {
    document.addEventListener("mousedown", handleClickOutside);
  }, 50);
}
