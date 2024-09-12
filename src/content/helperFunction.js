const bannedCharacters = [
  "'",
  '"',
  "(",
  ")",
  "[",
  "]",
  "{",
  "}",
  "<",
  ">",
  ".",
  ",",
  "'",
];

function isEditableElement(node) {
  const editableElements = ["INPUT", "TEXTAREA", "FORM"];
  const element =
    node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
  return (
    editableElements.includes(element.tagName) || element.isContentEditable
  );
}

// Preprocess the selected word to remove apostrophe contractions
export const preprocessWord = (word) => {
  const contractions = [
    "'s",
    "’s",
    "'ve",
    "’ve",
    "'re",
    "’re",
    "'t",
    "’t",
    "'d",
    "’d",
    "'ll",
    "’ll",
    "'m",
    "’m",
  ];
  let processedWord = word;

  for (const contraction of contractions) {
    if (processedWord.endsWith(contraction)) {
      processedWord = processedWord.slice(0, -contraction.length);
      break; // Stop after removing one contraction
    }
  }

  return processedWord.trim();
};

export function isInvalidSelection(selection) {
  return (
    bannedCharacters.includes(selection.toString().trim()) ||
    isEditableElement(selection.anchorNode)
  );
}

export function extractSentence(selection) {
  if (selection.rangeCount === 0) return null;

  let range = selection.getRangeAt(0);
  let startNode = range.startContainer;
  let endNode = range.endContainer;
  let commonAncestor = range.commonAncestorContainer;

  // If the common ancestor is a text node, move up to its parent
  if (commonAncestor.nodeType === Node.TEXT_NODE) {
    commonAncestor = commonAncestor.parentNode;
  }

  let textContent = commonAncestor.textContent;
  let startOffset =
    getTextOffset(commonAncestor, startNode) + range.startOffset;
  let endOffset = getTextOffset(commonAncestor, endNode) + range.endOffset;

  // Find the start of the sentence
  let sentenceStart = startOffset;
  while (sentenceStart > 0 && !".!?".includes(textContent[sentenceStart - 1])) {
    sentenceStart--;
  }

  // Find the end of the sentence
  let sentenceEnd = endOffset;
  while (
    sentenceEnd < textContent.length &&
    !".!?".includes(textContent[sentenceEnd])
  ) {
    sentenceEnd++;
  }
  sentenceEnd++; // Include the period

  // Extract the sentence
  let sentence = textContent.substring(sentenceStart, sentenceEnd).trim();
  return sentence;
}

// Helper function to get the text offset of a node relative to its ancestor
function getTextOffset(ancestor, node) {
  let offset = 0;
  let walker = document.createTreeWalker(ancestor, NodeFilter.SHOW_TEXT);
  while (walker.nextNode() && walker.currentNode !== node) {
    offset += walker.currentNode.length;
  }
  return offset;
}
